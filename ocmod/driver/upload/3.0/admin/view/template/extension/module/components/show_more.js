const { ref, defineComponent } = Vue;

export default defineComponent({
  props: [
    'showMore',
    'textColor',
  ],
  template: `
    <div class="flex gap-1 justify-center items-center underline" :class="textColor ? textColor : 'text-black/80'">
      <p>{{ showMore ? 'Show Less' : 'Show More' }}</p>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" :stroke="textColor ? 'white' : 'gray'" class="size-6 duration-200" :class="showMore && 'rotate-180'">
        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
  `,
  setup() {
    return {
      
    }
  },
});
