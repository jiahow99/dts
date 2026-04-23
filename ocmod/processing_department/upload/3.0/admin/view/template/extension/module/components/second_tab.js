const { ref, defineComponent } = Vue;

export default defineComponent({
  props: ['title', 'active', 'total'],
  template: `
    <div class="px-2">
      <!-- Tab -->
      <div class="sticky top-0 bg-slate-300 z-10" @click="$emit('click-tab')">
        <div class="p-2 bg-primary flex justify-between items-center gap-5 rounded-md px-2">
          <h1 class="font-medium">
            {{ title }}
            <span v-if="total > 0" class="ml-2 px-2 rounded-full text-primary bg-white">{{ total }}</span>
          </h1>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewbox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-6 duraton-200" :class="!active && 'rotate-180'">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
          </svg>
        </div>
      </div>
      <!-- Orders -->
      <template v-if="active">
        <div class="py-2 flex flex-col gap-2">
          <slot name="orders"></slot>
        </div>
      </template>
    </div>
  `,
  setup() {
    return {
      
    }
  },
});
