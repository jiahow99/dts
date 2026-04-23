const { defineComponent, ref } = Vue;

import Loading from '../components/loading.js';
import FilterBtn from '../components/filter_btn.js';
import BulkMenu from '../components/bulk_menu.js';
import Tabs from '../components/tabs.js';
import HamburgerMenu from '../components/hamburger_menu.js';
import Popup from '../components/popup.js';
import Btn from '../components/btn.js';

export default defineComponent({
  components: {
    Tabs,
    Loading,
    FilterBtn,
    BulkMenu,
    HamburgerMenu,
    Popup,
    Btn,
  },
  props: [
    'loading',
    'tabs',
    'activeTab',
    'checkedOrders',
    'bulkMenus',
    'toggleFilter',
    'hasFilter',
    'name',
    'logout',
    'back',
    'disableOverflow',
    'bulkLabel',
    'title',
    'hideCheckAll',
    'sideMenus',
    'roCount',
    'roUrl',
    'getRoute',
    'homeUrl',
    'hideClearFilter',
  ],
  template: `
    <div class="w-screen h-screen">
      <div class="bg-white z-40 sticky top-0 mb-1">
        <!-- Header -->
        <div class="w-full">
          <div class="w-full p-2 px-3 px-0 sm:px-10 flex justify-between items-center">
            <!-- Logo -->
            <a :href="homeUrl" class="w-1/12 sm:w-24"><img src="/image/catalog/logo_DTS.png" class="w-full"></a>
            <p class="w-1/2 truncate ... text-center">{{ name }}</p>
            <!-- Hamburger -->
            <svg @click="toggleMenu(true)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="size-8 z-50">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </div>
          <!-- Tabs -->
          <Tabs :tabs="tabs" :active-tab="activeTab"></Tabs>
        </div>
  
        <div v-if="back || title" class="flex justify-between gap-2 p-2 px-4">
          <!-- Back -->
          <a v-if="back" :href="back" class="w-2/12 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" stroke-width="2" stroke="black" class="size-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
            </svg>
          </a>
          <!-- Title -->
          <h1 v-if="title" class="w-10/12 text-2xl font-medium text-center">{{ title }}</h1>
          <span class="w-2/12"></span>
        </div>
  
        <div v-if="!hideCheckAll || toggleFilter" class="flex justify-between items-center p-4 pb-2">
          <!-- Check All -->
          <div class="flex items-center gap-2" :class="hideCheckAll && 'opacity-0'">
            <input @change="$emit('check-all', $event.target.checked)" type="checkbox" id="check-all" class="size-6 rounded-md">
            <label for="check-all" class="text-lg">All {{ checkedOrders?.length != 0 ? '(' + checkedOrders?.length + ')' : ''  }}</label>
            <!-- Bulk Action -->
            <Btn 
              v-if="bulkLabel && checkedOrders.length > 0"
              class="!px-5"
              @click="$emit('bulk-action', checkedOrders)"
            >
              {{ bulkLabel }}
            </Btn>
          </div>
          <!-- Filter -->
          <div v-if="toggleFilter" class="flex gap-2 items-center px-0 sm:px-10">
            <FilterBtn @click="toggleFilter(true)"></FilterBtn>
          </div>
        </div>  
      </div>
      
      <p 
        v-if="hasFilter && !hideClearFilter" 
        class="p-2 pt-0 text-right text-primary underline font-medium"
        @click.stop="$emit('clear-filter')" 
      >
        Clear Filters
      </p>

      <Transition name="fade">
        <Loading v-if="loading"></Loading>
      </Transition>

      <!-- Slot -->
      <div id="content" class="overflow-y-scroll flex flex-col mt-2" :class="!back && !title ? 'h-[80%]' : 'h-[88%]'">
        <slot></slot>
      </div>

      <!-- Menu modal -->
      <HamburgerMenu 
        :active="showMenu"
        :sideMenus="sideMenus" 
        :toggle-menu="toggleMenu"
        :logout="logout"
      ></HamburgerMenu>
      <Transition name="slide">
      </Transition>

      <!-- Reverted Order -->
      <a v-if="roCount > 0" :href="roUrl">
        <Popup :count="roCount"></Popup>
      </a>
    </div>
  `,
  setup(props) {
    const showMenu = ref(false);

    const toggleMenu = (value) => {
      showMenu.value = value;
    }

    return {
      showMenu,
      toggleMenu,
    }
  }
});
