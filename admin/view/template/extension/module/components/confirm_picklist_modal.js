const { base_url } = window.appConfig;
const { defineComponent, defineAsyncComponent } = Vue;

const Closebtn = defineAsyncComponent(() => import(`${base_url}/extension/module/components/close_btn.js`));

export default defineComponent({
  components: {
    Closebtn,
  },
  props: [
    'batches', 
  ],
  template: `
    <div class="z-40 fixed top-0 left-0 w-screen h-screen bg-black/70 flex justify-center items-center">
      <div class="w-11/12 mx-auto bg-white rounded-2xl p-4">
        <!-- Close Btn -->
        <Closebtn @click="$emit('close')" class="mb-10"></Closebtn>
        <!-- Confirm -->
        <h1 class="text-2xl font-semibold text-center">Generate Pick List ?</h1>
        <p class="mt-3 text-black/70 text-center">Batches
          <span class="font-bold">{{ batches.map(b => b.warehouse_order_batch_name ).join(', ') }}</span> will be generated as 1 picklist.</p>
        <div class="flex gap-2 mt-5">
          <!-- Cancel -->
          <button @click="$emit('close')" class="w-1/2 border-2 rounded-md bg-gray-600 text-white py-2 mdc-ripple-surface">Cancel</button>
          <!-- Confirm -->
          <button @click="$emit('confirm')" class="w-1/2 border-2 rounded-md bg-green-600 text-white py-2 mdc-ripple-surface">Generate</button>
        </div>
      </div>
    </div>
  `,
  setup(props) {
  }
});
