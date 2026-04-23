const { base_url } = window.appConfig;
const { defineAsyncComponent, defineComponent } = Vue;

const Closebtn = defineAsyncComponent(() => import(`${base_url}/extension/module/components/close_btn.js`));
const Order = defineAsyncComponent(() => import(`${base_url}/extension/module/components/order.js`));

export default defineComponent({
  components: {
    Order, Closebtn
  },
  props: [
    'order', 
    'type', 
    'products', 
    'toggleConfirm', 
    'showUpdate', 
    'disableUpdate', 
    'hideButton', 
    'buttonLabel',
    'showWarehouseQty',
    'disableWarehouseQty',
    'showFinalQty',
    'disableFinalQty',
  ],
  template: `
    <div class="z-50 fixed top-0 left-0 w-screen h-screen bg-black/70 flex justify-center items-center snap-none">
      <div class="bg-white rounded-md pt-2 w-11/12">
        <!-- Close -->
        <Closebtn @click="$emit('cancel')" class="mb-2"></Closebtn>
        <!-- Order -->
        <Order 
          :type="type"
          :order="order"
          :products="order.products"
          @cancel="$emit('cancel')"
          @confirm="$emit('confirm')"
          :with-close-btn="true"
          :hide-show-more="true"
          :hide-checkbox="true"
          :include-photo="true"
          :show-update="showUpdate"
          :show-warehouse-qty="showWarehouseQty || false"
          :disable-warehouse-qty="disableWarehouseQty || false"
          :show-final-qty="showFinalQty || false"
          :disable-final-qty="disableFinalQty || false"
          :hide-button="hideButton"
          :button-label="buttonLabel"
          :disable-update="disableUpdate"
        ></Order>
      </div>
    </div>
  `,
  setup() {
  },
});
