<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useTelemetryStore } from '@/stores/telemetry/telemetry-store'
import { storeToRefs } from 'pinia'
import BaseIndicator from '@/components/indicator/BaseIndicator.vue'
import BaseButton from '@/components/input/BaseButton.vue'
import router from '@/router'
import { useLoadingStore } from '@/stores/loading-store'
import { useDeviceConfigStore } from '@/stores/master-data/config-store'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))

///telemetry
const telemetryStore = useTelemetryStore()
const { devicesData } = storeToRefs(useTelemetryStore())
const loadingStore = useLoadingStore()

//stores
const deviceConfigStore = useDeviceConfigStore()
const { postDeviceConfigIsLoading, postDeviceConfigStatus } = storeToRefs(useDeviceConfigStore())

//alert control
const modalActive = ref(false)
const closeNotification = () => {
  modalActive.value = false
}
const postControlEnginePayload = ref({
  code: null,
  command: 'CMD',
  payload: {}
})

async function controlEngine(code, state) {
  postControlEnginePayload.value.code = code
  postControlEnginePayload.value.payload = { OUT1: state }
  await deviceConfigStore.postDeviceConfig(postControlEnginePayload.value)
  modalActive.value = true
  await delay(1000)
  closeNotification()
}

async function initTelemetryData() {
  telemetryStore.stopListening()
  telemetryStore.startListening()
}

onMounted(async () => {
  loadingStore.startLoading()
  await initTelemetryData()
  loadingStore.stopLoading()
})

onUnmounted(() => {
  telemetryStore.stopListening()
})

function goToDeviceConfigPage(id) {
  router.push({ name: 'deviceConfig', params: { id: id } })
}
function goToDeviceSettingPage(id) {
  router.push({ name: 'deviceSetting', params: { id: id } })
}
function goToReportPage(id) {
  router.push({ name: 'report', params: { id: id } })
}

</script>

<template>
  <alert :message="postDeviceConfigStatus.message" :modalActive="modalActive" :isError="postDeviceConfigStatus.isError"
    @close="closeNotification" />
  <div class="flex">
    <SideNav :isDashboardActive="true" />
    <div class="flex flex-col w-screen">
      <TopBar>
        <p class="text-label-primary font-medium">Realtime Dashboard</p>
      </TopBar>
      <div class="p-[20px] flex flex-col gap-[20px]">
        <div class="grid grid-cols-1 gap-3">
          <div
            class="border border-bkg-tertiary border-opacity-60 rounded-[16px] px-6 py-6 shadow-md flex flex-col gap-3"
            v-for="data in devicesData">
            <div class="flex justify-between items-center border-b pb-3">
              <div class="flex flex-col gap-2">
                <div class="flex justify-between items-center">
                  <div class="flex gap-5 items-center">
                    <BaseIndicator :status="data.telemetry.status" />
                    <h1 class="font-medium text-xl text-label-primary">
                      Marina Barrage
                    </h1>
                  </div>
                  <!-- <div>
                        <img src="../../assets/alarm-icon.svg" alt="" height="24px" width="24px">
                      </div> -->
                </div>
                <div class="flex flex-col gap-1">
                  <div class="flex flex-col gap-[6px]">
                    <div class="flex gap-1 items-center">
                      <div class="flex text-[10px] sm:text-xs md:text-xs lg:text-sm gap-1">
                        <p class="font-medium text-label-primary opacity-80">SN:</p>
                        <h2 class="font-semibold text-label-primary opacity-90">{{ data.code }}</h2>
                      </div>
                      <div class="dropdown">
                        <img src="../../assets/info-icon.svg" alt="" height="14px" width="14px" class="info-icon">
                        <div class="dropdown-content w-full text-xs">
                          <div class="flex justify-between">
                            <p>Hardware Version</p>
                            <p class="text-accent-1">
                              {{ data.telemetry.hw }}
                            </p>
                          </div>
                          <div class="flex justify-between">
                            <p>Firmware Version</p>
                            <p class="text-accent-1">
                              {{ data.telemetry.fw }}
                            </p>
                          </div>
                          <div class="flex justify-between">
                            <p>GSM Model</p>
                            <p class="text-accent-1">
                              {{ data.telemetry.gsmModel }}
                            </p>
                          </div>
                          <div class="flex justify-between">
                            <p>GSM MCC</p>
                            <p class="text-accent-1">
                              {{ data.telemetry.gsmMcc }}
                            </p>
                          </div>
                          <div class="flex justify-between">
                            <p>GSM MNC</p>
                            <p class="text-accent-1">
                              {{ data.telemetry.gsmMnc }}
                            </p>
                          </div>
                          <div class="flex justify-between">
                            <p>GSM RSSI</p>
                            <p class="text-accent-1">
                              {{ data.telemetry.gsmRssi }}
                            </p>
                          </div>

                        </div>
                      </div>
                    </div>
                    <div
                      class="flex flex-col lg:flex-row text-[10px] sm:text-xs md:text-xs lg:text-sm gap-1  lg:items-center">
                      <p class="text-label-primary font-medium opacity-80 ">{{ $t('lastHeard') }}:</p>
                      <p class="text-label-primary font-semibold opacity-90">{{ data.telemetry.lastHeard }}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div class="grid grid-cols-2 gap-8 my-6">
              <div class="flex flex-col gap-3">
                <p class="text-sm lg:text-base font-bold text-label-primary">Water Quality</p>
                <div class="grid grid-cols-2 gap-8">
                  <div class="flex flex-col gap-1 items-left border p-4 rounded-lg bg-bkg-tertiary">
                    <div class="flex gap-[16px] justify-between items-center">
                      <p class="font-medium text-label-primary">Water Debit</p>
                      <img src="../../assets/water-debit.svg" alt="" class="w-[24px] h-[24px] lg:w-[32px] lg:h-[32px]">
                    </div>
                    <p class="text-xl  px-2 py-1  text-label-primary font-semibold">
                      100 <span class="text-sm font-normal">m³/hour</span>
                    </p>
                  </div>
                  <div class="flex flex-col gap-1 items-left border p-4 rounded-lg bg-bkg-tertiary">
                    <div class="flex gap-[16px] justify-between items-center">
                      <p class="font-medium text-label-primary">Water Level</p>
                      <img src="../../assets/water-level.svg" alt="" class="w-[24px] h-[24px] lg:w-[32px] lg:h-[32px]">
                    </div>
                    <p class="text-xl  px-2 py-1  text-label-primary font-semibold">
                      6 <span class="text-sm font-normal">m</span>
                    </p>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-8">
                  <div class="flex flex-col gap-1 items-left border p-4 rounded-lg bg-bkg-tertiary">
                    <div class="flex gap-[16px] justify-between items-center">
                      <p class="font-medium text-label-primary">Water Volume</p>
                      <img src="../../assets/water-volume.svg" alt="" class="w-[24px] h-[24px] lg:w-[32px] lg:h-[32px]">
                    </div>
                    <p class="text-xl  px-2 py-1  text-label-primary font-semibold">
                      100 <span class="text-sm font-normal">m³</span>
                    </p>
                  </div>
                  <div class="flex flex-col gap-1 items-left border p-4 rounded-lg bg-bkg-tertiary">
                    <div class="flex gap-[16px] justify-between items-center">
                      <p class="font-medium text-label-primary">Water pH</p>
                      <img src="../../assets/water-ph.svg" alt="" class="w-[24px] h-[24px] lg:w-[32px] lg:h-[32px]">
                    </div>
                    <p class="text-xl  px-2 py-1  text-label-primary font-semibold">
                      6 <span class="text-sm font-normal">pH</span>
                    </p>
                  </div>
                </div>

                <div class="flex flex-col gap-1 items-left border p-4 rounded-lg bg-bkg-tertiary">
                  <div class="flex gap-[16px] justify-between items-center">
                    <p class="font-medium text-label-primary">Total Suspended Solid</p>
                    <img src="../../assets/water-tss.svg" alt="" class="w-[24px] h-[24px] lg:w-[32px] lg:h-[32px]">
                  </div>
                  <p class="text-xl  px-2 py-1  text-label-primary font-semibold">
                    0.052 <span class="text-sm font-normal">mg/L</span>
                  </p>
                </div>

              </div>


              <div class="flex flex-col gap-3">
                <p class="text-sm lg:text-base font-bold text-label-primary">Power Status</p>
                <div class="grid grid-cols-2 gap-8">
                  <div class="flex flex-col gap-1 items-left border p-4 rounded-lg bg-bkg-tertiary">
                    <div class="flex gap-[16px] justify-between items-center">
                      <p class="font-medium text-label-primary">Battery Percentage</p>
                      <img src="../../assets/batt-percent.svg" alt="" class="w-[24px] h-[24px] lg:w-[32px] lg:h-[32px]">
                    </div>
                    <p class="text-xl  px-2 py-1  text-label-primary font-semibold">
                      100 <span class="text-sm font-normal">%</span>
                    </p>
                  </div>
                  <div class="flex flex-col gap-1 items-left border p-4 rounded-lg bg-bkg-tertiary">
                    <div class="flex gap-[16px] justify-between items-center">
                      <p class="font-medium text-label-primary">Battery Temperature</p>
                      <img src="../../assets/batt-temp.svg" alt="" class="w-[24px] h-[24px] lg:w-[32px] lg:h-[32px]">
                    </div>
                    <p class="text-xl  px-2 py-1  text-label-primary font-semibold">
                      6 <span class="text-sm font-normal">C</span>
                    </p>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-8">
                  <div class="flex flex-col gap-1 items-left border p-4 rounded-lg bg-bkg-tertiary">
                    <div class="flex gap-[16px] justify-between items-center">
                      <p class="font-medium text-label-primary">Consumed Energy</p>
                      <img src="../../assets/energy.svg" alt="" class="w-[24px] h-[24px] lg:w-[32px] lg:h-[32px]">
                    </div>
                    <p class="text-xl  px-2 py-1  text-label-primary font-semibold">
                      100 <span class="text-sm font-normal">KWH</span>
                    </p>
                  </div>
                  <div class="flex flex-col gap-1 items-left border p-4 rounded-lg bg-bkg-tertiary">
                    <div class="flex gap-[16px] justify-between items-center">
                      <p class="font-medium text-label-primary">Generated Energy</p>
                      <img src="../../assets/energy.svg" alt="" class="w-[24px] h-[24px] lg:w-[32px] lg:h-[32px]">
                    </div>
                    <p class="text-xl  px-2 py-1  text-label-primary font-semibold">
                      6 <span class="text-sm font-normal">KWH</span>
                    </p>
                  </div>
                </div>

                <div class="flex flex-col gap-1 items-left border p-4 rounded-lg bg-bkg-tertiary">
                  <div class="flex gap-[16px] justify-between items-center">
                    <p class="font-medium text-label-primary">Charging Status</p>
                    <img src="../../assets/charging.svg" alt="" class="w-[24px] h-[24px] lg:w-[32px] lg:h-[32px]">
                  </div>
                  <p class="text-xl  px-2 py-1  text-label-primary font-semibold">
                    Not Charging!
                  </p>
                </div>
              </div>

            </div>
            <div @click="goToReportPage(data.code)"
              class="lg:text-sm text-xs flex justify-between w-full py-3 px-3 border-y-2 hover:bg-accent-1 hover:text-white transition-all delay-100 duration-500 cursor-pointer">
              <p>{{ $t('report') }}</p>
              <p>></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
p {
  @apply select-none
}

.custom-select-option {
  @apply outline-none text-[10px] md:text-[12px] text-label-secondary pb-[6px] px-2 rounded-lg cursor-pointer md:min-w-[200px]
}

.custom-select-option option {
  @apply p-2 cursor-pointer bg-bkg-secondary
}


.custom-select {
  @apply relative inline-block w-full bg-bkg-secondary hover:bg-bkg-tertiary border border-label-tertiary rounded-2xl pt-[6px] px-4 flex-1
}

.custom-select select {
  font-size: 16px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="%23999" d="M10 12l-5-5h10l-5 5z"/></svg>') no-repeat right 1px center;
  @apply w-full cursor-pointer focus:outline-none text-label-primary
}

.custom-select-2 {
  @apply w-full
}

.custom-select-2 select {
  font-size: 16px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="%23999" d="M10 12l-5-5h10l-5 5z"/></svg>') no-repeat right 10px center;
  @apply w-full cursor-pointer focus:outline-none text-label-primary bg-bkg-secondary border border-label-tertiary rounded-md py-[6px] px-4 font-medium
}

/* option {
  @apply bg-bkg-primary
} */

.info-wrapper {
  position: relative;
  display: inline-block;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  @apply opacity-0 absolute left-0 bg-bkg-secondary rounded-lg z-10 border min-w-[180px] shadow-lg transition-opacity ease-in-out delay-100 duration-300 p-4 flex flex-col gap-1
}

.info-icon:hover+.dropdown-content {
  @apply opacity-100
}

.info-icon {
  @apply cursor-pointer
}


::-webkit-scrollbar {
  width: 0.2em;
}

/* ::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
} */

::-webkit-scrollbar-thumb {
  background-color: #C8C8C8;
  border-radius: 10px;
}
</style>
