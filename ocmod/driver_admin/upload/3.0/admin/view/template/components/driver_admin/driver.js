const { base_url } = window.appConfig;
const { defineAsyncComponent } = Vue;

const Order = defineAsyncComponent(() => import(`${base_url}/components/driver_admin/order.js`));

export default {
  components: {
    Order
  },
  props: ['driver', 'initSortable'],
  emits: ['duplicate-order', 'set-main'],
  mounted() {
    this.initSortable();
  },
  template: `
    <div class="panel panel-default driver" style="height: fit-content;">
      <div class="panel-heading" :class="!driver.orders.length && 'free'">
        <h3 class="panel-title" style="font-weight: 600;">
          {{ driver.name }} 
        </h3>
      </div>
      <table class="table">
        <tbody class="sortable" :data-driver-id="driver.user_id">
          <!-- Orders -->
          <tr v-if="driver.orders.length" v-for="order in driver.orders" :key="order.order_id">
            <td>
              <Order 
                :order="order" 
                @duplicate-order="$emit('duplicate-order', order)"
                @set-main="(order) => $emit('set-main', order, driver)"
                @remove="(order) => $emit('remove', order, driver)"
              ></Order>
            </td>
          </tr>
          <tr v-else>
            <td style="padding: 8px !important;">No Orders</td>
          </tr> 
        </tbody>
      </table>
    </div>    
  `
};
