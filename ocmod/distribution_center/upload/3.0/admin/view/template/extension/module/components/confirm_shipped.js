const { base_url } = window.appConfig;

const { defineComponent, defineAsyncComponent } = Vue;

const Closebtn = defineAsyncComponent(() => import(`${base_url}/extension/module/components/close_btn.js`));

export default defineComponent({
  components: {
    Closebtn,
  },
  props: [
    'order',
  ],
  template: `
    <div class="z-40 fixed top-0 left-0 w-screen h-screen bg-black/70 flex justify-center items-center">
      <div class="w-11/12 mx-auto bg-white rounded-2xl p-4">
        <!-- Close Btn -->
        <Closebtn @click="$emit('close')"></Closebtn>
        <!-- Confirm -->
        <h1 class="text-lg font-medium text-center">Submit Order Delivered ?</h1>
        <p class="mt-3 text-black/70 text-center">
            Order 
            <span class="font-medium text-black">#{{ order?.order_id }}</span> 
            will be marked as "Shipped" status.
        </p>
        <div class="flex gap-2 mt-10">
          <!-- Cancel -->
          <button @click="$emit('close')" class="w-1/2 border-2 rounded-md bg-red-500 text-white py-1 mdc-ripple-surface">Cancel</button>
          <!-- Confirm -->
          <button @click="$emit('confirm')" class="w-1/2 border-2 rounded-md bg-green-600 text-white py-1 mdc-ripple-surface">Proceed</button>
        </div>
      </div>
    </div>
  `,
  setup(props) {
  }
});
