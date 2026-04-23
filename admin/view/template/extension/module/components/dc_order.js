const { defineComponent, onMounted, watch } = Vue;

import Btn from './btn.js';

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
        <svg xmlns="http://www.w3.org/2000/svg" fill="#2b3392" viewBox="0 0 24 24" stroke-width="1.8" stroke="#2b3392" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        <p class="text-primary font-semibold text-sm">{{ customer.shipping_firstname }} {{ customer.shipping_lastname }}</p>
      </div>

      <!-- Order -->
      <div v-for="order in customer.orders" class="text-sm">
        <!-- Heading -->
        <div class="flex gap-2 px-2 py-1 text-sm border-y-2 border-primary text-primary font-medium">
          <div class="w-[4%]"></div>
          <div class="w-4/12 flex items-center">Product</div>
          <div class="w-2/12 flex justify-center items-center">Qty</div>
          <div class="w-4/12 flex justify-center items-center">Kg</div>
          <!--
          <div class="w-1/12 flex justify-center items-center">
            <input type="checkbox" :checked="orderIsChecked(order)" @change="onOrderCheck($event.target.checked, order)" class="size-5">
          </div>
          -->
        </div>
  
        <!-- Order Id -->
        <div class="w-full flex justify-between items-center mt-2 mb-1 pl-5 pr-3">
          <p class="w-fit bg-primary rounded-full px-5">Order #{{ order.order_id }}</p>
          <div class="w-4/12 flex justify-end items-center text-primary font-medium gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
              <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a.75.75 0 0 0 .75-.75V15Z" />
              <path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM15.75 6.75a.75.75 0 0 0-.75.75v11.25c0 .087.015.17.042.248a3 3 0 0 1 5.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 0 0-3.732-10.104 1.837 1.837 0 0 0-1.47-.725H15.75Z" />
              <path d="M19.5 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
            </svg>
            <p>{{ order.delivery_date }}</p>
          </div>
        </div>

        <!-- Products -->
        <div v-for="(product, i) in order.products" class="p-2 flex gap-2 text-sm">
          <div class="w-[4%] flex justify-center">{{ i + 1 }}.</div>
          <!-- Product -->
          <div class="w-4/12">
            <p class="font-medium text-black/80 text-xs mb-1">{{ product.name }}</p>
            <p v-if="product.option" class="w-fit px-2 text-xs bg-amber-500 rounded-full text-white">{{ product.option_value }}</p>
            <p v-if="product.option2" class="w-fit px-2 text-xs bg-amber-500 rounded-full text-white">{{ product.option_value2 }}</p>
          </div>
          <!-- Qty -->
          <div class="w-3/12">
            <div class="w-10/12">
              <p class="text-center pl-3 whitespace-nowrap">
                {{ product.quantity }} <span class="text-red-500 text-xl">*</span>
              </p>
              <input 
                v-if="!product.out_of_stock"
                type="number"
                class="w-full text-center rounded-md border-[1px] border-black/30 py-1 disabled:bg-black/30"
                v-model="product.dc_qty"
                :disabled="product.checked"
                @focus="$event.target.select()"
              >   
              <input v-else type="text" class="w-full py-1 text-center rounded-md border-red-200 bg-red-300 text-red-800 font-medium" value="OOS" disabled>       
            </div>
          </div>
          <!-- KG -->  
          <div class="w-3/12">
            <div v-if="product.show_weight" class="w-10/12">
              <p class="text-center pl-3 whitespace-nowrap">
                {{ product.weight }}/{{ product.order_weight }} <span class="text-red-500 text-xl">*</span>
              </p>
              <div class="w-full flex flex-col gap-1">
                <input 
                  v-if="!product.out_of_stock"
                  v-for="(pw, i) in product.partial_weights"
                  type="number" 
                  v-model="product.partial_weights[i]"
                  class="w-full text-center rounded-md border-[1px] border-black/30 py-1 disabled:bg-black/30"
                  :disabled="product.checked"
                  @focus="$event.target.select()"
                >
                <input v-else type="text" class="w-full py-1 text-center rounded-md border-red-200 bg-red-300 text-red-800 font-medium" value="OOS" disabled>       
              </div>
            </div>
          </div>
          <!-- Checked -->
          <div class="w-1/12 flex items-center justify-center">
            <input type="checkbox" :checked="product.checked || product.out_of_stock" @change="onProductCheck($event.target.checked, product)" class="size-5">
          </div>
        </div>
        <!-- Driver -->
        <div class="p-2 flex gap-1 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
            <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
          </svg>
          <p class="font-medium">Driver: {{ order.drivers }}</p>
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
          partial_weights: p.partial_weights,
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
        partial_weights: order_product.partial_weights,
        dc_qty: checked ? order_product.dc_qty : 0,
        checked: checked ? 1 : 0,
      }
      // For frontend
      if (checked) {
        order_product.dc_qty = order_product.dc_qty;
      } else {
        order_product.out_of_stock = 0;
        order_product.dc_qty = order_product.warehouse_qty;
      }
      order_product.checked = checked;
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
