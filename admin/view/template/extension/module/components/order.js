
const { defineComponent, ref, computed, watch } = Vue;

import ShowMore from './show_more.js';
import Btn from './btn.js';

export default defineComponent({
  components: {
    ShowMore,
    Btn,
  },
  props: [
    'order', 
    'products', 
    'hideCheckbox', 
    'hideShowMore', 
    'buttonLabel', 
    'hideButton',
    'checkedOrders',
    'status',
    'showWarehouseQty',
    'disableWarehouseQty',
    'showFinalQty',
    'disableFinalQty',
    'menus',
    'hideName',
    'addedBy',
    'updatedBy',
    'hideTotal',
    'disableRo',
    'showOverdue',
    'getRoute',
    'edit',
  ],
  template: `
    <div class="w-full rounded-md text-black bg-white" :class="order.is_revert_order && !disableRo && 'border-4 border-red-500'">
      <!-- Header -->
      <div 
        class="p-2 border-b-[1px] border-black/30 rounded-t-md" 
        :class="isPrimary && 'bg-yellow-500 text-white'"  
      >
        <!-- Menus -->
        <div v-if="menus" @click.stop="" class="relative flex justify-end items-center gap-2 mb-1">
          <svg @click="showMenu = !showMenu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          <div v-if="showMenu" class="absolute top-full right-0 bg-white rounded-md shadow-2xl bg-gray-300 border-[1px] border-gray-400">
            <button v-for="menu in menus" @click.stop="handleMenuClick(menu.event)" class="w-36 p-2">{{ menu.label }}</button>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <div class="flex items-center w-8/12 gap-2">
            <!-- Checkbox -->
            <input 
              v-if="!hideCheckbox" 
              type="checkbox" 
              class="size-6 rounded-full"
              :id="'order-'+order.order_id"
              @click.stop="" 
              @change="$emit('checked', $event.target.checked, order)" 
              :checked="checkedOrders.includes(order.warehouse_order_id) || checkedOrders.includes(order.warehouse_order_batch_id) || checkedOrders.includes(order)" 
            >
            <div>
              <!-- Order id -->
              <label @click.stop="" :for="'order-'+order.order_id" class="text-base text-primary font-semibold break-words">Order #{{ order.order_id }} <span v-if="order.is_replacement" class="text-red-500">[R]</span> <span v-if="addedBy">- {{ addedBy }}</span></label>
              <!-- DO -->
              <p v-if="order.doc_no" class="text-sm font-medium text-primary break-words">DO #{{ order.doc_no }}</p>
            </div>
          </div>
          <!-- Delivery -->
          <div class="w-5/12 text-right">
            <div class="flex justify-end items-center gap-2 font-semibold" :class="isOverdue && showOverdue ? 'text-red-500' : 'text-primary'">
              <svg v-if="isOverdue && showOverdue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
              </svg>
              <p>{{ order.delivery_date }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full p-2 pb-0 flex justify-between items-start gap-2 text-sm">
        <!-- Store name -->
        <div class="flex items-start gap-1" :class="status ? 'w-8/12' : 'w-full'">
          <template v-if="!hideName">
            <svg xmlns="http://www.w3.org/2000/svg" fill="gray" viewBox="0 0 24 24" stroke-width="1.8" stroke="gray" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <p class="text-gray-600 break-words ... ">
              {{ order.shipping_firstname }} {{ order.shipping_lastname }}
            </p>
          </template>
        </div>
          <!-- Status-->  
        <div v-if="status" class="w-4/12">
          <p class="text-primary text-right">{{ status }}</p>
        </div>
      </div>

      <!-- Products -->
      <div class="flex flex-col gap-1 p-2 pt-0 max-h-[60vh] overflow-y-scroll pt-2">
        <TransitionGroup>
          <div 
            v-for="(product, index) in computedProducts" 
            :key="product.product_id" 
            class="w-full p-2"
            :class="(showWarehouseQty || showFinalQty) && 'border-[2px] rounded-md border-black/30'"
          >
            <div class="w-full flex gap-2">
              <!-- Image -->
              <div class="w-2/12 h-fit border-2 border-gray-300 rounded-md">
                <img class="w-full object-cover rounded-md" :src="product.image">
              </div>
              <div class="w-10/12 text-sm">
                <div class="w-full flex justify-between items-center text-gray-600">
                  <!-- Name -->
                  <p class="w-8/12 font-medium">{{ product.name || product.model }} </p>
                  <!-- Quantity -->
                  <p class="text-sm text-center px-3 py-1 rounded-full bg-green-700 text-white flex items-center justify-center">
                    x {{ product.quantity }} {{ product.product_unit }}
                  </p>
                </div>
                <div class="text-sm font-medium text-primary capitalize">
                  <!-- Option 1-->
                  <p v-if="product.option && product.option_value">
                    {{ product.option_value }}
                  </p>
                  <!-- Option 2 -->
                  <p v-if="product.option2 && product.option_value2">
                    {{ product.option_value2 }}
                  </p>
                  <!-- Weight -->
                  <p v-if="product.show_weight">Total = {{ product.order_weight }} kg</p>
                </div>
                <!-- Remark -->
                <div v-if="product.remark" class="w-9/12  text-red-500 rounded-md">
                  *{{ product.remark }}
                </div> 
              </div>
            </div>
            
            <div v-if="showWarehouseQty || showFinalQty" class="mt-4 flex flex-col gap-4 text-sm font-medium text-gray-700">
              <!-- Warehouse Qty -->
              <div v-if="showWarehouseQty" class="flex items-center justify-between">
                <p>Warehouse Qty :</p>
                <div class="w-7/12 flex justify-between items-center border-2 text-gray-700 border-gray-400 rounded-md">
                  <!-- Warehouse Qty (edit)-->
                  <template v-if="edit">
                    <input 
                      type="number" 
                      v-model="product.warehouse_qty" 
                      class="w-7/12 py-2 text-center bg-transparent disabled:bg-gray-300 border-r-2 border-black/60" 
                      :disabled="disableWarehouseQty"
                      @focus="$event.target.select()"
                    ></input>
                  </template>
                  <!-- Warehouse Qty (peview)-->
                  <template v-else>
                    <input 
                      v-if="product.warehouse_qty == 0"
                      type="text" 
                      class="w-7/12 py-2 text-center text-red-600 bg-gray-300 border-r-2 border-black/60" 
                      value="OOS"
                      disabled
                    ></input>
                    <input 
                      type="number" 
                      v-else
                      v-model="product.warehouse_qty" 
                      class="w-7/12 py-2 text-center bg-transparent disabled:bg-gray-300 border-r-2 border-black/60" 
                      :disabled="true"
                      @focus="$event.target.select()"
                    ></input>
                  </template>
                  <div class="w-5/12 py-2 bg-gray-300 flex justify-center items-center">
                    {{ product.quantity }}
                  </div>
                </div>
              </div>

              <!-- Final Qty -->
              <div v-if="showFinalQty" class="flex items-center justify-between">
                <p>Final Qty :</p>
                <div class="w-7/12 flex justify-between items-center border-2 text-gray-700 border-gray-400 rounded-md">
                  <!-- Final Qty (edit) -->
                  <template v-if="edit">
                    <input 
                      type="number" 
                      v-model="product.dc_qty" 
                      class="w-7/12 py-2 text-center bg-transparent disabled:bg-gray-300 border-r-2 border-black/60" 
                      :disabled="disableFinalQty"
                      @focus="$event.target.select()"
                    ></input>
                  </template>
                  <!-- Final Qty (edit) -->
                  <template v-else>
                    <input 
                      v-if="product.dc_qty == 0"
                      type="text" 
                      class="w-7/12 py-2 text-center text-red-600 bg-gray-300 border-r-2 border-black/60" 
                      value="OOS"
                      disabled
                    ></input>
                    <input 
                      v-else
                      type="number" 
                      v-model="product.dc_qty" 
                      class="w-7/12 py-2 text-center bg-transparent disabled:bg-gray-300 border-r-2 border-black/60" 
                      :disabled="disableFinalQty"
                      @focus="$event.target.select()"
                    ></input>
                  </template>
                  <div class="w-5/12 py-2 bg-gray-300 flex justify-center items-center">
                    / {{ product.quantity }}
                  </div>
                </div>
              </div>

              <!-- Weight -->
              <div v-if="product.show_weight" class="flex items-center justify-between">
                <p>Weight (kg) :</p>
                <!-- Add Weight -->
                <div v-if="edit" class="w-fit ml-auto mr-2">
                  <svg @click="addWeight(product)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="#2b3392" class="size-8 cursor-pointer mdc-ripple">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>

                <div class="w-7/12 flex justify-between items-center border-2 border-gray-400 text-gray-700  rounded-md bg-gray-300">
                  <!-- Partial Weight (edit) -->
                  <template v-if="edit">
                    <div class="w-7/12 flex flex-col border-r-2 border-black/60">
                      <div class="relative" v-for="(pw, i) in product.partial_weights" >
                        <input
                          type="number" 
                          v-model="product.partial_weights[i]" 
                          class="w-full py-2 text-center border-gray-400 bg-white disabled:bg-gray-300" 
                          :class="i+1 != product.partial_weights.length && 'border-b-2'"
                          :id="'pw-' + product.order_product_id + '-' + i"
                          :disabled="i != product.partial_weights.length - 1"
                          @focus="$event.target.select()"
                        ></input>
                        <!-- Remove Weight -->
                        <div v-if="product.partial_weights.length > 1" @click="removeWeight(i, product)" class="absolute right-1 top-1/2 -translate-y-1/2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="red" class="size-7">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>                        
                        </div>
                      </div>
                    </div>
                  </template>
                  <!-- Partial Weight (preview) -->
                  <template v-else>
                    <input 
                      v-if="product.weight == 0"
                      type="text" 
                      class="w-7/12 py-2 text-center text-red-600 bg-gray-300 border-r-2 border-black/60" 
                      value="OOS"
                      disabled
                    ></input>
                    <div v-else class="w-7/12 flex flex-col border-r-2 border-black/60">
                      <input
                        v-for="(pw, i) in product.partial_weights"
                        type="number" 
                        v-model="product.partial_weights[i]" 
                        class="w-full py-2 text-center border-gray-400 bg-white disabled:bg-gray-300" 
                        :class="i+1 != product.partial_weights.length && 'border-b-2'"
                        :id="'pw-' + product.order_product_id + '-' + i"
                        :disabled="true"
                      ></input>
                    </div>
                  </template>
                  <div class="w-5/12 text-center py-2 flex justify-center items-center">
                    {{ product.weight }} / {{ product.order_weight }}
                  </div>
                </div>
              </div>

              <div v-if="edit || product.out_of_stock" class="flex justify-end gap-2 text-black/80">
                <input 
                  type="checkbox" 
                  v-model="product.out_of_stock"
                  :disabled="!edit" 
                  :id="'out-of-stock-' + product.order_product_id"
                >
                <label 
                  :for="'out-of-stock-' + product.order_product_id"
                  :class="product.out_of_stock && 'text-red-500'"
                >
                  Out Of Stock
                </label>
              </div>
            </div>
          </div>
        </TransitionGroup>
        <!-- Show More-->
        <ShowMore
          v-if="!hideShowMore && products.length > 1"
          :show-more="showMore"
          @click.stop="showMore = !showMore"
        ></ShowMore>
        
        <!-- Total -->
        <p v-if="!hideTotal" class="px-2 mt-2 text-sm font-medium text-primary">{{ 'Total items: ' + products?.length }} </p>
      </div>

      <!-- Info -->
      <slot name="info"></slot>

      <!-- Footer -->
      <div v-if="!hideTotal || !hideButton" class="flex flex-col gap-2 p-2 border-t-[1px] border-black/30">
        <!-- Updated by-->
        <div v-if="updatedBy" class="text-right text-sm">
          <p class="font-medium text-primary rounded-full">By: {{ updatedBy }}</p>
        </div>

        <div class="w-full flex justify-end items-center">
          <!-- Buttons -->
          <Btn
            v-if="!hideButton && !hasSlot('buttons')"
            @click.stop="$emit('confirm')"
          >
            {{ buttonLabel ? buttonLabel : 'Process' }}
          </Btn>
          <slot name="buttons"></slot>
        </div>
      </div>
    </div> 
  `,
  setup(props, { slots }) {
    const showMore = ref(false);
    const showMenu = ref(false);

    const computedProducts = computed(() => {
      let products = props.products;
      return showMore.value || props.hideShowMore ? products : products.slice(0, 1)
    })
    const hasSlot = (slotName) => Boolean(slots[slotName]); 

    watch(
      () =>
        props.products.map(product => ({
          warehouse_qty: product.warehouse_qty,
          dc_qty: product.dc_qty,
          partial_weights: product.partial_weights,
        })),
      (newValues, oldValues) => {
        newValues.forEach((values, index) => {
          const product = props.products[index];
          product.weight = values.partial_weights.reduce((sum, weight) => sum + weight, 0);
    
          if (values.warehouse_qty > 0 || values.dc_qty > 0 || product.weight > 0) {
            product.out_of_stock = false;
          } else {
            product.out_of_stock = true;
          }
        });
      },
      { deep: true }
    );

    const handleDecrease = (product, attribute) => {
      if (product[attribute] > 0) {
        product[attribute] --;
      } 
      product.out_of_stock = product[attribute] == 0;
    }

    const handleIncrease = (product, attribute) => {
      if (product[attribute] < product.quantity) {
        product[attribute] ++;
      } 
      product.out_of_stock = product[attribute] == 0;
    }

    // Add partial weight
    const addWeight = async (product) => {
      if (product.partial_weights[product.partial_weights.length - 1] == 0) {
        return ;
      }
      product.partial_weights.push(0);
      product.out_of_stock = false;
      // Focus last input
      setTimeout(() => {
        $(`#pw-${product.order_product_id}-${product.partial_weights.length - 1}`).focus();
      }, 1);
      // Update DB
      try {
        const { data } = await axios.post(props.getRoute('extension/module/processing_department/updateWeight', {}, true), {
          order_product_id: product.order_product_id,
          partial_weights: product.partial_weights.filter(x => x != 0),
        });
      } catch (error) {
        console.error(error);
      } 
    }

    // Remove partial weight
    const removeWeight = async (index, product) => {
      product.partial_weights.splice(index, 1);
      // Update DB
      try {
        const { data } = await axios.post(props.getRoute('extension/module/processing_department/updateWeight', {}, true), {
          order_product_id: product.order_product_id,
          partial_weights: product.partial_weights.filter(x => x != 0),
        });
      } catch (error) {
        console.error(error);
      } 
    }

    const handleMenuClick = (event) => {
      showMenu.value = false;
      event(props.order);
    }

    const isPrimary = computed(() => {
      const date = props.order.delivery_date
      const [day, month, year] = date.split('/').map(Number);
      const givenDate = new Date(year, month - 1, day); 

      const today = new Date();
      today.setHours(0, 0, 0, 0); 

      return givenDate.getTime() === today.getTime();
    })

    const isOverdue = computed(() => {
      const date = props.order.delivery_date
      const [day, month, year] = date.split('/').map(Number);
      const givenDate = new Date(year, month - 1, day); 

      const today = new Date();
      today.setHours(0, 0, 0, 0); 

      return givenDate.getTime() < today.getTime();
    })

    return {
      showMenu,
      showMore,
      computedProducts,
      hasSlot,
      handleDecrease,
      handleIncrease,
      handleMenuClick,
      isPrimary,
      isOverdue,
      addWeight,
      removeWeight,
    }
  }
});
