const { defineComponent, ref } = Vue;

export default defineComponent({
  props: [
    'deliveryZone', 
    'driver', 
    'phone',
  ],

  template: `
    <div @click.stop="collapsed = !collapsed" class="m-2 bg-primary p-2 text-xs rounded-sm">
      <div class="w-full flex items-center gap-2">
        <div class="w-1/12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
          </svg>
        </div>
        <!-- Deliver To -->
        <div class="w-10/12 text-slate-300">
          <span>
            Deliver to 
            <span class="font-semibold text-white">{{ deliveryZone || 'Unknown' }}</span> 
            by 
            <span class="font-semibold text-white">{{ driver || 'Unknown' }}</span>
          </span>
        </div>
        <!--
        <div class="w-1/12 flex justify-end">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3 duration-200" :class="collapsed && 'rotate-180'">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
        -->
      </div>
      <!-- Call -->
      <!-- <div v-if="collapsed" class="flex justify-end font-medium">
        <button class="mt-1 border-[1px] px-3 py-1 border-primary rounded-md flex items-center gap-2 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
          </svg>
          <p>0187739220</p>
        </button>
      </div> -->
    </div>
  `,
  setup(props) {
    const collapsed = ref(false);


    return {
      collapsed,
    }
  }
});
