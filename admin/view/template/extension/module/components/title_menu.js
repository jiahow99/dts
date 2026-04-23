const { ref, defineComponent } = Vue;

export default defineComponent({
  props: ['title', 'show', 'hideCollapse', 'showMenuToggle', 'total'],
  template: `
  <div class="z-10 pt-4 pb-2 bg-primary shadow-xl sticky top-0">
    <div @click="$emit('collapse')" class="px-4 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <h1 class="text-xl font-medium">{{ title }}</h1>
        <!-- Collapse -->
        <button v-if="!hideCollapse">
          <svg class="duration-200 size-4" :class="!show && 'rotate-180'" xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="5" stroke="white">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        <!-- Total -->
        <span v-if="total" class="w-6 aspect-square flex items-center justify-center rounded-full bg-green-600 text-center">
          {{ total }}
        </span>
      </div>
      <!-- Menu -->
      <div class="relative">
        <svg v-if="showMenuToggle" @click.stop="showMenu = !showMenu" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="size-8">
          <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM15.375 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clip-rule="evenodd" />
        </svg>
        <div v-if="showMenu" class="absolute right-0 top-full bg-white w-36 shadow-lg text-black rounded-md">
          <button @click="$emit('bulkGenerate'); showMenu = false" class=" py-3 w-full border-b-2 mdc-ripple-surface">
            Bulk generate
          </button>
        </div>
      </div>
    </div>
  </div>
  `,
  setup() {
    const showMenu = ref(false);

    return {
      showMenu,
    }
  },
});
