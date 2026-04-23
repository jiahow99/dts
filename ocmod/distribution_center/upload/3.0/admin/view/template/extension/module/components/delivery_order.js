const { defineComponent, defineAsyncComponent, ref, computed, onMounted } = Vue;
const { base_url } = window.appConfig;
const RemoveBtn = defineAsyncComponent(() => import(`${base_url}/extension/module/components/remove_btn.js`));
const Btn = defineAsyncComponent(() => import(`${base_url}/extension/module/components/btn.js`));

export default defineComponent({
  components: {
    RemoveBtn,
    Btn,
  },
  props: [
    'order',
    'disableUpload',
    'showPod',
    'disableShowPod',
    'truncateAddress',
    'toast',
    'getRoute',
  ],

  template: `
    <div class="w-full rounded-md text-black bg-white">
      <div class="p-2 flex justify-between items-center border-b-[1px] border-black/30">
        <div class="w-8/12">
          <!-- Order id -->
          <label for="order-63" class="text-base text-primary font-semibold break-words">
              Order #{{ order.order_id }}
          </label>
          <!-- DO -->
          <p class="text-sm font-medium text-primary break-words">
            DO # {{ order.doc_no }}
          </p>
        </div>
        <!-- Delivery -->
        <div class="w-4/12 text-right">
            <div class="flex justify-end items-center gap-2 text-primary font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"></path>
                </svg>
                <p>{{ order.delivery_date }}</p>
            </div>
        </div>
      </div>

      <div class="p-2 flex flex-col gap-3">
        <!-- Store -->
        <div class="flex items-start gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="#2b3392" viewBox="0 0 24 24" stroke-width="1.8" stroke="#2b3392" class="size-5"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path></svg>
          <p class="break-words ...">
            {{ order.shipping_firstname }} {{ order.shipping_lastname }}
          </p>
        </div>
        <!-- Delivery Address -->
        <div>
          <p>Delivery Address :</p>
          <div class="flex justify-betwee gap-2 border-[1px] border-primary rounded-md p-2 mt-1">
            <p class="w-11/12 font-medium">{{ address }}</p>
            <!-- Copy -->
            <div @click="copyAddress(order.order_id)"class="w-1/12">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor" class="text-primary size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
              </svg>
            </div>
            <input :id="'address-' + order.order_id" type="text" class="absolute opacity-0" :value="address">
          </div>
        </div>
        <!-- POD -->
        <input ref="uploadRef" @change="addPod" type="file" accept="image/*" multiple  class="hidden">
        <div>
          <p>Proof of Delivery (POD) :</p>
          <!-- Show -->
          <p 
            v-if="!disableShowPod" 
            class="w-full text-primary underline"
            @click="showPod = !showPod" 
          >
            {{ showPod ? 'Hide' : 'Show' }}
          </p>
          <div v-if="showPod || !disableUpload" class="mt-3 grid grid-cols-4 gap-3">
            <!-- Image -->
            <div v-for="(preview, i) in previews"  class="relative">
              <img 
                class="aspect-square object-cover" 
                loading="lazy"
                :src="preview.url" 
                @click="$emit('lightbox', preview.url)" 
              >
              <div v-if="preview.loading" class="w-full h-full absolute top-0 left-0 bg-black/60 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 animate-spin text-white">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <!-- Remove -->
              <RemoveBtn v-if="!disableUpload && !preview.loading" @click.stop="removePod(preview)" class="absolute -top-3 -right-2"></RemoveBtn>
            </div>
            <!-- Upload -->
            <div v-if="!disableUpload" @click.stop="uploadPhoto" class="aspect-square border-2 border-primary text-primary rounded-md flex items-center justify-center text-4xl">+</div> 
          </div>
        </div>
  
        <!-- Buttons -->
        <div v-if="!disableUpload && order.can_submit" class="flex justify-end mt-2 text-sm">
          <Btn @click.stop="$emit('submit')">
            Submit
          </Btn>
        </div>

        <!-- Delivered On -->
        <div v-if="order.delivered_on" class="mt-2 flex justify-end gap-1">
          <p class="text-blacck/60">Delivered On :</p>
          <p class="text-primary font-semibold">{{ order.delivered_on }}</p>
        </div>
      </div>

    </div>
  `,
  setup(props, { emit }) {
    const uploadRef = ref(null);
    const previews = ref([]);
    
    const maxSize = ref(3);

    const showAddress = ref(false);
    const showPod = ref(false);

    // Toggle file input
    const uploadPhoto = () => {
      uploadRef.value.click();
    }

    // Add pod to order
    const addPod = (event) => {
      const order_id = props.order.order_id;
      const images = event.target.files;
      
      if (props.order.pods == undefined) {
        props.order.pods = [];
      }
      props.order.pods = [...props.order.pods, ...images];

      Array.from(images).forEach(async (file) => {
        // Form data
        const formData = new FormData();

        // Change the file name before upload
        const timestamp = new Date().toLocaleString('en-GB').replace(/[/, ]/g, '_').replace(/:/g, '');
        const newFilename = `order_${order_id}_${timestamp}_${file.name}`;
        const renamedFile = new File([file], newFilename, { type: file.type });
        formData.append('file[]', renamedFile);
        
        const url = URL.createObjectURL(file);
        const path = `catalog/pod/order_${order_id}/${newFilename}`;

        previews.value.push({
          order_pod_id: null,
          path,
          file,
          url,
          loading: true,
        });

        try {
          // Create folder and image
          const folder_url = props.getRoute('common/filemanager/folder', {directory: 'pod'}, true);
          const upload_url = props.getRoute('common/filemanager/upload', {directory: `pod/order_${order_id}`}, true);
          const folder_req = await axios.post(folder_url, { folder: `order_${order_id}` });
          const upload_req = await axios.post(upload_url, formData);
          
          if (upload_req.data.error) {
            throw upload_req.data.error;
          }

          // Save pod to the order
          const path = `catalog/pod/order_${order_id}/${newFilename}`;
          const { data } = await axios.post(props.getRoute('createPod'), {order_id, path});
          
          // Turn off loading
          const index = previews.value.findIndex(x => x.file === file);
          previews.value[index].loading = false;
          previews.value[index].order_pod_id = data.order_pod_id;

        } catch (error) {
          props.toast(error, 'error');
          // Remove it
          const index = previews.value.findIndex(x => x.file === file);
          previews.value.splice(index, 1);

        }
      });
    }

    // Full address
    const address = computed(() => {
      const data = [
        props.order.shipping_company,
        props.order.shipping_address_1,
        props.order.shipping_address_1,
        props.order.shipping_address_2,
        props.order.shipping_address_3,
        props.order.shipping_address_4,
        props.order.shipping_city,
        props.order.shipping_postcode,
        props.order.shipping_country,
      ];      
      return data.filter(x => x != null).join(' ');
    })

    // Copy address
    const copyAddress = (order_id) => {
      const address = document.getElementById(`address-${order_id}`);
      address.select();
      document.execCommand('copy');
      address.blur();

      props.toast('Address coped !');
    }

    // Remove image
    const removePod = async (preview) => {
      preview.loading = true;
      try {
        // Delete photo from system
        const remove_url = props.getRoute('common/filemanager/delete', {}, true);
        const remove_photo = await axios.post(remove_url, {path: preview.path});
        if (remove_photo.data.error) {
          throw remove_photo.data.error;
        }

        // Update order
        const update_order = await axios.post(props.getRoute('deletePod'), {order_pod_id: preview.order_pod_id});
        if (update_order.data.error) {
          throw update_order.data.error;
        }
        
        const index = previews.value.findIndex(x => x.order_pod_id === preview.order_pod_id);
        previews.value.splice(index, 1);
        
      } catch (error) {
        props.toast(error, 'error');
      }
    }

    // Mounted
    onMounted(() => {
      if (props.order.pods) {
        previews.value = props.order.pods.map(img => ({
          order_pod_id: img.order_pod_id,
          path: img.image,
          url: img.url,
          loading: false,
        }));
      }
    })
    
    return {
      uploadRef,
      uploadPhoto,
      addPod,
      previews,
      address,
      showAddress,
      showPod,
      copyAddress,
      removePod,
    }
  }
});
