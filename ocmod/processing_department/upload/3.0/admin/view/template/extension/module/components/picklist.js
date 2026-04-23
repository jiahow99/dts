const { ref, defineComponent } = Vue;

export default defineComponent({
  props: ['picklist'],
  template: `
    <div class="w-full rounded-md shadow-lg text-black bg-white p-2">
      <!-- Batches -->
      <p class="text-xl font-medium underline mb-2">Picklist #{{ picklist.picklist_id }}</p>
      <p v-for="batch in picklist.warehouse_order_batches" :key="batch.warehouse_order_batch_id" class="text-black font-medium">
        Batch {{ batch.warehouse_order_batch_name }}
      </p>
      <!-- Descriptions -->
      <div class="flex flex-col gap-1 pt-2">
        <div 
          v-if="showMore"
          v-for="product in picklist.json" 
          :key="product.product_id" 
          class="w-full"
        >
          <div class="w-full flex gap-2">
            <!-- Image -->
            <div class="w-3/12">
              <img class="w-full object-cover rounded-md" :src="product.image">
            </div>
            <!-- Name -->
            <div class="w-9/12">
              <p class="w-10/12">{{ product.model }} </p>
              <div class="flex justify-between text-gray-600 text-xs">
                <span><p v-if="product.weight">{{ product.weight }} {{ product.unit }}</p></span>
                <p class="text-base">x {{ product.quantity }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Show More-->
        <p @click.stop="showMore = !showMore" class="text-gray-600 text-center flex items-center justify-center gap-1">
          {{ showMore ? 'Hide' : 'Show More' }}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4" :class="showMore && 'rotate-180'">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
          </svg>          
        </p>
        <div class="flex justify-end">
          <button class="px-4 py-1 border-2 border-gray-600 rounded-md text-gray-600 mdc-ripple-surface">
            View Picklist
          </button>
        </div>
      </div>
    </div> 
  `,
  setup() {
    const showMore = ref(false)

    return {
      showMore,
    }
  },
});
