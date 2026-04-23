const { base_url } = window.appConfig;
const { defineAsyncComponent } = Vue;

export default {
  props: ['order'],
  emits: ['duplicate-order', 'set-main', 'remove'],
  data() {
    return {
      colors: [
        "#FFCDD2", "#F8BBD0", "#E1BEE7", "#D1C4E9", "#C5CAE9", "#BBDEFB", "#B3E5FC", "#B2EBF2", "#B2DFDB", "#C8E6C9",
        "#DCEDC8", "#F0F4C3", "#FFF9C4", "#FFECB3", "#FFE0B2", "#FFCCBC", "#D7CCC8", "#F5F5F5", "#CFD8DC", "#F44336",
        "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A",
        "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548", "#9E9E9E", "#607D8B", "#FF8A80", "#FF80AB",
        "#EA80FC", "#B388FF", "#8C9EFF", "#82B1FF", "#80D8FF", "#84FFFF", "#A7FFEB", "#B9F6CA", "#CCFF90", "#F4FF81",
        "#FFFF8D", "#FFE57F", "#FFD180", "#FF9E80", "#EF9A9A", "#F48FB1", "#CE93D8", "#B39DDB", "#9FA8DA", "#90CAF9",
        "#81D4FA", "#80DEEA", "#80CBC4", "#A5D6A7", "#C5E1A5", "#E6EE9C", "#FFF59D", "#FFE082", "#FFCC80", "#FFAB91",
        "#BCAAA4", "#EEEEEE", "#B0BEC5", "#FF5252", "#FF4081", "#E040FB", "#7C4DFF", "#536DFE", "#448AFF", "#40C4FF",
        "#18FFFF", "#64FFDA", "#69F0AE", "#B2FF59", "#EEFF41", "#FFFF00", "#FFD740", "#FFAB40", "#FF6E40", "#FF1744",
        "#F50057", "#D500F9", "#651FFF", "#3D5AFE", "#2979FF", "#00B0FF", "#00E5FF", "#1DE9B6", "#00E676", "#76FF03"
      ],
      colorMap: {},
    }
  },
  methods: {
    getColor(order_id) {
      // If the order_id already has a color assigned, return it
      if (this.colorMap[order_id]) {
        return this.colorMap[order_id];
      }
  
      const hash = this.hashCode(order_id);
      const totalColors = this.colors.length;
      const colorIndex = Math.abs(hash % totalColors); 
  
      const assignedColor = this.colors[colorIndex];
  
      this.colorMap[order_id] = assignedColor;
  
      return assignedColor;
    },
    hashCode(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; 
      }
      return hash;
    },
  },
  template: `
    <div class="order" :data-order-id="order.order_id" style="display: flex; align-items: center; justify-content: space-between; position: relative;" >
      <div class="handle">
        <span><b>Order {{ order.order_id }} ({{ order.order_status }})</b> - {{  order.shipping_firstname }} {{ order.shipping_lastname }}</span>
        <b v-if="order.delivery_zone"> ({{ order.delivery_zone }})</b>
        <span v-if="order.has_helper" class="duplicate-order" :style="{'background-color': getColor(order.order_id)}">{{ order.index }} <b v-if="order.is_last">- last</b></span>
      </div>
      <div class="options">
        <span v-if="order.loading" class="loader"></span>
        <i v-else class="fa fa-ellipsis-h" style="font-size: 15px" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
        <ul class="dropdown-menu" aria-labelledby="dLabel" style="left: auto; right:0;">
          <li v-if="order.can_duplicate" @click="$emit('duplicate-order', order)" class="order-option" data-toggle="modal" data-target="#change-driver-modal">Duplicate Order</li>
          <li v-if="order.can_set_main" @click="$emit('set-main', order)" data-toggle="modal" data-target="#confirmation-modal" class="order-option">Set Last Driver</li>
          <li v-if="order.can_set_main" @click="$emit('remove', order)" data-toggle="modal" data-target="#confirmation-modal" class="order-option">Remove</li>
        </ul>
      </div>
    </div>
  `
};
