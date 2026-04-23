const { ref, defineComponent } = Vue;

export default defineComponent({
  props: [
    'count',
  ],
  template: `
    <div class="absolute bottom-10 right-6 rounded-full w-20 aspect-square bg-red-500 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="size-10 text-white">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
      <template v-if="count">
        <div class="absolute -top-2 -right-2 bg-red-300 animate-ping rounded-full px-4 py-1 text-lg"><span class="opacity-0">{{ count }}</span></div>
        <div class="absolute -top-2 -right-2 bg-red-300 rounded-full z-10 px-4 py-1 text-lg font-semibold">
          {{ count }}
        </div>
      </template>
    </div>
  `,
  setup() {
    return {
      
    }
  },
});
