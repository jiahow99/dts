const { base_url } = window.appConfig;
const { defineComponent, ref, onMounted, defineAsyncComponent } = Vue;
const Closebtn = defineAsyncComponent(() => import(`${base_url}/extension/module/components/close_btn.js`));

export default defineComponent({
  components: {
    Closebtn,
  },
  props: [
    'filterData',
    'deliveryZones',
  ],
  template: `
    <div class="z-50 fixed top-0 left-0 w-screen h-screen bg-black/70 flex justify-center items-center">
        <div class="w-11/12 mx-auto p-3 bg-slate-200 shadow-lg rounded-2xl">
            <div class="w-full mx-auto flex justify-between items-center">
                <div class="w-2/12"></div>
                <div class="w-10/12 text-center">
                    <p class="text-2xl font-medium">Filter</p>
                </div>
                <div class="w-2/12">
                    <!-- Close -->
                    <Closebtn @click="$emit('close')" fill="#2b3392"></Closebtn>
                </div>
            </div>
            <div class="w-full mx-auto mt-5">
                <!-- CLear -->
                <p @click="clear" class="underline text-primary w-fit ml-auto text-lg">Clear</p>
                
                <div class="mt-2 flex flex-col gap-2 max-h-[55vh] overflow-y-scroll">
                  <!-- Customer name -->
                  <div v-if="'customer' in filterData" class="w-full bg-white rounded-lg p-3 shadow-sm">
                      <label>Customer :</label>
                      <input type="text" v-model="filterData.customer"  name="customer" class="w-full mt-2 p-2 rounded-md border-[1px] border-primary">
                  </div>
                  <!-- Order ID -->
                  <div v-if="'order_id' in filterData" class="w-full bg-white rounded-lg p-3 shadow-sm">
                      <label>Order ID :</label>
                      <input type="text" v-model="filterData.order_id" name="order_id" class="w-full mt-2 p-2 rounded-md border-[1px] border-primary">
                  </div>
                  <!-- Order ID -->
                  <div v-if="'batch_id' in filterData" class="w-full bg-white rounded-lg p-3 shadow-sm">
                      <label>Batch :</label>
                      <input type="text" v-model="filterData.batch_id" name="batch_id" class="w-full mt-2 p-2 rounded-md border-[1px] border-primary">
                  </div>
                  <!-- Delivery Date -->
                  <div v-if="'delivery_date' in filterData" class="w-full bg-white rounded-lg p-3 shadow-sm">
                      <label>Delivery Date :</label>
                      <input type="text" v-model="filterData.delivery_date" name="delivery_date" class="w-full mt-2 p-2 rounded-md border-[1px] border-primary" autocomplete="off">
                  </div>
                  <!-- With Do -->
                  <div v-if="'with_do' in filterData" class="w-full bg-white rounded-lg p-3 shadow-sm">
                      <label>Delivery Order (DO) :</label>
                      <div class="mt-2 flex gap-5">
                        <div class="flex gap-2 items-center">
                          <input type="radio" v-model="filterData.with_do" name="delivery_order" id="with_delivery_order" value="1" class="size-5">
                          <label for="with_delivery_order">Yes</label>
                        </div>
                        <div class="flex gap-1 items-center">
                          <input type="radio" v-model="filterData.with_do" name="delivery_order" id="without_delivery_order" value="0" class="size-5">
                          <label for="without_delivery_order">No</label>
                        </div>
                      </div>
                  </div>
                  <!-- DO id -->
                  <div v-if="'doc_no' in filterData" class="w-full bg-white rounded-lg p-3 shadow-sm">
                      <label>DO ID :</label>
                      <input type="text" v-model="filterData.doc_no" name="order_id" class="w-full mt-2 p-2 rounded-md border-[1px] border-primary">
                  </div>
                  <!-- Delivery Zone -->
                  <div v-if="'delivery_zone_id' in filterData" class="w-full bg-white rounded-lg p-3 shadow-sm">
                    <label>Delivery Zone :</label>
                    <select v-model="filterData.delivery_zone_id" name="delivery_zone_id" class="w-full mt-2 p-2 rounded-md border-[1px] border-primary">
                      <option value=""></option>
                      <option v-for="zone in deliveryZones" :value="zone.delivery_zone_id">
                        {{ zone.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <!-- Apply -->
                <button @click="$emit('apply', filterData)" class="bg-primary mt-5  w-full py-2 rounded-md">Apply</button>
            </div>
        </div>
    </div>
  `,
  setup(props) {   
    const options = {
      startDate: moment().add(5, 'days'),
      autoUpdateInput: false,
      autoApply: true,
      singleDatePicker: true,
    };

    const clear = () => {
      for (const key in props.filterData) {
        if (props.filterData.hasOwnProperty(key)) {
          props.filterData[key] = ''; // Assign empty string to each property
        }
      }
    }

    // Mounted
    onMounted(() => {
      const delivery_date = props.filterData.delivery_date;
      if (delivery_date != '') {
        $('input[name="delivery_date"]').val(delivery_date)
      }

      $('input[name="delivery_date"]').daterangepicker(options, (value) => {
        const date = value.format('MM/DD/YYYY');
        props.filterData.delivery_date = date;
      });
    })

    return {
      clear,
    }
  }
});
