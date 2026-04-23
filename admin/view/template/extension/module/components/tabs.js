const { ref, defineComponent } = Vue;

export default defineComponent({
  props: ['tabs', 'activeTab'],
  template: `
    <div class="w-full flex items-center justify-start flex-nowrap overflow-x-scroll no-scrollbar px-0 sm:px-10">
      <button
        v-for="(tab, i) in tabs"
        :key="i"
        class="px-5 py-2 text-nowrap border-primary flex gap-2 items-center"
        :class="activeTab == tab.label && 'border-b-2 text-primary font-medium'"
        @click="tab.event"
      >
        <span>{{ tab.label }}</span>
        <span v-if="tab.total > 0 && !tab.hideTotal" class="px-2 py-1 text-xs bg-primary rounded-full flex justify-center items-center">
          {{ tab.total }}
        </span>
      </button>
    </div>
  `,
  setup() {
    return {
    }
  },
});
