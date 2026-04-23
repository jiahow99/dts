const { createApp, ref, onMounted, computed } = Vue;

import { useDc } from '../../mixins/useDc.js';
import Layout from '../../layout/main.js';
import Secondtab from '../../components/second_tab.js';
import Order from '../../components/order.js';
import Loading from '../../components/loading.js';
import Ordermodal from '../../components/order_modal.js';
import Updatemodal from '../../components/update_modal.js';
import Confirmactionmodal from '../../components/confirm_action_modal.js';
import Changedriver from '../../components/change_driver.js';
import Confirmrevert from '../../components/confirm_revert.js';
import Nodata from '../../components/no_data.js';
import Confirmgeneratedo from '../../components/confirm_generate_do.js';
import Filterbtn from '../../components/filter_btn.js';
import Filtermodal from '../../components/filter_modal.js';
import Driverinfo from '../../components/driver_info.js';
import Revertbtn from '../../components/revert_btn.js';
import Btn from '../../components/btn.js';
import Dcorder from '../../components/dc_order.js';
import Confirmmodal from '../../components/confirm_modal.js';

createApp({
  components: {
    Layout,
    Secondtab,
    Order,
    Loading,
    Ordermodal,
    Updatemodal,
    Confirmactionmodal,
    Changedriver,
    Confirmrevert,
    Nodata,
    Confirmgeneratedo,
    Filtermodal,
    Filterbtn,
    Driverinfo,
    Revertbtn,
    Btn,
    Dcorder,
    Confirmmodal,
  },
  setup() {
    const { sideMenus, totalOverdue, totalRevert, totalPickup, totalNew, getRoute } = useDc();

    const page = ref(1);
    const limit = ref(10);

    const loading = ref(false);
    const activeTab = ref("New");
    const secondActiveTab = ref("MO Area");

    const selectedZone = ref({});
    const orderStatus = ref("processed");

    const showFilter = ref(false);

    const customerOrders = ref([]);
    const orders = ref([]);
    const checkedOrders = ref([]);

    const selectedOrder = ref(null);
    const showOrder = ref(false);

    const confirmModal = ref(null);
    const showConfirm = ref(false);
    const confirmAction = ref(() => {});

    const deliveryZones = ref([]);

    const tabs = computed(() => {
      return [
        { label: "New", event: () => toggleTab("New"), total: totalNew.value },
        { label: "Pickup", event: () => toggleTab("Pickup") },
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
      checkedOrders.value = [];

      if (tab == "New") {
        // Reset every filter except delivery zone
        Object.keys(filterData.value).forEach((key) => {
          if (key !== "delivery_zone_id") filterData.value[key] = "";
        });

        const params = new URLSearchParams(window.location.search);
        if (params.has("delivery_zone_id")) {
          filterData.value.delivery_zone_id = params.get("delivery_zone_id");
        }
        selectedZone.value = {};
        await fetch("processed");
        openSelectedZone();
      } else if (tab == "Ready To Ship") {
        filterData.value.delivery_zone_id = "";
        fetch("ready_to_ship");
      } else if (tab == "Pickup") {
        filterData.value.delivery_zone_id = "";
        fetch("pickup");
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

    // Toggle filter modal
    const toggleFilter = (value) => {
      showFilter.value = value;
    };

    // Order checkbox oncheck
    const handleOnCheck = (checked, order) => {
      if (checked) {
        if (checkedOrders.value.includes(order)) return;
        checkedOrders.value.push(order);
      } else {
        checkedOrders.value = checkedOrders.value.filter(
          (x) => x.order_id != order.order_id
        );
      }
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

      const now = new Date();
      const url = getRoute("orders", {
        status,
        ...filterData.value,
        delivery_date: `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}/${now.getFullYear()}`,
        page: page.value,
        limit: limit.value,
      });

      try {
        const { data } = await axios.get(url);

        deliveryZones.value = data.delivery_zones;
        
        if (orderStatus.value == "processed") {
          customerOrders.value = data.orders;
        } else {
          orders.value = orders.value.concat(data.orders);
        }
        
        totalNew.value = data.total.processed;
        totalPickup.value = data.total.pickup;
        totalRevert.value = data.total.revert;
        totalOverdue.value = data.total.overdue;
  
        // Update delivery_zone_id in params
        if (selectedZone.value.delivery_zone_id) {
          appendParamsToUrl({
            delivery_zone_id: selectedZone.value.delivery_zone_id,
          });
        }          
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };

    // Get total order in delivery zone
    const getZoneTotalOrder = (delivery_zone_id) => {
      const result = deliveryZones.value.find(
        (z) => z.delivery_zone_id == delivery_zone_id
      );
      return result.total;
    };

    // Toggle order modal
    const toggleOrder = (order = null) => {
      selectedOrder.value = order;
      showOrder.value = order != null ? true : false;
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

    const showRevert = (order) => {
      if (confirmModal.value) {
        confirmModal.value.open(
          `Revert Order ?`,
          `Order <b>#${order.order_id}</b> will be revert back to original status.`
        );
        confirmAction.value = () => revert(order);
      }
    };

    // Revert order
    const revert = async (order) => {
      loading.value = true;

      const url = getRoute("revert");
      const response = await axios.post(url, { order_id: order.order_id });

      if (response.data.success) {
        toast(response.data.success);
      } else {
        toast(response.data.error, "error");
      }

      await toggleTab("New");
    };

    // Call db to generate delivery order (DO)
    const generateDO = async () => {
      loading.value = true;

      const selected = checkedOrders.value.map((order) => order.order_id);
      const do_url = getRoute("sale/order/delivery_order", {}, true);
      const mark_pickup_url = getRoute("markPickup");

      try {
        const generate_do = await axios.post(do_url, { selected });
        const mark_pickup = await axios.post(mark_pickup_url, { selected });

        checkedOrders.value = [];

        toast("Delivery Order generated !");
        toggleTab("Pickup");
      } catch (e) {
        toast(e, "error");
      } finally {
        loading.value = false;
      }
    };

    // Filter data
    const filterData = ref({
      customer: "",
      order_id: "",
      delivery_date: "",
      doc_no: "",
    });

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

    // Hide clear filter in 'New'
    const hideClearFilter = computed(() => {
      var hide = false;
      for (const key in filterData.value) {
        if (key == "delivery_zone_id" && filterData.value[key] != "") {
          hide = true;
        }
        if (key != "delivery_zone_id" && filterData.value[key] != "") {
          hide = false;
        }
      }
      return hide;
    });

    // Has apply filter
    const hasFilter = computed(() => {
      return Object.keys(filterData.value).some((key) => {
        const value = filterData.value[key];
        return value != "";
      });
    });

    // Load more
    const loadMore = () => {
      page.value += 1;
      fetch(orderStatus.value);
    };

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
      const data = {
        orders: customer.orders.map((order) => ({
          order_id: order.order_id,
          products: order.products.map((product) => ({
            order_product_id: product.order_product_id,
            partial_weights: product.partial_weights,
            dc_qty: product.dc_qty,
            weight: product.weight,
            checked: 1,
          })),
        })),
      };
      // Call db
      try {
        loading.value = true;
        const response = await axios.post(getRoute("completeOrders"), data);

        if (response.data.success) {
          toast(response.data.success);
          clearFilter(["delivery_zone_id"]);
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
      loading.value = true;
      const url = getRoute("completeOrders");
      const data = {
        orders: [],
      };
      customerOrders.value.forEach((customer) => {
        customer.orders.forEach((o) => {
          o.products.forEach((product) => {
            data.orders.push({
              order_id: o.order_id,
              order_product_id: product.order_product_id,
              dc_qty: product.dc_qty,
              weight: product.weight,
              checked: 1,
            });
          });
        });
      });
      // Call db
      try {
        const response = await axios.post(url, data);
        if (response.data.success) {
          toast(response.data.success);
          clearFilter(["delivery_zone_id"]);
          fetch("processed");
        } else if (response.data.error) {
          toast(response.data.error, "error");
        }
      } catch (error) {
        toast(error.message, "error");
      }
    };

    onMounted(async () => {
      await fetch("processed");
      openSelectedZone();
    });

    return {
      sideMenus,
      loading,
      orders,
      checkedOrders,
      tabs,
      activeTab,
      secondActiveTab,
      selectedOrder,
      showOrder,
      toggleOrder,
      deliveryZones,
      revert,
      showRevert,
      toggleDeliveryZone,
      generateDO,
      showFilter,
      toggleFilter,
      handleFilter,
      filterData,
      handleOnCheck,
      clearFilter,
      hasFilter,
      getRoute,
      loadMore,
      totalRevert,
      selectedZone,
      hideClearFilter,
      getZoneTotalOrder,
      customerOrders,
      showSubmit,
      showSubmitAll,
      submitAll,
      showConfirm,
      confirmAction,
      confirmModal,
      totalPickup,
      totalNew,
    };
  },
}).mount("#app");
