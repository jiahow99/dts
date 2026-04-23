const { base_url } = window.appConfig;
const { defineAsyncComponent, defineComponent } = Vue;

export default defineComponent({
  components: {
  },
  props: [
    'id',
    'modelValue',
    'label',
    'edit',
    'showButtons',
    'disable',
  ],
  template: `
    <div class="flex items-center justify-between text-base">
      <p class="w-5/12 text-center">{{ label }}:</p>
      <div tabindex="0" @blur="$emit('blur')" class="w-1/2 flex justify-between relative">
        <!-- Decrease -->
        <div v-if="edit && showButtons" @click="$emit('decrease')" class="w-2/12 aspect-square bg-primary text-xl rounded-md flex justify-center items-center">
          -
        </div>
        <input 
          type="number" 
          class="mx-auto text-center outline outline-[#2b3392] py-1 rounded-md bg-black/30 focus:bg-transparent " 
          :id="id"
          :class="{
            'bg-transparent outline-2': edit,
            'bg-black/30 outline-0': !edit,
            'w-8/12' : edit && showButtons,
            'w-full' : !edit,
          }"
          v-model="modelValue"
          :disabled="!edit"
        ></input>
        <!-- Edit -->
        <div v-if="!disable" @click="$emit('edit')" class="absolute right-3 top-1/2 -translate-y-1/2" :class="!edit && 'opacity-0 pointer-events-none'">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z"></path>
          </svg>
        </div>
        <!-- Increase -->
        <div v-if="edit && showButtons" @click="$emit('increase')" class="w-2/12 aspect-square bg-primary text-xl rounded-md flex justify-center items-center">
          +
        </div>
      </div>
    </div>
  `,
  setup() {
  },
});
