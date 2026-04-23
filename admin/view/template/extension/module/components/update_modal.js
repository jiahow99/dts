const { base_url } = window.appConfig;
const { ref, defineComponent, defineAsyncComponent } = Vue;

const Order = defineAsyncComponent(() => import(`${base_url}/extension/module/components/order.js`));
const Closebtn = defineAsyncComponent(() => import(`${base_url}/extension/module/components/close_btn.js`));

export default defineComponent({
  components: {
    Order, Closebtn
  },
  props: ['order', 'type', 'toggleConfirm', 'getRoute'],
  template: `
    <div class="z-40 fixed top-0 left-0 w-screen h-screen bg-black/70 flex justify-center items-center">
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
          :show-final-qty="true"
          :disable-ro="true"
          :get-route="getRoute"
          button-label="Submit"
        ></Order>
      </div>
    </div>
  `,
  setup() {
  },
});
