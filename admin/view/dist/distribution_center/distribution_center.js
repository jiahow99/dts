const{ref:A,computed:he}=Vue,Y="extension/module/distribution_center",be='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8"><path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"></path><path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"></path></svg>',ge='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8"><path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd"></path></svg>',ye='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8"><path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z"></path><path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z"></path></svg>',xe='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8"><path fill-rule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm5.845 17.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V12a.75.75 0 0 0-1.5 0v4.19l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z" clip-rule="evenodd"></path><path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z"></path></svg>';function _e(){return new URLSearchParams(window.location.search).get("user_token")||""}function ke(t){const d=new URLSearchParams,a=_e();if(a&&d.set("user_token",a),!t)return d;for(const[c,l]of Object.entries(t))l==null||l===""||d.set(c,String(l));return d}function V(t="",d={},a=!1){const c=a?t:t?`${Y}/${t}`:Y,o=ke(d).toString();return o?`index.php?route=${c}&${o}`:`index.php?route=${c}`}function Ce(){const t=A(0),d=A(0),a=A(0),c=A(0);return{sideMenus:he(()=>[{label:"Home",icon:be,total:c.value,event:()=>{window.location.href=V()}},{label:"Overdue Orders",icon:ge,total:t.value,event:()=>{window.location.href=V("overdue")}},{label:"Advance Orders",icon:ye,total:0,event:()=>{window.location.href=V("advance")}},{label:"Revert Orders",icon:xe,total:d.value,event:()=>{window.location.href=V("revertOrders")}}]),totalOverdue:t,totalRevert:d,totalPickup:a,totalNew:c,getRoute:V}}const{defineComponent:$e}=Vue,J=$e({components:{},props:[],template:`
    <div class="z-50 fixed top-0 left-0 w-screen h-screen flex justify-center items-center">
        <div class="flex flex-col gap-4 justify-center items-center px-8 py-6 bg-black/60 backdrop-blur rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-12 animate-spin">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>          
            <p class="text-white uppercase">loading</p>
        </div>
    </div>
  `,setup(){}}),{defineComponent:Me,onMounted:Oe}=Vue,X=Me({props:[],template:`
    <button class="flex items-center gap-1 font-medium text-primary text-lg" >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
        </svg>
        <span>Filter</span>
    </button>
  `,setup(){Oe(()=>{})}}),{defineComponent:ze,ref:je}=Vue,De=ze({components:{},props:["menus"],template:`
    <div class="relative z-10">
      <svg @click="showMenu = !showMenu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"></path></svg>
      <div @click="showMenu = false" v-if="showMenu" class="absolute z-50 top-full right-0 w-40 bg-white rounded-md shadow-2xl border-[1px] border-black/30 text-black">
        <button v-for="menu in menus" @click="menu.event" class="mdc-ripple-surface p-2">
          {{ menu.label }}
        </button>
      </div>
    </div>
  `,setup(t){return{showMenu:je(!1)}}}),{ref:Rt,defineComponent:Be}=Vue,Ve=Be({props:["tabs","activeTab"],template:`
    <div class="w-full flex items-center justify-start flex-nowrap overflow-x-scroll no-scrollbar px-0 sm:px-10">
      <button
        v-for="(tab, i) in tabs"
        :key="i"
        class="px-5 py-2 text-nowrap border-primary flex gap-2 items-center"
        :class="activeTab == tab.label && 'border-b-2 text-primary font-medium'"
        @click="tab.event"
      >
        <span>{{ tab.label }}</span>
        <span v-if="tab.total > 0 && !tab.hideTotal" class="px-2 py-1 text-xs bg-primary rounded-full flex justify-center items-center">
          {{ tab.total }}
        </span>
      </button>
    </div>
  `,setup(){return{}}}),{base_url:Ht,dir_image:Qt}=window.appConfig,{defineComponent:Pe,defineAsyncComponent:Wt,ref:Ut,computed:It,watch:Nt}=Vue,Se=Pe({props:["sideMenus","logout","toggleMenu","active"],template:`
    <div class="z-40 bg-white w-screen h-screen fixed top-0 left-0 duration-200" :class="active ? 'translate-x-0' : '-translate-x-[100%]'">
      <!-- Header -->
      <div class="flex border-b-2 border-gray-300 shadow-md flex justify-between items-center py-2 px-5">
        <!-- Logo -->
        <img src="/image/catalog/logo_DTS.png" class="w-2/12 max-w-32">
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
  `,setup(t){return{handleClick:a=>{t.toggleMenu(!1),a()}}}}),{ref:Yt,defineComponent:Te}=Vue,Ae=Te({props:["count"],template:`
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
  `,setup(){return{}}}),{defineComponent:Ze,computed:qe}=Vue,Z=Ze({components:{},props:["type","disabled","width"],template:`
    <button :disabled="disabled" class="px-10 py-2 rounded-md text-sm font-medium" :class="styles">
      <slot></slot>
    </button>
  `,setup(t){return{styles:qe(()=>{var a="";switch(t.type){case"primary":a="bg-primary";break;case"secondary":a="bg-primary";break;case"success":a="bg-emerald-500 text-white font-semibold";break;case"outline":a="border-2 border-primary text-primary font-semibold";break;case"outline-warning":a="border-2 border-yellow-700 text-yellow-700 font-semibold";break;default:a="bg-primary";break}return t.width&&(a+=t.width),a})}}}),{defineComponent:Le,ref:Fe}=Vue,Ee=Le({components:{Tabs:Ve,Loading:J,FilterBtn:X,BulkMenu:De,HamburgerMenu:Se,Popup:Ae,Btn:Z},props:["loading","tabs","activeTab","checkedOrders","bulkMenus","toggleFilter","hasFilter","name","logout","back","disableOverflow","bulkLabel","title","hideCheckAll","sideMenus","roCount","roUrl","getRoute","homeUrl","hideClearFilter"],template:`
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
  `,setup(t){const d=Fe(!1);return{showMenu:d,toggleMenu:c=>{d.value=c}}}}),{ref:Gt,defineComponent:Re}=Vue,He=Re({props:["title","active","total"],template:`
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
  `,setup(){return{}}}),{ref:Kt,defineComponent:Qe}=Vue,We=Qe({props:["showMore","textColor"],template:`
    <div class="flex gap-1 justify-center items-center underline" :class="textColor ? textColor : 'text-black/80'">
      <p>{{ showMore ? 'Show Less' : 'Show More' }}</p>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" :stroke="textColor ? 'white' : 'gray'" class="size-6 duration-200" :class="showMore && 'rotate-180'">
        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
  `,setup(){return{}}}),{defineComponent:Ue,ref:G,computed:L,watch:Ie}=Vue,ee=Ue({components:{ShowMore:We,Btn:Z},props:["order","products","hideCheckbox","hideShowMore","buttonLabel","hideButton","checkedOrders","status","showWarehouseQty","disableWarehouseQty","showFinalQty","disableFinalQty","menus","hideName","addedBy","updatedBy","hideTotal","disableRo","showOverdue","getRoute","edit"],template:`
    <div class="w-full rounded-md text-black bg-white" :class="order.is_revert_order && !disableRo && 'border-4 border-red-500'">
      <!-- Header -->
      <div 
        class="p-2 border-b-[1px] border-black/30 rounded-t-md" 
        :class="isPrimary && 'bg-yellow-500 text-white'"  
      >
        <!-- Menus -->
        <div v-if="menus" @click.stop="" class="relative flex justify-end items-center gap-2 mb-1">
          <svg @click="showMenu = !showMenu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          <div v-if="showMenu" class="absolute top-full right-0 bg-white rounded-md shadow-2xl bg-gray-300 border-[1px] border-gray-400">
            <button v-for="menu in menus" @click.stop="handleMenuClick(menu.event)" class="w-36 p-2">{{ menu.label }}</button>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <div class="flex items-center w-8/12 gap-2">
            <!-- Checkbox -->
            <input 
              v-if="!hideCheckbox" 
              type="checkbox" 
              class="size-6 rounded-full"
              :id="'order-'+order.order_id"
              @click.stop="" 
              @change="$emit('checked', $event.target.checked, order)" 
              :checked="checkedOrders.includes(order.warehouse_order_id) || checkedOrders.includes(order.warehouse_order_batch_id) || checkedOrders.includes(order)" 
            >
            <div>
              <!-- Order id -->
              <label @click.stop="" :for="'order-'+order.order_id" class="text-base text-primary font-semibold break-words">Order #{{ order.order_id }} <span v-if="order.is_replacement" class="text-red-500">[R]</span> <span v-if="addedBy">- {{ addedBy }}</span></label>
              <!-- DO -->
              <p v-if="order.doc_no" class="text-sm font-medium text-primary break-words">DO #{{ order.doc_no }}</p>
            </div>
          </div>
          <!-- Delivery -->
          <div class="w-5/12 text-right">
            <div class="flex justify-end items-center gap-2 font-semibold" :class="isOverdue && showOverdue ? 'text-red-500' : 'text-primary'">
              <svg v-if="isOverdue && showOverdue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
              </svg>
              <p>{{ order.delivery_date }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full p-2 pb-0 flex justify-between items-start gap-2 text-sm">
        <!-- Store name -->
        <div class="flex items-start gap-1" :class="status ? 'w-8/12' : 'w-full'">
          <template v-if="!hideName">
            <svg xmlns="http://www.w3.org/2000/svg" fill="gray" viewBox="0 0 24 24" stroke-width="1.8" stroke="gray" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <p class="text-gray-600 break-words ... ">
              {{ order.shipping_firstname }} {{ order.shipping_lastname }}
            </p>
          </template>
        </div>
          <!-- Status-->  
        <div v-if="status" class="w-4/12">
          <p class="text-primary text-right">{{ status }}</p>
        </div>
      </div>

      <!-- Products -->
      <div class="flex flex-col gap-1 p-2 pt-0 max-h-[60vh] overflow-y-scroll pt-2">
        <TransitionGroup>
          <div 
            v-for="(product, index) in computedProducts" 
            :key="product.product_id" 
            class="w-full p-2"
            :class="(showWarehouseQty || showFinalQty) && 'border-[2px] rounded-md border-black/30'"
          >
            <div class="w-full flex gap-2">
              <!-- Image -->
              <div class="w-2/12 h-fit border-2 border-gray-300 rounded-md">
                <img class="w-full object-cover rounded-md" :src="product.image">
              </div>
              <div class="w-10/12 text-sm">
                <div class="w-full flex justify-between items-center text-gray-600">
                  <!-- Name -->
                  <p class="w-8/12 font-medium">{{ product.name || product.model }} </p>
                  <!-- Quantity -->
                  <p class="text-sm text-center px-3 py-1 rounded-full bg-green-700 text-white flex items-center justify-center">
                    x {{ product.quantity }} {{ product.product_unit }}
                  </p>
                </div>
                <div class="text-sm font-medium text-primary capitalize">
                  <!-- Option 1-->
                  <p v-if="product.option && product.option_value">
                    {{ product.option_value }}
                  </p>
                  <!-- Option 2 -->
                  <p v-if="product.option2 && product.option_value2">
                    {{ product.option_value2 }}
                  </p>
                  <!-- Weight -->
                  <p v-if="product.show_weight">Total = {{ product.order_weight }} kg</p>
                </div>
                <!-- Remark -->
                <div v-if="product.remark" class="w-9/12  text-red-500 rounded-md">
                  *{{ product.remark }}
                </div> 
              </div>
            </div>
            
            <div v-if="showWarehouseQty || showFinalQty" class="mt-4 flex flex-col gap-4 text-sm font-medium text-gray-700">
              <!-- Warehouse Qty -->
              <div v-if="showWarehouseQty" class="flex items-center justify-between">
                <p>Warehouse Qty :</p>
                <div class="w-7/12 flex justify-between items-center border-2 text-gray-700 border-gray-400 rounded-md">
                  <!-- Warehouse Qty (edit)-->
                  <template v-if="edit">
                    <input 
                      type="number" 
                      v-model="product.warehouse_qty" 
                      class="w-7/12 py-2 text-center bg-transparent disabled:bg-gray-300 border-r-2 border-black/60" 
                      :disabled="disableWarehouseQty"
                      @focus="$event.target.select()"
                    ></input>
                  </template>
                  <!-- Warehouse Qty (peview)-->
                  <template v-else>
                    <input 
                      v-if="product.warehouse_qty == 0"
                      type="text" 
                      class="w-7/12 py-2 text-center text-red-600 bg-gray-300 border-r-2 border-black/60" 
                      value="OOS"
                      disabled
                    ></input>
                    <input 
                      type="number" 
                      v-else
                      v-model="product.warehouse_qty" 
                      class="w-7/12 py-2 text-center bg-transparent disabled:bg-gray-300 border-r-2 border-black/60" 
                      :disabled="true"
                      @focus="$event.target.select()"
                    ></input>
                  </template>
                  <div class="w-5/12 py-2 bg-gray-300 flex justify-center items-center">
                    {{ product.quantity }}
                  </div>
                </div>
              </div>

              <!-- Final Qty -->
              <div v-if="showFinalQty" class="flex items-center justify-between">
                <p>Final Qty :</p>
                <div class="w-7/12 flex justify-between items-center border-2 text-gray-700 border-gray-400 rounded-md">
                  <!-- Final Qty (edit) -->
                  <template v-if="edit">
                    <input 
                      type="number" 
                      v-model="product.dc_qty" 
                      class="w-7/12 py-2 text-center bg-transparent disabled:bg-gray-300 border-r-2 border-black/60" 
                      :disabled="disableFinalQty"
                      @focus="$event.target.select()"
                    ></input>
                  </template>
                  <!-- Final Qty (edit) -->
                  <template v-else>
                    <input 
                      v-if="product.dc_qty == 0"
                      type="text" 
                      class="w-7/12 py-2 text-center text-red-600 bg-gray-300 border-r-2 border-black/60" 
                      value="OOS"
                      disabled
                    ></input>
                    <input 
                      v-else
                      type="number" 
                      v-model="product.dc_qty" 
                      class="w-7/12 py-2 text-center bg-transparent disabled:bg-gray-300 border-r-2 border-black/60" 
                      :disabled="disableFinalQty"
                      @focus="$event.target.select()"
                    ></input>
                  </template>
                  <div class="w-5/12 py-2 bg-gray-300 flex justify-center items-center">
                    / {{ product.quantity }}
                  </div>
                </div>
              </div>

              <!-- Weight -->
              <div v-if="product.show_weight" class="flex items-center justify-between">
                <p>Weight (kg) :</p>
                <!-- Add Weight -->
                <div v-if="edit" class="w-fit ml-auto mr-2">
                  <svg @click="addWeight(product)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="#2b3392" class="size-8 cursor-pointer mdc-ripple">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>

                <div class="w-7/12 flex justify-between items-center border-2 border-gray-400 text-gray-700  rounded-md bg-gray-300">
                  <!-- Partial Weight (edit) -->
                  <template v-if="edit">
                    <div class="w-7/12 flex flex-col border-r-2 border-black/60">
                      <div class="relative" v-for="(pw, i) in product.partial_weights" >
                        <input
                          type="number" 
                          v-model="product.partial_weights[i]" 
                          class="w-full py-2 text-center border-gray-400 bg-white disabled:bg-gray-300" 
                          :class="i+1 != product.partial_weights.length && 'border-b-2'"
                          :id="'pw-' + product.order_product_id + '-' + i"
                          :disabled="i != product.partial_weights.length - 1"
                          @focus="$event.target.select()"
                        ></input>
                        <!-- Remove Weight -->
                        <div v-if="product.partial_weights.length > 1" @click="removeWeight(i, product)" class="absolute right-1 top-1/2 -translate-y-1/2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="red" class="size-7">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>                        
                        </div>
                      </div>
                    </div>
                  </template>
                  <!-- Partial Weight (preview) -->
                  <template v-else>
                    <input 
                      v-if="product.weight == 0"
                      type="text" 
                      class="w-7/12 py-2 text-center text-red-600 bg-gray-300 border-r-2 border-black/60" 
                      value="OOS"
                      disabled
                    ></input>
                    <div v-else class="w-7/12 flex flex-col border-r-2 border-black/60">
                      <input
                        v-for="(pw, i) in product.partial_weights"
                        type="number" 
                        v-model="product.partial_weights[i]" 
                        class="w-full py-2 text-center border-gray-400 bg-white disabled:bg-gray-300" 
                        :class="i+1 != product.partial_weights.length && 'border-b-2'"
                        :id="'pw-' + product.order_product_id + '-' + i"
                        :disabled="true"
                      ></input>
                    </div>
                  </template>
                  <div class="w-5/12 text-center py-2 flex justify-center items-center">
                    {{ product.weight }} / {{ product.order_weight }}
                  </div>
                </div>
              </div>

              <div v-if="edit || product.out_of_stock" class="flex justify-end gap-2 text-black/80">
                <input 
                  type="checkbox" 
                  v-model="product.out_of_stock"
                  :disabled="!edit" 
                  :id="'out-of-stock-' + product.order_product_id"
                >
                <label 
                  :for="'out-of-stock-' + product.order_product_id"
                  :class="product.out_of_stock && 'text-red-500'"
                >
                  Out Of Stock
                </label>
              </div>
            </div>
          </div>
        </TransitionGroup>
        <!-- Show More-->
        <ShowMore
          v-if="!hideShowMore && products.length > 1"
          :show-more="showMore"
          @click.stop="showMore = !showMore"
        ></ShowMore>
        
        <!-- Total -->
        <p v-if="!hideTotal" class="px-2 mt-2 text-sm font-medium text-primary">{{ 'Total items: ' + products?.length }} </p>
      </div>

      <!-- Info -->
      <slot name="info"></slot>

      <!-- Footer -->
      <div v-if="!hideTotal || !hideButton" class="flex flex-col gap-2 p-2 border-t-[1px] border-black/30">
        <!-- Updated by-->
        <div v-if="updatedBy" class="text-right text-sm">
          <p class="font-medium text-primary rounded-full">By: {{ updatedBy }}</p>
        </div>

        <div class="w-full flex justify-end items-center">
          <!-- Buttons -->
          <Btn
            v-if="!hideButton && !hasSlot('buttons')"
            @click.stop="$emit('confirm')"
          >
            {{ buttonLabel ? buttonLabel : 'Process' }}
          </Btn>
          <slot name="buttons"></slot>
        </div>
      </div>
    </div> 
  `,setup(t,{slots:d}){const a=G(!1),c=G(!1),l=L(()=>{let r=t.products;return a.value||t.hideShowMore?r:r.slice(0,1)}),o=r=>!!d[r];Ie(()=>t.products.map(r=>({warehouse_qty:r.warehouse_qty,dc_qty:r.dc_qty,partial_weights:r.partial_weights})),(r,v)=>{r.forEach((h,b)=>{const x=t.products[b];x.weight=h.partial_weights.reduce((k,M)=>k+M,0),h.warehouse_qty>0||h.dc_qty>0||x.weight>0?x.out_of_stock=!1:x.out_of_stock=!0})},{deep:!0});const u=(r,v)=>{r[v]>0&&r[v]--,r.out_of_stock=r[v]==0},n=(r,v)=>{r[v]<r.quantity&&r[v]++,r.out_of_stock=r[v]==0},p=async r=>{if(r.partial_weights[r.partial_weights.length-1]!=0){r.partial_weights.push(0),r.out_of_stock=!1,setTimeout(()=>{$(`#pw-${r.order_product_id}-${r.partial_weights.length-1}`).focus()},1);try{const{data:v}=await axios.post(t.getRoute("extension/module/processing_department/updateWeight",{},!0),{order_product_id:r.order_product_id,partial_weights:r.partial_weights.filter(h=>h!=0)})}catch(v){console.error(v)}}},y=async(r,v)=>{v.partial_weights.splice(r,1);try{const{data:h}=await axios.post(t.getRoute("extension/module/processing_department/updateWeight",{},!0),{order_product_id:v.order_product_id,partial_weights:v.partial_weights.filter(b=>b!=0)})}catch(h){console.error(h)}},j=r=>{c.value=!1,r(t.order)},m=L(()=>{const r=t.order.delivery_date,[v,h,b]=r.split("/").map(Number),x=new Date(b,h-1,v),k=new Date;return k.setHours(0,0,0,0),x.getTime()===k.getTime()}),_=L(()=>{const r=t.order.delivery_date,[v,h,b]=r.split("/").map(Number),x=new Date(b,h-1,v),k=new Date;return k.setHours(0,0,0,0),x.getTime()<k.getTime()});return{showMenu:c,showMore:a,computedProducts:l,hasSlot:o,handleDecrease:u,handleIncrease:n,handleMenuClick:j,isPrimary:m,isOverdue:_,addWeight:p,removeWeight:y}}}),{defineComponent:Ne}=Vue,R=Ne({props:["fill"],template:`
    <div class="flex justify-end">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="fill ? fill : 'red'" class="size-10">
        <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd" />
      </svg>
    </div>
  `}),{defineComponent:Ye}=Vue,Ge=Ye({components:{Order:ee,Closebtn:R},props:["order","type","products","toggleConfirm","showUpdate","disableUpdate","hideButton","buttonLabel","showWarehouseQty","disableWarehouseQty","showFinalQty","disableFinalQty"],template:`
    <div class="z-50 fixed top-0 left-0 w-screen h-screen bg-black/70 flex justify-center items-center snap-none">
      <div class="bg-white rounded-md pt-2 w-11/12">
        <!-- Close -->
        <Closebtn @click="$emit('cancel')" class="mb-2"></Closebtn>
        <!-- Order -->
        <Order 
          :type="type"
          :order="order"
          :products="order.products"
          @cancel="$emit('cancel')"
          @confirm="$emit('confirm')"
          :with-close-btn="true"
          :hide-show-more="true"
          :hide-checkbox="true"
          :include-photo="true"
          :show-update="showUpdate"
          :show-warehouse-qty="showWarehouseQty || false"
          :disable-warehouse-qty="disableWarehouseQty || false"
          :show-final-qty="showFinalQty || false"
          :disable-final-qty="disableFinalQty || false"
          :hide-button="hideButton"
          :button-label="buttonLabel"
        ></Order>
      </div>
    </div>
  `,setup(){}}),Ke="modulepreload",Je=function(t){return"/"+t},K={},B=function(d,a,c){let l=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const u=document.querySelector("meta[property=csp-nonce]"),n=(u==null?void 0:u.nonce)||(u==null?void 0:u.getAttribute("nonce"));l=Promise.allSettled(a.map(p=>{if(p=Je(p),p in K)return;K[p]=!0;const y=p.endsWith(".css"),j=y?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${j}`))return;const m=document.createElement("link");if(m.rel=y?"stylesheet":Ke,y||(m.as="script"),m.crossOrigin="",m.href=p,n&&m.setAttribute("nonce",n),document.head.appendChild(m),y)return new Promise((_,r)=>{m.addEventListener("load",_),m.addEventListener("error",()=>r(new Error(`Unable to preload CSS for ${p}`)))})}))}function o(u){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=u,window.dispatchEvent(n),!n.defaultPrevented)throw u}return l.then(u=>{for(const n of u||[])n.status==="rejected"&&o(n.reason);return d().catch(o)})},{base_url:te}=window.appConfig,{ref:Jt,defineComponent:Xe,defineAsyncComponent:re}=Vue,et=re(()=>B(()=>import(`${te}/extension/module/components/order.js`),[])),tt=re(()=>B(()=>import(`${te}/extension/module/components/close_btn.js`),[])),rt=Xe({components:{Order:et,Closebtn:tt},props:["order","type","toggleConfirm","getRoute"],template:`
    <div class="z-40 fixed top-0 left-0 w-screen h-screen bg-black/70 flex justify-center items-center">
      <div class="bg-white rounded-md pt-2 w-11/12">
        <!-- Close -->
        <Closebtn @click="$emit('cancel')" class="mb-2"></Closebtn>
        <!-- Order -->
        <Order 
          :type="type"
          :order="order"
          :products="order.products"
          @cancel="$emit('cancel')"
          @confirm="$emit('confirm')"
          :with-close-btn="true"
          :hide-show-more="true"
          :hide-checkbox="true"
          :show-final-qty="true"
          :disable-ro="true"
          :get-route="getRoute"
          button-label="Submit"
        ></Order>
      </div>
    </div>
  `,setup(){}}),{base_url:ot}=window.appConfig,{defineComponent:st,defineAsyncComponent:it}=Vue,lt=it(()=>B(()=>import(`${ot}/extension/module/components/close_btn.js`),[])),nt=st({components:{Closebtn:lt},props:["order"],template:`
    <div class="z-40 fixed top-0 left-0 w-screen h-screen bg-black/70 flex justify-center items-center">
      <div class="w-11/12 mx-auto bg-white rounded-2xl p-4">
        <!-- Close Btn -->
        <Closebtn @click="$emit('close')"></Closebtn>
        <!-- Confirm -->
        <h1 class="text-lg font-medium text-center">Confirm Order ?</h1>
        <p class="mt-3 text-black/70 text-center">
            Order 
            <span class="font-medium text-black">#{{ order.order_id }}</span> 
            for 
            <span class="font-medium text-black">{{ order.shipping_firstname }} {{ order.shipping_lastname }}</span>
            will be confirmed.
        </p>
        <div class="flex gap-2 mt-10">
          <!-- Cancel -->
          <button @click="$emit('close')" class="w-1/2 border-2 rounded-md bg-red-500 text-white py-1 mdc-ripple-surface">Cancel</button>
          <!-- Confirm -->
          <button @click="$emit('confirm')" class="w-1/2 border-2 rounded-md bg-green-600 text-white py-1 mdc-ripple-surface">Proceed</button>
        </div>
      </div>
    </div>
  `,setup(t){}}),{base_url:at}=window.appConfig,{defineComponent:dt,defineAsyncComponent:ct,ref:ut}=Vue,pt=ct(()=>B(()=>import(`${at}/extension/module/components/close_btn.js`),[])),vt=dt({components:{Closebtn:pt},props:["order","deliveryZones"],template:`
    <div class="z-40 absolute top-0 left-0 w-screen h-screen bg-black/70 flex justify-center items-center">
      <div class="w-11/12 mx-auto bg-white rounded-2xl p-4">
        <!-- Close Btn -->
        <Closebtn @click="$emit('close')" class="mb-10"></Closebtn>
        <!-- Confirm -->
        <h1 class="text-2xl font-semibold text-center">Change Driver ?</h1>
        <p class="mt-3">Please select delivery zone :</p>
        <select v-model="deliveryZoneId" class="mt-1 w-full py-1 rounded-md border-2 border-black/60">
            <option value="">-- Please Select --</option>
            <option 
              v-for="zone in deliveryZones" 
              :key="zone.delivery_zone_id" 
              :value="zone.delivery_zone_id"
            >
              {{ zone.name }} - {{ zone.driver }}
            </option>
        </select>
        <div class="flex gap-2 mt-5">
          <!-- Cancel -->
          <button @click="$emit('close')" class="w-1/2 border-2 rounded-md bg-gray-600 text-white py-2 mdc-ripple-surface">Cancel</button>
          <!-- Confirm -->
          <button @click="$emit('confirm', order, deliveryZoneId)" class="w-1/2 border-2 rounded-md bg-green-600 text-white py-2 mdc-ripple-surface">Proceed</button>
        </div>
      </div>
    </div>
  `,setup(t){return{deliveryZoneId:ut("")}}}),{base_url:mt}=window.appConfig,{defineComponent:ft,defineAsyncComponent:wt}=Vue,ht=wt(()=>B(()=>import(`${mt}/extension/module/components/close_btn.js`),[])),bt=ft({components:{Closebtn:ht},props:["order"],template:`
    <div class="z-40 fixed top-0 left-0 w-screen h-screen bg-black/70 flex justify-center items-center">
      <div class="w-11/12 mx-auto bg-white rounded-2xl p-4">
        <!-- Close Btn -->
        <Closebtn @click="$emit('close')"></Closebtn>
        <!-- Confirm -->
        <h1 class="text-lg font-medium text-center">Revert Order ?</h1>
        <p class="mt-3 text-black/70 text-center">
            Order 
            <span class="font-medium text-black">#{{ order.order_id }}</span> 
            will be revert to "Processed" status.
        </p>
        <div class="flex gap-2 mt-10">
          <!-- Cancel -->
          <button @click="$emit('close')" class="w-1/2 border-2 rounded-md bg-red-500 text-white py-1 mdc-ripple-surface">Cancel</button>
          <!-- Confirm -->
          <button @click="$emit('confirm')" class="w-1/2 border-2 rounded-md bg-green-600 text-white py-1 mdc-ripple-surface">Proceed</button>
        </div>
      </div>
    </div>
  `,setup(t){}}),{defineComponent:gt}=Vue,yt=gt({components:{},props:[],template:`
    <p class="text-gray-600 text-xl font-medium text-center">No Data</p>
  `,setup(){}}),{base_url:xt}=window.appConfig,{defineComponent:_t,defineAsyncComponent:kt}=Vue,Ct=kt(()=>B(()=>import(`${xt}/extension/module/components/close_btn.js`),[])),$t=_t({components:{Closebtn:Ct},props:["checkedOrders"],template:`
    <div class="z-40 absolute top-0 left-0 w-screen h-screen bg-black/70 flex justify-center items-center">
      <div class="w-11/12 mx-auto bg-white rounded-2xl p-4">
        <!-- Close Btn -->
        <Closebtn @click="$emit('close')"></Closebtn>
        <!-- Confirm -->
        <h1 class="text-lg font-medium text-center">Generate DO ?</h1>
        <p class="mt-3 text-black/70 text-center">These following orders will generate Delivery Order (DO) :</p>
        <div class="text-center mt-3 py-2 max-h-[20vh] overflow-y-scroll">
            <p v-for="(order, i) in checkedOrders">{{ i+1 }}. Order #{{ order.order_id }} - {{ order.delivery_zone }}</p>
        </div>
        <div class="flex gap-2 mt-10">
          <!-- Cancel -->
          <button @click="$emit('close')" class="w-1/2 border-2 rounded-md bg-red-500 text-white py-1 mdc-ripple-surface">Cancel</button>
          <!-- Confirm -->
          <button @click="$emit('confirm')" class="w-1/2 border-2 rounded-md bg-green-600 text-white py-1 mdc-ripple-surface">Proceed</button>
        </div>
      </div>
    </div>
  `,setup(t){}}),{defineComponent:Mt,onMounted:Ot}=Vue,zt=Mt({components:{Closebtn:R},props:["filterData","deliveryZones"],template:`
    <div class="z-50 fixed top-0 left-0 w-screen h-screen bg-black/70 flex justify-center items-center">
        <div class="w-11/12 mx-auto p-3 bg-slate-200 shadow-lg rounded-2xl">
            <div class="w-full mx-auto flex justify-between items-center">
                <div class="w-2/12"></div>
                <div class="w-10/12 text-center">
                    <p class="text-2xl font-medium">Filter</p>
                </div>
                <div class="w-2/12">
                    <!-- Close -->
                    <Closebtn @click="$emit('close')" fill="#2b3392"></Closebtn>
                </div>
            </div>
            <div class="w-full mx-auto mt-5">
                <!-- CLear -->
                <p @click="clear" class="underline text-primary w-fit ml-auto text-lg">Clear</p>
                
                <div class="mt-2 flex flex-col gap-2 max-h-[55vh] overflow-y-scroll">
                  <!-- Customer name -->
                  <div v-if="'customer' in filterData" class="w-full bg-white rounded-lg p-3 shadow-sm">
                      <label>Customer :</label>
                      <input type="text" v-model="filterData.customer"  name="customer" class="w-full mt-2 p-2 rounded-md border-[1px] border-primary">
                  </div>
                  <!-- Order ID -->
                  <div v-if="'order_id' in filterData" class="w-full bg-white rounded-lg p-3 shadow-sm">
                      <label>Order ID :</label>
                      <input type="text" v-model="filterData.order_id" name="order_id" class="w-full mt-2 p-2 rounded-md border-[1px] border-primary">
                  </div>
                  <!-- Order ID -->
                  <div v-if="'batch_id' in filterData" class="w-full bg-white rounded-lg p-3 shadow-sm">
                      <label>Batch :</label>
                      <input type="text" v-model="filterData.batch_id" name="batch_id" class="w-full mt-2 p-2 rounded-md border-[1px] border-primary">
                  </div>
                  <!-- With Do -->
                  <div v-if="'with_do' in filterData" class="w-full bg-white rounded-lg p-3 shadow-sm">
                      <label>Delivery Order (DO) :</label>
                      <div class="mt-2 flex gap-5">
                        <div class="flex gap-2 items-center">
                          <input type="radio" v-model="filterData.with_do" name="delivery_order" id="with_delivery_order" value="1" class="size-5">
                          <label for="with_delivery_order">Yes</label>
                        </div>
                        <div class="flex gap-1 items-center">
                          <input type="radio" v-model="filterData.with_do" name="delivery_order" id="without_delivery_order" value="0" class="size-5">
                          <label for="without_delivery_order">No</label>
                        </div>
                      </div>
                  </div>
                  <!-- DO id -->
                  <div v-if="'doc_no' in filterData" class="w-full bg-white rounded-lg p-3 shadow-sm">
                      <label>DO ID :</label>
                      <input type="text" v-model="filterData.doc_no" name="order_id" class="w-full mt-2 p-2 rounded-md border-[1px] border-primary">
                  </div>
                  <!-- Delivery Date -->
                  <div v-if="'delivery_date' in filterData" class="w-full bg-white rounded-lg p-3 shadow-sm">
                      <label>Delivery Date :</label>
                      <input type="text" v-model="filterData.delivery_date" name="delivery_date" class="w-full mt-2 p-2 rounded-md border-[1px] border-primary" autocomplete="off">
                  </div>
                  <!-- Delivery Zone -->
                  <div v-if="'delivery_zone_id' in filterData" class="w-full bg-white rounded-lg p-3 shadow-sm">
                    <label>Delivery Zone :</label>
                    <select v-model="filterData.delivery_zone_id" name="delivery_zone_id" class="w-full mt-2 p-2 rounded-md border-[1px] border-primary">
                      <option value=""></option>
                      <option v-for="zone in deliveryZones" :value="zone.delivery_zone_id">
                        {{ zone.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <!-- Apply -->
                <button @click="$emit('apply', filterData)" class="bg-primary mt-5  w-full py-2 rounded-md">Apply</button>
            </div>
        </div>
    </div>
  `,setup(t){const d={startDate:moment().add(5,"days"),autoUpdateInput:!1,autoApply:!0,singleDatePicker:!0},a=()=>{for(const c in t.filterData)t.filterData.hasOwnProperty(c)&&(t.filterData[c]="")};return Ot(()=>{const c=t.filterData.delivery_date;c!=""&&$('input[name="delivery_date"]').val(c),$('input[name="delivery_date"]').daterangepicker(d,l=>{const o=l.format("MM/DD/YYYY");t.filterData.delivery_date=o})}),{clear:a}}}),{defineComponent:jt,ref:Dt}=Vue,Bt=jt({props:["deliveryZone","driver","phone"],template:`
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
  `,setup(t){return{collapsed:Dt(!1)}}}),{ref:Xt,defineComponent:Vt}=Vue,Pt=Vt({props:[],template:`
    <button class="mdc-ripple-surface flex items-center gap-2 border-2 border-yellow-700 text-yellow-700 rounded-md py-2 px-4 font-medium text-sm">
      <span>Revert</span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
      </svg>
    </button>
  `,setup(){return{}}}),{defineComponent:St,onMounted:Tt,watch:At}=Vue,Zt=St({components:{Btn:Z},props:["customer","index","productUrl","orderUrl","submitUrl"],template:`
    <div class="w-full bg-white rounded-md">
      <!-- Name -->
      <div class="flex gap-2 px-2 py-1 items-center">
        <div class="w-[4%] flex justify-center">
          {{ index + 1 }}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="#2b3392" viewBox="0 0 24 24" stroke-width="1.8" stroke="#2b3392" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        <p class="text-primary font-semibold text-sm">{{ customer.shipping_firstname }} {{ customer.shipping_lastname }}</p>
      </div>

      <!-- Order -->
      <div v-for="order in customer.orders" class="text-sm">
        <!-- Heading -->
        <div class="flex gap-2 px-2 py-1 text-sm border-y-2 border-primary text-primary font-medium">
          <div class="w-[4%]"></div>
          <div class="w-4/12 flex items-center">Product</div>
          <div class="w-2/12 flex justify-center items-center">Qty</div>
          <div class="w-4/12 flex justify-center items-center">Kg</div>
          <!--
          <div class="w-1/12 flex justify-center items-center">
            <input type="checkbox" :checked="orderIsChecked(order)" @change="onOrderCheck($event.target.checked, order)" class="size-5">
          </div>
          -->
        </div>
  
        <!-- Order Id -->
        <div class="w-full flex justify-between items-center mt-2 mb-1 pl-5 pr-3">
          <p class="w-fit bg-primary rounded-full px-5">Order #{{ order.order_id }}</p>
          <div class="w-4/12 flex justify-end items-center text-primary font-medium gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
              <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a.75.75 0 0 0 .75-.75V15Z" />
              <path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM15.75 6.75a.75.75 0 0 0-.75.75v11.25c0 .087.015.17.042.248a3 3 0 0 1 5.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 0 0-3.732-10.104 1.837 1.837 0 0 0-1.47-.725H15.75Z" />
              <path d="M19.5 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
            </svg>
            <p>{{ order.delivery_date }}</p>
          </div>
        </div>

        <!-- Products -->
        <div v-for="(product, i) in order.products" class="p-2 flex gap-2 text-sm">
          <div class="w-[4%] flex justify-center">{{ i + 1 }}.</div>
          <!-- Product -->
          <div class="w-4/12">
            <p class="font-medium text-black/80 text-xs mb-1">{{ product.name }}</p>
            <p v-if="product.option" class="w-fit px-2 text-xs bg-amber-500 rounded-full text-white">{{ product.option_value }}</p>
            <p v-if="product.option2" class="w-fit px-2 text-xs bg-amber-500 rounded-full text-white">{{ product.option_value2 }}</p>
          </div>
          <!-- Qty -->
          <div class="w-3/12">
            <div class="w-10/12">
              <p class="text-center pl-3 whitespace-nowrap">
                {{ product.quantity }} <span class="text-red-500 text-xl">*</span>
              </p>
              <input 
                v-if="!product.out_of_stock"
                type="number"
                class="w-full text-center rounded-md border-[1px] border-black/30 py-1 disabled:bg-black/30"
                v-model="product.dc_qty"
                :disabled="product.checked"
                @focus="$event.target.select()"
              >   
              <input v-else type="text" class="w-full py-1 text-center rounded-md border-red-200 bg-red-300 text-red-800 font-medium" value="OOS" disabled>       
            </div>
          </div>
          <!-- KG -->  
          <div class="w-3/12">
            <div v-if="product.show_weight" class="w-10/12">
              <p class="text-center pl-3 whitespace-nowrap">
                {{ product.weight }}/{{ product.order_weight }} <span class="text-red-500 text-xl">*</span>
              </p>
              <div class="w-full flex flex-col gap-1">
                <input 
                  v-if="!product.out_of_stock"
                  v-for="(pw, i) in product.partial_weights"
                  type="number" 
                  v-model="product.partial_weights[i]"
                  class="w-full text-center rounded-md border-[1px] border-black/30 py-1 disabled:bg-black/30"
                  :disabled="product.checked"
                  @focus="$event.target.select()"
                >
                <input v-else type="text" class="w-full py-1 text-center rounded-md border-red-200 bg-red-300 text-red-800 font-medium" value="OOS" disabled>       
              </div>
            </div>
          </div>
          <!-- Checked -->
          <div class="w-1/12 flex items-center justify-center">
            <input type="checkbox" :checked="product.checked || product.out_of_stock" @change="onProductCheck($event.target.checked, product)" class="size-5">
          </div>
        </div>
        <!-- Driver -->
        <div class="p-2 flex gap-1 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
            <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
          </svg>
          <p class="font-medium">Driver: {{ order.drivers }}</p>
        </div>
      </div>
      
      <!-- Submit -->
      <div class="p-2 flex justify-end">
        <Btn type="success" @click="$emit('submit', customer)">Submit</Btn>
      </div>
    </div>
  `,setup(t){At(()=>t.customer.orders.flatMap(l=>l.products.map(o=>o.partial_weights)),(l,o)=>{l.forEach((u,n)=>{const p=t.customer.orders.flatMap(y=>y.products)[n];p.weight=u.reduce((y,j)=>y+parseFloat(j||0),0)})},{deep:!0});const d=async(l,o)=>{const u=o.products.map(n=>({order_product_id:n.order_product_id,partial_weights:n.partial_weights,dc_qty:l?n.dc_qty:0,weight:l?n.weight:0,checked:l?1:0}));o.products.forEach(n=>{n.dc_qty=l?n.dc_qty:n.warehouse_qty,n.checked=l});try{const n=await axios.post(t.orderUrl,{order_id:o.order_id,products:u});if(n.data.error)throw new Error(n.data.error)}catch(n){console.error(n)}finally{l||o.products.forEach(n=>{n.dc_qty=n.warehouse_qty})}},a=async(l,o)=>{const u={order_product_id:o.order_product_id,partial_weights:o.partial_weights,dc_qty:l?o.dc_qty:0,checked:l?1:0};l?o.dc_qty=o.dc_qty:(o.out_of_stock=0,o.dc_qty=o.warehouse_qty),o.checked=l;try{const n=await axios.post(t.productUrl,u)}catch(n){console.error("Error update product : ",n)}},c=l=>l.products.every(o=>o.checked);return Tt(()=>{t.customer.orders.forEach(l=>{l.products.forEach(o=>{o.checked||(o.dc_qty=o.warehouse_qty)})})}),{onOrderCheck:d,onProductCheck:a,orderIsChecked:c}}}),{defineComponent:qt,ref:F}=Vue,Lt=qt({components:{Closebtn:R},props:["action"],template:`
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
  `,setup(t){const d=F(""),a=F(""),c=F(!1);return{title:d,description:a,show:c,close:()=>{c.value=!1},confirm:()=>{c.value=!1,t.action()},open:(n,p)=>{d.value=n,a.value=p,c.value=!0}}}}),{createApp:Ft,ref:w,onMounted:Et,computed:E}=Vue;Ft({components:{Layout:Ee,Secondtab:He,Order:ee,Loading:J,Ordermodal:Ge,Updatemodal:rt,Confirmactionmodal:nt,Changedriver:vt,Confirmrevert:bt,Nodata:yt,Confirmgeneratedo:$t,Filtermodal:zt,Filterbtn:X,Driverinfo:Bt,Revertbtn:Pt,Btn:Z,Dcorder:Zt,Confirmmodal:Lt},setup(){const{sideMenus:t,totalOverdue:d,totalRevert:a,totalPickup:c,totalNew:l,getRoute:o}=Ce(),u=w(1),n=w(10),p=w(!1),y=w("New"),j=w("MO Area"),m=w({}),_=w("processed"),r=w(!1),v=w([]),h=w([]),b=w([]),x=w(null),k=w(!1),M=w(null),oe=w(!1),P=w(()=>{}),S=w([]),se=E(()=>[{label:"New",event:()=>T("New"),total:l.value},{label:"Pickup",event:()=>T("Pickup")}]),H=(e={})=>{const s=new URL(window.location.href);for(const[i,f]of Object.entries(e))s.searchParams.set(i,f);window.history.pushState({},"",s)},Q=()=>{const e=new URLSearchParams(window.location.search).get("delivery_zone_id");if(e){const s=S.value.find(i=>i.delivery_zone_id==e);s&&W(s)}},T=async e=>{if(y.value=e,b.value=[],e=="New"){Object.keys(g.value).forEach(i=>{i!=="delivery_zone_id"&&(g.value[i]="")});const s=new URLSearchParams(window.location.search);s.has("delivery_zone_id")&&(g.value.delivery_zone_id=s.get("delivery_zone_id")),m.value={},await C("processed"),Q()}else e=="Ready To Ship"?(g.value.delivery_zone_id="",C("ready_to_ship")):e=="Pickup"&&(g.value.delivery_zone_id="",C("pickup"))},W=(e,s=!1)=>{m.value.delivery_zone_id==e.delivery_zone_id?m.value={}:(m.value=e,g.value.delivery_zone_id=e.delivery_zone_id,s&&H({delivery_zone_id:e.delivery_zone_id}),C("processed",!0))},U=e=>{r.value=e},ie=(e,s)=>{if(e){if(b.value.includes(s))return;b.value.push(s)}else b.value=b.value.filter(i=>i.order_id!=s.order_id)},C=async(e,s=!1)=>{p.value=!0;let i=_.value!=e;_.value=e,(i||s)&&(h.value=[],u.value=1);const f=new Date,D=o("orders",{status:e,...g.value,delivery_date:`${String(f.getMonth()+1).padStart(2,"0")}/${String(f.getDate()).padStart(2,"0")}/${f.getFullYear()}`,page:u.value,limit:n.value});try{const{data:z}=await axios.get(D);S.value=z.delivery_zones,_.value=="processed"?v.value=z.orders:h.value=h.value.concat(z.orders),l.value=z.total.processed,c.value=z.total.pickup,a.value=z.total.revert,d.value=z.total.overdue,m.value.delivery_zone_id&&H({delivery_zone_id:m.value.delivery_zone_id})}catch(z){console.log(z)}finally{p.value=!1}},le=e=>S.value.find(i=>i.delivery_zone_id==e).total,ne=(e=null)=>{x.value=e,k.value=e!=null},O=(e,s="success")=>{let i="#16a34a";s=="error"&&(i="#de2837"),Toastify({text:e,duration:3e3,close:!0,gravity:"top",position:"right",stopOnFocus:!0,style:{background:i}}).showToast()},ae=e=>{M.value&&(M.value.open("Revert Order ?",`Order <b>#${e.order_id}</b> will be revert back to original status.`),P.value=()=>I(e))},I=async e=>{p.value=!0;const s=o("revert"),i=await axios.post(s,{order_id:e.order_id});i.data.success?O(i.data.success):O(i.data.error,"error"),await T("New")},de=async()=>{p.value=!0;const e=b.value.map(f=>f.order_id),s=o("sale/order/delivery_order",{},!0),i=o("markPickup");try{const f=await axios.post(s,{selected:e}),D=await axios.post(i,{selected:e});b.value=[],O("Delivery Order generated !"),T("Pickup")}catch(f){O(f,"error")}finally{p.value=!1}},g=w({customer:"",order_id:"",delivery_date:"",doc_no:""}),ce=e=>{U(!1),C(_.value,!0)},q=(e=[])=>{for(const s in g.value)g.value.hasOwnProperty(s)&&!e.includes(s)&&(g.value[s]="");C(_.value,!0)},ue=E(()=>{var e=!1;for(const s in g.value)s=="delivery_zone_id"&&g.value[s]!=""&&(e=!0),s!="delivery_zone_id"&&g.value[s]!=""&&(e=!1);return e}),pe=E(()=>Object.keys(g.value).some(e=>g.value[e]!="")),ve=()=>{u.value+=1,C(_.value)},me=e=>{if(M.value){const s=e.shipping_firstname+e.shipping_lastname;M.value.open("Submit Orders",`You're submitting all orders for this <b>${s}</b>. Continue?`),P.value=()=>fe(e)}},fe=async e=>{const s={orders:e.orders.map(i=>({order_id:i.order_id,products:i.products.map(f=>({order_product_id:f.order_product_id,partial_weights:f.partial_weights,dc_qty:f.dc_qty,weight:f.weight,checked:1}))}))};try{p.value=!0;const i=await axios.post(o("completeOrders"),s);i.data.success?(O(i.data.success),q(["delivery_zone_id"]),C("processed")):i.data.error&&O(i.data.error,"error")}catch(i){console.error(i)}},we=()=>{M.value&&(M.value.open(`${m.value.name} Orders`,`You're submitting all orders for this <b>${m.value.name}</b>. Continue?`),P.value=()=>N())},N=async()=>{p.value=!0;const e=o("completeOrders"),s={orders:[]};v.value.forEach(i=>{i.orders.forEach(f=>{f.products.forEach(D=>{s.orders.push({order_id:f.order_id,order_product_id:D.order_product_id,dc_qty:D.dc_qty,weight:D.weight,checked:1})})})});try{const i=await axios.post(e,s);i.data.success?(O(i.data.success),q(["delivery_zone_id"]),C("processed")):i.data.error&&O(i.data.error,"error")}catch(i){O(i.message,"error")}};return Et(async()=>{await C("processed"),Q()}),{sideMenus:t,loading:p,orders:h,checkedOrders:b,tabs:se,activeTab:y,secondActiveTab:j,selectedOrder:x,showOrder:k,toggleOrder:ne,deliveryZones:S,revert:I,showRevert:ae,toggleDeliveryZone:W,generateDO:de,showFilter:r,toggleFilter:U,handleFilter:ce,filterData:g,handleOnCheck:ie,clearFilter:q,hasFilter:pe,getRoute:o,loadMore:ve,totalRevert:a,selectedZone:m,hideClearFilter:ue,getZoneTotalOrder:le,customerOrders:v,showSubmit:me,showSubmitAll:we,submitAll:N,showConfirm:oe,confirmAction:P,confirmModal:M,totalPickup:c,totalNew:l}}}).mount("#app");
