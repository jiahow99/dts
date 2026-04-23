const { createApp, ref, onMounted, computed, watch } = Vue;

import { useDc } from '../../mixins/useDc.js';
import Layout from '../../layout/main.js';
import Secondtab from '../../components/second_tab.js';
import Order from '../../components/order.js';
import Loading from '../../components/loading.js';
import Changedriver from '../../components/change_driver.js';
import Nodata from '../../components/no_data.js';
import Filtermodal from '../../components/filter_modal.js';
import Btn from '../../components/btn.js';
import Dcorder from '../../components/dc_order.js';
import Confirmmodal from '../../components/confirm_modal.js';

createApp({
  components: {
    Layout,
    Secondtab,
    Order,
    Loading,
    Changedriver,
    Nodata,
    Filtermodal,
    Btn,
    Dcorder,
    Confirmmodal,
  },
  setup() {
    const { sideMenus, totalOverdue, totalRevert, getRoute } = useDc();

    const page = ref(1);
    const limit = ref(10);

    const loading = ref(false);
    const orderStatus = ref("processed");
    const activeTab = ref("Overdue Orders");
    const secondActiveTab = ref("");

    const allDeliveryZones = ref([]);
    const deliveryZones = ref([]);
    const selectedZone = ref({});

    const orders = ref([]);

    const showFilter = ref(false);

    const confirmModal = ref(null);
    const showConfirm = ref(false);
    const confirmAction = ref(() => {});

    const filterData = ref({
      customer: "",
      order_id: "",
      doc_no: "",
      delivery_date: "",
    });

    // Remove delivery date filter when tab = 'Overdue Orders'
    watch(activeTab, (newTab) => {
      if (newTab === "Overdue Orders") {
        delete filterData.value.delivery_date;
      } else {
        filterData.value.delivery_date = "";
      }
    });

    // Tabs
    const tabs = computed(() => {
      return [
        {
          label: "Overdue Orders",
          event: () => toggleTab("Overdue Orders"),
          total: totalOverdue.value,
        },
      ];
    });

    // Append params to url
    const appendParamsToUrl = (data = {}) => {
      const currentUrl = new URL(window.location.href);
      for (const [key, value] of Object.entries(data)) {
        currentUrl.searchParams.set(key, value);
      }
      window.history.pushState({}, "", currentUrl);
    };

    // Open selected delivery zone (if have)
    const openSelectedZone = () => {
      const delivery_zone_id = new URLSearchParams(window.location.search).get(
        "delivery_zone_id"
      );
      if (delivery_zone_id) {
        const zone = deliveryZones.value.find(
          (z) => z.delivery_zone_id == delivery_zone_id
        );
        if (zone) {
          toggleDeliveryZone(zone);
        }
      }
    };

    // Change tab
    const toggleTab = async (tab) => {
      activeTab.value = tab;

      if (tab == "Overdue") {
        // Reset every filter except delivery zone
        Object.keys(filterData.value).forEach((key) => {
          if (key !== "delivery_zone_id") filterData.value[key] = "";
        });

        const params = new URLSearchParams(window.location.search);
        if (params.has("delivery_zone_id")) {
          filterData.value.delivery_zone_id = params.get("delivery_zone_id");
        }
        selectedZone.value = {};
        await fetch("overdue");
        openSelectedZone();
      }
    };

    // Second active tab
    const toggleDeliveryZone = (zone, appendParams = false) => {
      if (selectedZone.value.delivery_zone_id == zone.delivery_zone_id) {
        selectedZone.value = {};
      } else {
        selectedZone.value = zone;
        filterData.value.delivery_zone_id = zone.delivery_zone_id;
        // Append delivery zone id to url
        if (appendParams) {
          appendParamsToUrl({
            delivery_zone_id: zone.delivery_zone_id,
          });
        }
        // Fetch
        fetch("processed", true);
      }
    };

    const hideClearFilter = computed(() => {
      return activeTab.value == "Overdue Orders";
    });

    // Toggle filter modal
    const toggleFilter = (value) => {
      showFilter.value = value;
    };

    // Fetch
    const fetch = async (status, reset = false) => {
      loading.value = true;

      let tabChanged = orderStatus.value != status;
      orderStatus.value = status;

      if (tabChanged || reset) {
        orders.value = [];
        page.value = 1;
      }

      const url = getRoute("overdue", {
        status,
        ...filterData.value,
        return_type: "json",
      });
      const { data } = await axios.get(url);

      allDeliveryZones.value = data.all_delivery_zones;
      deliveryZones.value = data.delivery_zones;
      orders.value = data.orders;

      totalOverdue.value = data.total.overdue;
      totalRevert.value = data.total.revert;

      loading.value = false;
      // Update delivery_zone_id in params
      if (selectedZone.value.delivery_zone_id) {
        appendParamsToUrl({
          delivery_zone_id: selectedZone.value.delivery_zone_id,
        });
      }
    };

    // Show toast message
    const toast = (message, type = "success") => {
      let background = "#16a34a";
      if (type == "error") {
        background = "#de2837";
      }
      Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true,
        style: {
          background,
        },
      }).showToast();
    };

    // Filter
    const handleFilter = (filters) => {
      toggleFilter(false);
      fetch(orderStatus.value, true);
    };

    // Clear filter
    const clearFilter = (except=[]) => {
      for (const key in filterData.value) {
        if (filterData.value.hasOwnProperty(key) && !except.includes(key)) {
          filterData.value[key] = "";
        }
      }
      fetch(orderStatus.value, true);
    };

    // Has apply filter
    const hasFilter = computed(() => {
      return Object.keys(filterData.value).some((key) => {
        const value = filterData.value[key];
        return value != "";
      });
    });

    // Show submit by customer (confirm)
    const showSubmit = (customer) => {
      if (confirmModal.value) {
        const customer_name =
          customer.shipping_firstname + customer.shipping_lastname;
        confirmModal.value.open(
          `Submit Orders`,
          `You're submitting all orders for this <b>${customer_name}</b>. Continue?`
        );
        confirmAction.value = () => submitByCustomer(customer);
      }
    };

    // Submit order
    const submitByCustomer = async (customer) => {
      try {
        const data = {
          orders: customer.orders.map((order) => ({
            order_id: order.order_id,
            products: order.products.map((product) => ({
              order_product_id: product.order_product_id,
              dc_qty: product.dc_qty,
              partial_weights: product.partial_weights,
              weight: product.weight,
              checked: 1,
            })),
          })),
        };
        loading.value = true;
        const response = await axios.post(getRoute("completeOrders"), data);

        if (response.data.success) {
          toast(response.data.success);
          clearFilter(['delivery_zone_id']);
          fetch("processed");
        } else if (response.data.error) {
          toast(response.data.error, "error");
        }
      } catch (error) {
        console.error(error);
      }
    };

    // Show submit all (confirm)
    const showSubmitAll = () => {
      if (confirmModal.value) {
        confirmModal.value.open(
          `${selectedZone.value.name} Orders`,
          `You're submitting all orders for this <b>${selectedZone.value.name}</b>. Continue?`
        );
        confirmAction.value = () => submitAll();
      }
    };

    // Submit all order by zone
    const submitAll = async () => {
      try {
        loading.value = true;
        const url = getRoute("completeOrders");
        const data = {
          orders: [],
        };
        orders.value.forEach((customer) => {
          customer.orders.forEach((o) => {
            o.products.forEach((product) => {
              data.orders.push({
                order_id: o.order_id,
                order_product_id: product.order_product_id,
                dc_qty: product.dc_qty,
                partial_weights: product.partial_weights,
                weight: product.weight,
                checked: 1,
              });
            });
          });
        });
        const response = await axios.post(url, data);
        if (response.data.success) {
          toast(response.data.success);
          clearFilter(['delivery_zone_id']);
          fetch("processed");
        } else if (response.data.error) {
          toast(response.data.error, "error");
        }
      } catch (error) {
        toast(error.message, "error");
      }
    };

    onMounted(async () => {
      await fetch("overdue");
      openSelectedZone();
    });

    return {
      sideMenus,
      loading,
      orders,
      tabs,
      activeTab,
      secondActiveTab,
      deliveryZones,
      toggleDeliveryZone,
      showFilter,
      toggleFilter,
      handleFilter,
      filterData,
      clearFilter,
      hasFilter,
      getRoute,
      totalRevert,
      selectedZone,
      showSubmit,
      showSubmitAll,
      submitAll,
      showConfirm,
      confirmAction,
      confirmModal,
      totalOverdue,
      allDeliveryZones,
      hideClearFilter,
    };
  },
}).mount("#app");
