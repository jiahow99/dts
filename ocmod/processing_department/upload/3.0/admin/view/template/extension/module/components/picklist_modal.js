const { base_url } = window.appConfig;
const { ref, defineComponent, computed, defineAsyncComponent  } = Vue;

const Closebtn = defineAsyncComponent(() => import(`${base_url}/extension/module/components/close_btn.js`));
const ShowMore = defineAsyncComponent(() => import(`${base_url}/extension/module/components/show_more.js`));

export default defineComponent({
  components: {
    Closebtn,
    ShowMore,
  },
  props: ['picklist', 'savedPicklists'],
  template: `
  <div>
    <!-- Tabs -->
    <div class="w-full flex justify-center shadow-md">
      <button 
        v-for="button in tabs" 
        class="w-1/2 py-2 h-fit shrink-0 font-semibold border-b-2 text-nowrap bo mdc-ripple-surface"
        :class="button.label == activeTab ? 'border-primary' : 'border-gray-400'"
        @click="button.event" 
      >
        {{ button.label }} 
        <span class="ml-1 px-2 rounded-full bg-primary">{{ button.label == 'Items' ? totalToPick : totalDone }}</span>
      </button>
    </div>

    <div class="min-h-[20vh] flex flex-col items-center justify-center gap-3 p-2">
      <!-- Items -->
      <div 
        v-for="(product, index) in computedProducts" 
        :key="product.order_product_id + '-' + product.order_option_id" 
        class="w-full bg-white rounded-md"
      >
        <div class="w-full p-2">
          <div class="flex justify-end mb-3">
            <!-- Checkbox -->
            <input 
              type="checkbox" 
              class="size-6 rounded-md"
              :checked="product.checked" 
              @change="$emit('checked', $event.target.checked, product.order_product_id)"
            >
          </div>
          <div class="w-full flex gap-2">
            <!-- Image -->
            <div class="w-2/12 aspect-square h-fit border-2 border-gray-300 rounded-md">
              <img class="w-full object-cover rounded-md" :src="product.image">
            </div>
            <div class="w-10/12 text-sm">
              <div class="w-full flex justify-between items-center text-gray-600">
                <!-- Name -->
                <p class="w-9/12 font-medium">{{ product.name || product.model }}</p>
                <!-- Quantity -->
                <p class="text-sm px-3 py-1 rounded-full bg-green-700 text-white flex items-center justify-center">x {{ product.quantity }}</p>
              </div>
              <div class="text-sm font-semibold text-primary capitalize">
                <!-- Weight -->
                <p>{{ product.order_weight }} {{ product.unit }}</p>
                <!-- Option 1 -->
                <p v-if="product.option" class="text-gray-600 font-medium">{{ product.option }}: {{ product.option_value }}</p>
                <!-- Option 2 -->
                <p v-if="product.option2" class="text-gray-600 font-medium">{{ product.option2 }}: {{ product.option_value2 }}</p>
            </div>
            </div>
          </div>
        </div>          
      </div>
      <!-- Show More -->
      <ShowMore 
        v-if="hasMore"
        :show-more="showMore"
        @click="showMore = !showMore" 
      ></ShowMore>
      <h1 v-if="computedProducts.length == 0" class="text-2xl text-black/60 text-center mt-2">No items</h1>
    </div>
  </div>
  `,
  setup(props) {
    const activeTab = ref('Items');
    const showMore = ref(false);

    const tabs = ref([
      {label: 'Items', event: () => {
        activeTab.value = 'Items';
      }},
      {label: 'Done', event: () => {
        activeTab.value = 'Done';
      }},
    ])

    const computedProducts = computed(() => {
      let products = [];
      if (activeTab.value == 'Items') {
        products = Object.values(props.picklist.json).filter(x => !x.checked);
      } else {
        products = Object.values(props.picklist.json).filter(x => x.checked);
      }

      if (products.length > 1 && !showMore.value) {
        products = products.slice(0, 1);
      }

      return products;
    })
    
    const hasMore = computed(() => {
      let products = [];
      if (activeTab.value == 'Items') {
        products = Object.values(props.picklist.json).filter(x => !x.checked);
      } else {
        products = Object.values(props.picklist.json).filter(x => x.checked);
      }
      return products.length > 1;
    })
    
    // Total
    const totalToPick = computed(() => {
      return Object.values(props.picklist.json).filter(x => !x.checked).length;
    })
    const totalDone = computed(() => {
      return Object.values(props.picklist.json).filter(x => x.checked).length;
    })

    return {
      tabs,
      activeTab,
      computedProducts,
      totalToPick,
      totalDone,
      showMore,
      hasMore,
    }
  },
});
