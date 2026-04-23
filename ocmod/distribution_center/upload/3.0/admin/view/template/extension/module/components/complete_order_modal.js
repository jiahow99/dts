const { defineComponent } = Vue;

import Closebtn from './close_btn.js';
import Order from './order.js';

export default defineComponent({
  components: {
    Closebtn, Order
  },
  props: ['order', 'initialValue', 'getRoute'],
  template: `
    <div class="z-40 fixed top-0 left-0 w-screen h-screen bg-black/70 flex justify-center items-center">
      <div class="bg-white rounded-md pt-2 w-11/12">
        <!-- Close -->
        <Closebtn @click="$emit('close')" class="mb-2"></Closebtn>
        <!-- Order -->
        <Order 
          button-label="Update"
          :order="order"
          :hide-checkbox="true"
          :products="order.products"
          :hide-show-more="true"
          :show-warehouse-qty="true"
          :edit="true"
          :disable-ro="true"
          :get-route="getRoute"
          @confirm="$emit('confirm', order)"
        >
        </Order>
      </div>
    </div>
  `,
  setup(props) {
    return {
    }
  },
});
