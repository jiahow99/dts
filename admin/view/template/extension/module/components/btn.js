
const { defineComponent, computed } = Vue;
export default defineComponent({
  components: {
  },
  props: [
    'type',
    'disabled',
    'width',
  ],
  template: `
    <button :disabled="disabled" class="px-10 py-2 rounded-md text-sm font-medium" :class="styles">
      <slot></slot>
    </button>
  `,
  setup(props) {
    const styles = computed(() => {
      var style = '';
      switch (props.type) {
        case 'primary':
          style = 'bg-primary'; break; 
        case 'secondary':
          style = 'bg-primary'; break;
        case 'success':
          style = 'bg-emerald-500 text-white font-semibold';break; 
        case 'outline':
          style = 'border-2 border-primary text-primary font-semibold';break; 
        case 'outline-warning':
          style = 'border-2 border-yellow-700 text-yellow-700 font-semibold';break; 
        default:
          style = 'bg-primary'; break; 
      }
      
      if (props.width) {
        style += props.width;
      }

      return style;
    })

    return {
      styles,
    }
  }
});
