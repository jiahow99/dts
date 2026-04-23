const { ref, defineComponent } = Vue;

export default defineComponent({
  props: [],
  template: `
    <button class="mdc-ripple-surface flex items-center gap-2 border-2 border-yellow-700 text-yellow-700 rounded-md py-2 px-4 font-medium text-sm">
      <span>Revert</span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
      </svg>
    </button>
  `,
  setup() {
    return {
    }
  },
});
