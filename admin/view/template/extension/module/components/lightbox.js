const { base_url } = window.appConfig;
const { defineAsyncComponent, defineComponent } = Vue;
const Closebtn = defineAsyncComponent(() => import(`${base_url}/extension/module/components/close_btn.js`));

export default defineComponent({
  components: {
    Closebtn
  },
  props: [
    'image',
  ],
  template: `
    <div class="z-50 fixed top-0 left-0 w-screen h-screen bg-black/70 flex gap-5 justify-center items-center snap-none">
      <div class="w-11/12 flex flex-col gap-5">
        <Closebtn @click="$emit('close')" class="ml-auto"></Closebtn>
        <img class="w-full" :src="image">
      </div>
    </div>
  `,
  setup() {
  },
});
