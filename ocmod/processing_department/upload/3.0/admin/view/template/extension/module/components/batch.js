const { base_url } = window.appConfig;
const { defineComponent, defineAsyncComponent, ref, computed, watch } = Vue;

const Order = defineAsyncComponent(() => import(`${base_url}/extension/module/components/order.js`));
const BulkMenu = defineAsyncComponent(() => import(`${base_url}/extension/module/components/bulk_menu.js`));
const ShowMore = defineAsyncComponent(() => import(`${base_url}/extension/module/components/show_more.js`));
const Btn = defineAsyncComponent(() => import(`${base_url}/extension/module/components/btn.js`));

export default defineComponent({
  components: {
    Order,
    BulkMenu,
    ShowMore,
    Btn,
  },
  props: [
    'batch',
    'batchUrl',
    'checked',
    'hideShowMore',
    'hideCheckbox',
    'hideButton',
    'hidePick',
    'redirect',
  ],
  template: `
    <div class="bg-primary p-2 rounded-md">
      <!-- Title -->
      <div class="mt-1 mb-3 flex justify-start items-center gap-2">
        <input 
          v-if="!hideCheckbox"
          class="size-6 rounded-md disabled:hidden"
          type="checkbox" 
          :checked="checked"
          :disabled="batch.picklist_id"
          :id="'batch-'+batch.warehouse_order_batch_id"
          @click.stop=""
          @change="$emit('checked', $event.target.checked, batch)" 
        >
        <div class="w-8/12">
          <label class="text-white font-medium w-fit" @click.stop="" :for="'batch-'+batch.warehouse_order_batch_id" >
            Batch {{ batch.warehouse_order_batch_name }} ({{ batch.added_by }}) 
          </label>
        </div>
      </div>

      <div @click="redirectTo(batchUrl)" class="flex flex-col gap-2 mt-2">
        <TransitionGroup>
          <!-- Orders -->
          <Order 
            v-for="order in computedOrders" 
            :key="order.warehouse_order_id" 
            :order="order"
            :products="order.products"
            :checked-orders="[]"
            :hide-checkbox="true"
            :hide-button="hideButton"
          >
            <template v-if="!hideButton" v-slot:buttons>
              <div class="w-full flex justify-end gap-2">
                <Btn @click="$emit('complete-order', order)" type="outline" class="px-10">
                  Update
                </Btn>
              </div>
            </template>
          </Order>

          <!-- Show More -->
          <ShowMore 
            v-if="batch.warehouse_orders.length > 1 && !hideShowMore"
            class="mt-5"
            text-color="text-white"
            :show-more="showMore"
            @click.stop="showMore = !showMore" 
          ></ShowMore>
        </TransitionGroup>
      </div>

      <div class="flex justify-between items-end mt-2">
        <!-- Total -->
        <p class="text-white mt-2 text-sm">Total Orders : {{ batch.warehouse_orders.length }}</p>
        <div class="flex gap-3">
          <!-- Pick -->
          <Btn 
            v-if="!hidePick"
            type="outline" 
            class="bg-white px-10"
            @click.stop="$emit('pick')" 
          >
            Pick
          </Btn>
        </div>
      </div>
    </div>
  `,
  setup(props, { emit, slots }) {
    const showMore = ref(false);

    const computedOrders = computed(() => {
      const orders = props.batch.warehouse_orders;
      if (!props.hideShowMore) {
        return showMore.value ? orders : orders.slice(0, 1);
      } else {
        return orders
      }
    })

    const redirectTo = (url) => {
      if (props.redirect === false) return;
      emit('redirect');
      window.location.href = url;
    }

    return {
     showMore,
     computedOrders,
     redirectTo,
    }
  }
});
