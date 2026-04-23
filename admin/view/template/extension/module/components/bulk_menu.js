
const { defineComponent, ref } = Vue;
export default defineComponent({
  components: {
  },
  props: [
    'menus',
  ],
  template: `
    <div class="relative z-10">
      <svg @click="showMenu = !showMenu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"></path></svg>
      <div @click="showMenu = false" v-if="showMenu" class="absolute z-50 top-full right-0 w-40 bg-white rounded-md shadow-2xl border-[1px] border-black/30 text-black">
        <button v-for="menu in menus" @click="menu.event" class="mdc-ripple-surface p-2">
          {{ menu.label }}
        </button>
      </div>
    </div>
  `,
  setup(props) {
    const showMenu = ref(false)

    return {
      showMenu,
    }
  }
});
