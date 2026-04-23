const { base_url } = window.appConfig;
const { defineComponent, defineAsyncComponent, onMounted, watch } = Vue;

const Btn = defineAsyncComponent(() => import('./btn.js'));

export default defineComponent({
  components: {
    Btn,
  },
  props: [
    'customer', 
    'index', 
    'productUrl',
    'orderUrl',
    'submitUrl',
  ],
  template: `
    <div class="w-full bg-white rounded-md">
      <!-- Name -->
      <div class="flex gap-2 px-2 py-1 items-center">
        <div class="w-[4%] flex justify-center">
          {{ index + 1 }}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="#2b3392" viewBox="0 0 24 24" stroke-width="1.8" stroke="#2b3392" class="w-[4%] size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        <p class="text-primary font-semibold">{{ customer.shipping_firstname }} {{ customer.shipping_lastname }}</p>
      </div>

      <!-- Order -->
      <div v-for="order in customer.orders" class="text-sm">
        <!-- Heading -->
        <div class="flex gap-2 px-2 py-1 text-sm border-y-2 border-primary text-primary font-medium">
          <div class="w-[4%]"></div>
          <div class="w-4/12 flex items-center">Product</div>
          <div class="w-3/12 flex justify-center items-center">Qty</div>
          <div class="w-3/12 flex justify-center items-center">Kg</div>
          <!--
          <div class="w-1/12 flex justify-center items-center">
            <input type="checkbox" :checked="orderIsChecked(order)" @change="onOrderCheck($event.target.checked, order)" class="size-5">
          </div>
          -->
        </div>
  
        <!-- Order Id -->
        <div class="flex gap-2 mt-2">
          <span class="w-[4%]"></span>
          <p class="w-fit bg-primary rounded-full px-5">Order #{{ order.order_id }}</p>
        </div>

        <!-- Products -->
        <div v-for="(product, i) in order.products" class="p-2 flex gap-2 text-sm">
          <div class="w-[4%] flex justify-center">{{ i + 1 }}.</div>
          <!-- Product -->
          <div class="w-4/12">
            <p class="font-medium text-black/80 text-xs mb-1">{{ product.name }}</p>
            <p class="w-fit px-2 text-xs bg-amber-500 rounded-full text-white">Extra : No Ice</p>
          </div>
          <!-- Qty -->
          <div class="w-3/12">
            <div class="w-10/12">
              <p class="text-center pl-3">
                {{ product.quantity }} <span class="text-red-500 text-xl">*</span>
              </p>
              <input 
                type="numer"
                class="w-full text-center rounded-md border-[1px] border-black/30 py-1 disabled:bg-black/30"
                :value="product.dc_qty"
                :disabled="product.checked"
                @input="product.dc_qty = $event.target.value"
                @focus="$event.target.select()"
              >          
            </div>
          </div>
          <!-- KG -->  
          <div class="w-3/12">
            <div v-if="product.show_weight" class="w-10/12">
              <p class="text-center pl-3">
                {{ product.weight }}/{{ product.order_weight }} <span class="text-red-500 text-xl">*</span>
              </p>
              <div class="w-full flex flex-col">
                <input 
                  v-for="(pw, i) in product.partial_weights"
                  type="number" 
                  v-model="product.partial_weights[i]"
                  class="w-full text-center rounded-md border-[1px] border-black/30 py-1 disabled:bg-black/30"
                  :disabled="product.checked"
                  @focus="$event.target.select()"
                >
              </div>
            </div>
          </div>
          <!-- Checked -->
          <div class="w-1/12 flex items-center justify-center">
            <input type="checkbox" v-model="product.checked" @change="onProductCheck($event.target.checked, product)" class="size-5">
          </div>
        </div>
        <!-- Driver -->
        <div class="p-2 flex gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"></path>
          </svg>
          <p class="text-primary font-medium">Driver: Tyson Yoshi</p>
        </div>
      </div>
      
      <!-- Submit -->
      <div class="p-2 flex justify-end">
        <Btn type="success" @click="$emit('submit', customer)">Submit</Btn>
      </div>
    </div>
  `,
  setup(props) {
    // Update product weights
    watch(
      () => props.customer.orders.flatMap(order => order.products.map(product => product.partial_weights)),
      (newWeights, oldWeights) => {
        newWeights.forEach((newWeight, index) => {
          const product = props.customer.orders.flatMap(order => order.products)[index];
          product.weight = newWeight.reduce((acc, weight) => acc + parseFloat(weight || 0), 0);
        });
      },
      { deep: true }
    );

    // On order check
    const onOrderCheck = async (checked, order) => {
      // For db
      const products = order.products.map(p =>  {
        return {
          order_product_id: p.order_product_id,
          dc_qty: checked ? p.dc_qty : 0,
          weight: checked ? p.weight : 0,
          checked: checked ? 1 : 0,
        }
      })
      // For frontend
      order.products.forEach(product => {
        product.dc_qty = checked ? product.dc_qty : product.warehouse_qty;
        product.checked = checked;
      })
      // Call db to update order
      try {
        const response = await axios.post(props.orderUrl, {
          order_id: order.order_id,
          products
        });   

        if (response.data.error) {
          throw new Error(response.data.error);
        }

      } catch (error) {
        console.error(error);

      } finally {
        if (!checked) {
          order.products.forEach(product => {
            product.dc_qty = product.warehouse_qty;
          });
        }
      }
    }

    // On product check
    const onProductCheck = async (checked, order_product) => {
      // For db
      const data = {
        order_product_id: order_product.order_product_id,
        dc_qty: checked ? order_product.dc_qty : 0,
        weight: checked ? order_product.weight : 0,
        checked: checked ? 1 : 0,
      }
      // For frontend
      order_product.dc_qty = checked ? order_product.dc_qty : order_product.warehouse_qty;
      // Call db to update product
      try {
        const response = await axios.post(props.productUrl, data);
      } catch (error) {
        console.error('Error update product : ', error);
      }
    }

    // Check if all product checked
    const orderIsChecked = (order) => {
      return order.products.every(product => product.checked);
    }

    // Mounted
    onMounted(() => {
      // Set dc_qty to same as warehouse_qty
      props.customer.orders.forEach(order => {
        order.products.forEach(product => {
          if (!product.checked) {
            product.dc_qty = product.warehouse_qty;
          }
        });
      });
    })
    return {
      onOrderCheck,
      onProductCheck,
      orderIsChecked,
    }
  }
});
