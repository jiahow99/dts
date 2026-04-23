const { base_url, dir_image } = window.appConfig;
const { defineComponent, defineAsyncComponent, ref, computed, watch } = Vue;

export default defineComponent({
  props: [
    'sideMenus',
    'logout',
    'toggleMenu',
    'active',
  ],
  template: `
    <div class="z-40 bg-white w-screen h-screen fixed top-0 left-0 duration-200" :class="active ? 'translate-x-0' : '-translate-x-[100%]'">
      <!-- Header -->
      <div class="flex h-[10%] border-b-2 border-gray-300 shadow-md flex justify-between items-center">
        <!-- Logo -->
        <img src="/image/catalog/logo_DTS.png" class="w-2/12">
        <!-- Close -->
        <svg @click="toggleMenu(false)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="4" stroke="currentColor" class="size-10">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>    
      </div>

      <div class="h-[90%] overflow-y-scroll">
        <!-- Menus -->
        <div @click="handleClick(menu.event)" v-for="menu in sideMenus" class="w-full flex justify-center items-center font-medium text-lg text-primary py-5">
          <div class="w-3/12 flex justify-center items-center">
            <span v-html="menu.icon"></span>         
          </div>
          <div class="w-9/12 flex justify-start items-center gap-2">
            <span>{{ menu.label }}</span>
            <span v-if="menu.total > 0" class="px-3 rounded-full bg-primary">{{ menu.total }}</span>
          </div>
        </div>
        <!-- Logout -->
        <a :href="logout" class="w-full flex bg-red-500 justify-center items-center gap-2 font-medium text-lg text-white py-5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-7">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
          </svg>            
          <p>Logout</p>
        </a>
      </div>
      
      <div class="w-full h-screen bg-white flex flex-col">
        <div class="h-[90%]">
          
        </div>
      </div>
    </div>
  `,
  setup(props) {
    const handleClick = (callback) => {
      props.toggleMenu(false)
      callback();
    }
    
    return {
      handleClick,
    }
  }
});
