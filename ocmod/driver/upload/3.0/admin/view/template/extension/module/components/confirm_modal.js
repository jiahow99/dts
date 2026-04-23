const { defineComponent, defineAsyncComponent, ref } = Vue;
const Closebtn = defineAsyncComponent(() => import('./close_btn.js'));

export default defineComponent({
  components: {
    Closebtn,
  },
  props: [
    'action',
  ],
  template: `
    <Transition>
      <div v-if="show" class="z-40 fixed top-0 left-0 w-screen h-screen bg-black/70 flex justify-center items-center">
        <div class="w-11/12 mx-auto bg-white rounded-2xl p-4">
          <!-- Close Btn -->
          <Closebtn @click="close()"></Closebtn>
          <!-- Confirm -->
          <h1 class="text-lg font-medium text-center">{{ title }}</h1>
          <p class="mt-3 text-black/70 text-center" v-html="description"></p>
          <div class="flex gap-2 mt-10">
            <!-- Cancel -->
            <button @click="close()" class="w-1/2 border-2 rounded-md bg-red-500 text-white py-1 mdc-ripple-surface">Cancel</button>
            <!-- Confirm -->
            <button @click="confirm()" class="w-1/2 border-2 rounded-md bg-green-600 text-white py-1 mdc-ripple-surface">Proceed</button>
          </div>
        </div>
      </div>
    </Transition>
  `,
  setup(props) {
    const title = ref('');
    const description = ref('');
    const show = ref(false);

    const open = (_title, _description) => {
      title.value = _title;
      description.value = _description;
      show.value = true;
    }
    
    const close = () => {
      show.value = false;
    }

    const confirm = () => {
      show.value = false;
      props.action();
    }

    return {
      title,
      description,
      show,
      close,
      confirm,
      open,
    }
  }
});
