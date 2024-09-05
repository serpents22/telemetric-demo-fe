<script setup>
import SearchBar from '@/components/input/SearchBar.vue'
import { onMounted, ref } from 'vue'
import CreateDeviceModal from '@/components/modal/devices/CreateDeviceModal.vue'
import EditDeviceModal from '@/components/modal/devices/EditDeviceModal.vue'
import ShareDeviceModal from '@/components/modal/devices/ShareDeviceModal.vue'
import { useDevicesStore } from '@/stores/master-data/devices-store'
import { storeToRefs } from 'pinia';
import { useLoadingStore } from '@/stores/loading-store'
import VueSlider from "vue-3-slider-component"
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))
const dummy = ref([30, 100])
const max = ref(120)
const min = ref(20)

function syncValues() {
  console.log(dummy.value)
}

onMounted(async () => {
  await devicesStore.getDevices()
})

//stores
const loadingStore = useLoadingStore()
const devicesStore = useDevicesStore()
const { devices, getDevicesLoading } = storeToRefs(useDevicesStore())

const modalActive = ref(false)
const searchValue = ref()
const itemsSelected = ref([])

const closeNotification = () => {
  modalActive.value = false
}



const header = [
  { text: t('createdTime'), value: "formattedCreatedAt", sortable: true },
  { text: t('updatedTime'), value: "formattedUpdatedAt", sortable: true },
  { text: t('deviceName'), value: "name", sortable: true },
  { text: t('serialNumber'), value: "code", sortable: true },
  { text: t('latitude'), value: "latitude", sortable: true },
  { text: t('longitude'), value: "longitude", sortable: true },
  { text: "", value: "operation", width: 150 },
]

//create gateway
const isModalPops = ref(false)
function newModalToggle() {
  isModalPops.value = !isModalPops.value
}


//delete gateway
const isDelModalPops = ref(false)
let selectedItem = ref({ id: null, code: null })

function delModalToggle(item) {
  selectedItem.value.code = item.code
  selectedItem.value.id = item.id
  isDelModalPops.value = !isDelModalPops.value
}

async function deleteItem() {
  loadingStore.startLoading()
  await devicesStore.deleteDevice(selectedItem.value.id)
  loadingStore.stopLoading()
  modalActive.value = true
  await delay(1000)
  closeNotification()
  devicesStore.getDevices()
}

//edit device
const isEditModalPops = ref(false)
const formData = ref({})

function editModalToggle(item) {
  isEditModalPops.value = !isEditModalPops.value
  formData.value = item
}

//share device
const isShareModalPops = ref(false)
function shareModalToggle(item) {
  isShareModalPops.value = !isShareModalPops.value
  formData.value = item
}


</script>

<template>
  <div class="flex">
    <SideNav :isDevicesManagementActive="true" />
    <div class="flex flex-col w-screen">
      <TopBar>
        <p class="text-label-primary">{{$t('deviceRegistration')}}</p>
      </TopBar>
      <div
        class=" m-[20px] flex-1 py-8 bg-bkg-primary rounded-[10px] shadow border border-bkg-secondary flex-col gap-5 flex">
        <CreateDeviceModal :isOpen="isModalPops" @close="newModalToggle" :title="t('createNewDevice')" />
        <EditDeviceModal :isOpen="isEditModalPops" @close="isEditModalPops = !isEditModalPops" :title="t('editDevice')"
          :formData="formData" />
        <ShareDeviceModal :isOpen="isShareModalPops" @close="isShareModalPops = !isShareModalPops" :title="t('shareDevice')"
          :formData="formData" />

        <DeleteConfirmationModal :isOpen="isDelModalPops" @close="isDelModalPops = false" :item="selectedItem.code"
          @delete="deleteItem" />
        <!-- <alert 
    :message ="status.message"
    :modalActive="modalActive"
    :isError="status.isError"
     @close="closeNotification"
  /> -->
        <div class="mx-8 grid grid-row gap-6 md:gap-10">
          <div class="flex flex-col md:flex-row gap-4 md:justify-between">
            <SearchBar v-model="searchValue" />
            <div class="grid grid-cols-2 md:flex gap-4 justify-end">
              <div class="flex grow md:grow-0">
                <BasicButton type="submit" class="primary" :label="t('newDevice')" @click="newModalToggle()" />
              </div>
            </div>
          </div>
        </div>
        <EasyDataTable :rows-per-page="25" table-class-name="customize-table" :headers="header" :items="devices"
          theme-color="#1363df" :search-value="searchValue" :loading="getDevicesLoading">
          <template #item-operation="item">
            <div class="operation">
              <img src="../../assets/share-icon.svg" alt="" height="24px" width="24px" class="cursor-pointer" @click="shareModalToggle(item)">
              <img src="../../assets/edit-icon.svg" alt="" height="24px" width="24px" class="cursor-pointer" @click="editModalToggle(item)">
              <img src="../../assets/delete-icon.svg" alt="" height="24px" width="24px" class="cursor-pointer" @click="delModalToggle(item)">
            </div>
          </template>
        </EasyDataTable>
        <!-- <VueSlider @dragging="syncValues" @click="syncValues" v-model="dummy" :min="min" :max="max"
          :enableCross="false" />
        {{ dummy }} -->
      </div>
    </div>
  </div>
</template>

<style scoped>
p {
  @apply select-none
}
</style>
