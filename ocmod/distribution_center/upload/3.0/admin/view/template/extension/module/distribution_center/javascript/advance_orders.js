const { createApp, ref, onMounted, computed } = Vue;

import { useDc } from '../../mixins/useDc.js';
import Layout from '../../layout/main.js?t=1';
import Secondtab from '../../components/second_tab.js?t=1';
import Order from '../../components/order.js?t=1';
import Loading from '../../components/loading.js?t=1';
import Ordermodal from '../../components/order_modal.js?t=1';
import Updatemodal from '../../components/update_modal.js?t=1';
import Confirmactionmodal from '../../components/confirm_action_modal.js?t=1';
import Changedriver from '../../components/change_driver.js?t=1';
import Confirmrevert from '../../components/confirm_revert.js?t=1';
import Nodata from '../../components/no_data.js?t=1';
import Confirmgeneratedo from '../../components/confirm_generate_do.js?t=1';
import Filterbtn from '../../components/filter_btn.js?t=1';
import Filtermodal from '../../components/filter_modal.js?t=1';
import Bulkmenu from '../../components/bulk_menu.js?t=1';
import Driverinfo from '../../components/driver_info.js?t=1';
import Revertbtn from '../../components/revert_btn.js?t=1';
import Btn from '../../components/btn.js?t=1';

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
    Bulkmenu,
    Driverinfo,
    Revertbtn,
    Btn,
  },
  setup() {
    const { sideMenus, getRoute } = useDc();

    const page = ref(1);
    const limit = ref(10);

    const loading = ref(false);
    const activeTab = ref("Advance");

    const orderStatus = ref('advance');

    const showFilter = ref(false);

    const tabs = ref([
      {
        label: "Advance",
        event: () => {
          toggleTab("New", fetch('advance'));
        },
        total: 0,
      },
    ]);

    const orders = ref([]);
    const checkedOrders = ref([]);

    const selectedOrder = ref(null);
    const showOrder = ref(false);
    const showUpdate = ref(false);

    const showConfirmAction = ref(false);

    const showChangeDriver = ref(false);

    const showRevert = ref(false);

    const showGenerateDO = ref(false);

    const total = ref(0);

    // Change tab
    const toggleTab = (tab, callback = null) => {
      activeTab.value = tab;
      checkedOrders.value = [];
      if (typeof callback === "function") {
        callback();
      }
    };

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

      const url = getRoute("orders", {
        status: status,
        ...filterData.value,
        page: page.value,
        limit: limit.value,
      });
      const { data } = await axios.get(url);

      orders.value = orders.value.concat(data.orders);
      tabs.value[0].total = data.total.advance;

      loading.value = false;
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

    // Filter data
    const filterData = ref({
      customer: "",
      order_id: "",
      delivery_date: "",
    });

    // Filter
    const handleFilter = () => {
      toggleFilter(false);
      fetch(orderStatus.value, true);
    };

    // Clear filter
    const clearFilter = () => {
      for (const key in filterData.value) {
        if (filterData.value.hasOwnProperty(key)) {
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

    // Load more
    const loadMore = () => {
      page.value += 1;
      fetch(orderStatus.value);
    };

    onMounted(() => fetch(orderStatus.value));

    return {
      sideMenus,
      loading,
      orders,
      checkedOrders,
      total,
      tabs,
      activeTab,
      selectedOrder,
      showOrder,
      toggleOrder,
      showUpdate,
      showConfirmAction,
      showChangeDriver,
      showRevert,
      showFilter,
      toggleFilter,
      handleFilter,
      filterData,
      clearFilter,
      hasFilter,
      getRoute,
      loadMore,
    };
  },
}).mount("#app");
