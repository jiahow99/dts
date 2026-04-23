const { base_url } = window.appConfig;

const { defineComponent, defineAsyncComponent, ref } = Vue;

const Closebtn = defineAsyncComponent(() => import(`${base_url}/extension/module/components/close_btn.js`));

export default defineComponent({
  components: {
    Closebtn,
  },
  props: [
    'order', 
    'deliveryZones',
  ],
  template: `
    <div class="z-40 absolute top-0 left-0 w-screen h-screen bg-black/70 flex justify-center items-center">
      <div class="w-11/12 mx-auto bg-white rounded-2xl p-4">
        <!-- Close Btn -->
        <Closebtn @click="$emit('close')" class="mb-10"></Closebtn>
        <!-- Confirm -->
        <h1 class="text-2xl font-semibold text-center">Change Driver ?</h1>
        <p class="mt-3">Please select delivery zone :</p>
        <select v-model="deliveryZoneId" class="mt-1 w-full py-1 rounded-md border-2 border-black/60">
            <option value="">-- Please Select --</option>
            <option 
              v-for="zone in deliveryZones" 
              :key="zone.delivery_zone_id" 
              :value="zone.delivery_zone_id"
            >
              {{ zone.name }} - {{ zone.driver }}
            </option>
        </select>
        <div class="flex gap-2 mt-5">
          <!-- Cancel -->
          <button @click="$emit('close')" class="w-1/2 border-2 rounded-md bg-gray-600 text-white py-2 mdc-ripple-surface">Cancel</button>
          <!-- Confirm -->
          <button @click="$emit('confirm', order, deliveryZoneId)" class="w-1/2 border-2 rounded-md bg-green-600 text-white py-2 mdc-ripple-surface">Proceed</button>
        </div>
      </div>
    </div>
  `,
  setup(props) {
    const deliveryZoneId = ref('');

    return {
      deliveryZoneId,
    }
  }
});
