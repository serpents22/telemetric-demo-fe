<script setup>
import { useDevicesStore } from '@/stores/master-data/devices-store'
import { onMounted, ref } from 'vue'
import BaseButton from '@/components/input/BaseButton.vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import VueSlider from "vue-3-slider-component"
import { useDeviceSettingStore } from '@/stores/master-data/setting-store'
import router from '@/router'
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))
const { t } = useI18n()

const deviceSettingStore = useDeviceSettingStore()
const { deviceSettings, postDeviceSettingIsLoading, postDeviceSettingStatus } = storeToRefs(useDeviceSettingStore())
const deviceSettingParams = ref({
  code: null,
  command: 'CHRONO',
  fields: 'start1,stop1,mask1,start2,stop2,mask2,start3,stop3,mask3,start4,stop4,mask4'
})
const props = defineProps(['id'])

onMounted(async () => {
  deviceSettingParams.value.code = props.id
  getDeviceSettingData()
})

async function getDeviceSettingData() {
  await deviceSettingStore.getDeviceSetting(deviceSettingParams.value)
  updateSliderValue()
  updateWeekMaskValue()
}

//alert control
const modalActive = ref(false)
const closeNotification = () => {
  modalActive.value = false
}

const settingData = ref({
  START1: '0000',
  STOP1: '2400',
  MASK1: '0000000',
  START2: '0000',
  STOP2: '2400',
  MASK2: '0000000',
  START3: '0000',
  STOP3: '2400',
  MASK3: '0000000',
  START4: '0000',
  STOP4: '2400',
  MASK4: '0000000',
})


// Function to convert numeric value to HH:MM format
const formatTimePost = (value) => {
  const hours = Math.floor(value)
  const minutes = Math.round((value - hours) * 60)
  return `${String(hours).padStart(2, '0')}${String(minutes).padStart(2, '0')}`
}

const formatTimeView = (value) => {
  const hours = Math.floor(value)
  const minutes = Math.round((value - hours) * 60)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

const convertTimeStringToSliderValue = (timeStr) => {
  const hours = parseInt(timeStr.slice(0, 2), 10)
  const minutes = parseInt(timeStr.slice(2), 10)
  return hours + minutes / 60
}

//sliders
const min = 0
const max = 24
const firstStep = ref([])
const secondStep = ref([])
const thirdStep = ref([])
const fourthStep = ref([])

//init
function updateSliderValue() {
  firstStep.value = [convertTimeStringToSliderValue(deviceSettings.value.start1), convertTimeStringToSliderValue(deviceSettings.value.stop1)]
  secondStep.value = [convertTimeStringToSliderValue(deviceSettings.value.start2), convertTimeStringToSliderValue(deviceSettings.value.stop2)]
  thirdStep.value = [convertTimeStringToSliderValue(deviceSettings.value.start3), convertTimeStringToSliderValue(deviceSettings.value.stop3)]
  fourthStep.value = [convertTimeStringToSliderValue(deviceSettings.value.start4), convertTimeStringToSliderValue(deviceSettings.value.stop4)]
}

//post
async function sliderValuePost() {
  settingData.value.START1 = formatTimePost(firstStep.value[0])
  settingData.value.STOP1 = formatTimePost(firstStep.value[1])
  settingData.value.START2 = formatTimePost(secondStep.value[0])
  settingData.value.STOP2 = formatTimePost(secondStep.value[1])
  settingData.value.START3 = formatTimePost(thirdStep.value[0])
  settingData.value.STOP3 = formatTimePost(thirdStep.value[1])
  settingData.value.START4 = formatTimePost(fourthStep.value[0])
  settingData.value.STOP4 = formatTimePost(fourthStep.value[1])
}


//weekmask
const days1 = ref({
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false
})
const days2 = ref({
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false
})
const days3 = ref({
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false
})
const days4 = ref({
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false
})

//init
const updateDaysFromMask = (days, mask1) => {
  const dayKeys = Object.keys(days)
  mask1.split('').forEach((char, index) => {
    days[dayKeys[index]] = char === '1'
  })
  return days
}

function updateWeekMaskValue() {
  days1.value = updateDaysFromMask({ ...days1.value }, deviceSettings.value.mask1)
  days2.value = updateDaysFromMask({ ...days2.value }, deviceSettings.value.mask2)
  days3.value = updateDaysFromMask({ ...days3.value }, deviceSettings.value.mask3)
  days4.value = updateDaysFromMask({ ...days4.value }, deviceSettings.value.mask4)
}


//post

const convertDaysToMask = (days) => {
  const dayKeys = Object.keys(days)
  return dayKeys.map(day => days[day] ? '1' : '0').join('')
}
async function weekMaskPost() {
  settingData.value.MASK1 = convertDaysToMask(days1.value)
  settingData.value.MASK2 = convertDaysToMask(days2.value)
  settingData.value.MASK3 = convertDaysToMask(days3.value)
  settingData.value.MASK4 = convertDaysToMask(days4.value)
}

//update
const submitLabel = ref('Update')
const submitClicked = ref(0)

const postSettingBody = ref({
  code: null,
  command: 'CHRONO',
  payload: {}
})

const onSubmit = async () => {
  submitClicked.value = ++submitClicked.value
  if (submitClicked.value === 1) {
    console.log(submitClicked.value)
    submitLabel.value = 'the data entered is correct?'
  }
  postSettingBody.value.code = props.id
  await sliderValuePost()
  await weekMaskPost()
  postSettingBody.value.payload = settingData.value
  if (submitClicked.value === 2) {
    await deviceSettingStore.postDeviceSetting(postSettingBody.value)
    modalActive.value = true
    submitLabel.value = 'Update'
    submitClicked.value = 0
    if (postDeviceSettingStatus.value.isError) {
      closeNotification()
    } else {
      await delay(1000)
      closeNotification()
      getDeviceSettingData()
    }
  }
}

function goBack() {
  router.go(-1)
}

</script>
<template>
  <alert :message="postDeviceSettingStatus.message" :modalActive="modalActive"
    :isError="postDeviceSettingStatus.isError" @close="closeNotification" />
  <div class="flex">
    <SideNav :isDashboardActive="true" />
    <div class="flex flex-col w-screen">
      <TopBar>
        <p class="text-label-primary">{{ $t('deviceSetting') }}</p>
      </TopBar>
      <div
        class=" m-2 lg:m-[20px] flex-1 bg-bkg-primary rounded-[10px] shadow border border-bkg-secondary flex-col flex">
        <div class="px-3 py-2 lg:px-6 lg:py-4 bg-bkg-secondary flex items-center gap-4">
          <img @click="goBack()" src="../../assets/back-icon.svg" alt="" height="32px" width="32px"
            class="cursor-pointer hover:scale-110 transition-transform duration-150">
          <p class="text-accent-1 font-medium text-base">{{ props.id }}</p>
        </div>
        <div class="component-wrapper">
          <form @submit.prevent="onSubmit" class="form-wrapper">
            <div class="w-full flex flex-col lg:flex-row gap-[20px] lg:gap-[70px]">
              <!-- first -->
              <div class="w-full flex flex-col gap-4 max-w-[400px]">
                <p class="text-accent-1 font-bold text-xs lg:text-base">{{ $t('firstStep') }}</p>
                <div class="border border-label-secondary px-4 py-2 lg:px-8 lg:py-4 rounded-lg flex flex-col gap-2">
                  <label for="type" class="text-[12px] lg:text-[14px] font-semibold select-none text-label-primary">{{
                    $t('timePeriod') }}</label>
                  <div class="text-[12px] lg:text-[14px] flex w-full justify-between font-semibold">
                    <p>
                      {{ formatTimeView(firstStep[0]) }}
                    </p>
                    <p>
                      {{ formatTimeView(firstStep[1]) }}
                    </p>
                  </div>
                  <VueSlider v-model="firstStep" :interval="0.25" :min="min" :max="max" :enableCross="false" />
                </div>
                <div class="border border-label-secondary px-4 py-2 lg:px-8 lg:py-4 rounded-lg flex flex-col gap-4">
                  <label for="type" class="text-[12px] lg:text-[14px] font-semibold select-none text-label-primary">{{
                    $t('daysActive') }}</label>
                  <div class=" flex justify-around w-full">
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days1.monday" id="monday1">
                      <label class="cursor-pointer select-none" for="monday1">{{ $t('monday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days1.tuesday" id="tuesday1">
                      <label class="cursor-pointer select-none" for="tuesday1">{{ $t('tuesday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days1.wednesday" id="wednesday1">
                      <label class="cursor-pointer select-none" for="wednesday1">{{ $t('wednesday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days1.thursday" id="thursday1">
                      <label class="cursor-pointer select-none" for="thursday1">{{ $t('thursday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days1.friday" id="friday1">
                      <label class="cursor-pointer select-none" for="friday1">{{ $t('friday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days1.saturday" id="saturday1">
                      <label class="cursor-pointer select-none" for="saturday1">{{ $t('saturday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days1.sunday" id="sunday1">
                      <label class="cursor-pointer select-none" for="sunday1">{{ $t('sunday') }}</label>
                    </div>
                  </div>
                </div>
              </div>
              <!-- second -->
              <div class="w-full flex flex-col gap-4 max-w-[400px]">
                <p class="text-accent-1 font-bold text-xs lg:text-base">{{ $t('secondStep') }}</p>
                <div class="border border-label-secondary px-4 py-2 lg:px-8 lg:py-4 rounded-lg flex flex-col gap-2">
                  <label for="type" class="text-[12px] lg:text-[14px] font-semibold select-none text-label-primary">{{
                    $t('timePeriod') }}</label>
                  <div class="text-[12px] lg:text-[14px] flex w-full justify-between font-semibold">
                    <p>
                      {{ formatTimeView(secondStep[0]) }}
                    </p>
                    <p>
                      {{ formatTimeView(secondStep[1]) }}
                    </p>
                  </div>
                  <VueSlider v-model="secondStep" :interval="0.25" :min="min" :max="max" :enableCross="false" />
                </div>
                <div class="border border-label-secondary px-4 py-2 lg:px-8 lg:py-4 rounded-lg flex flex-col gap-4">
                  <label for="type" class="text-[12px] lg:text-[14px] font-semibold select-none text-label-primary">{{
                    $t('daysActive') }}</label>
                  <div class=" flex justify-around w-full">
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days2.monday" id="monday2">
                      <label class="cursor-pointer select-none" for="monday1">{{ $t('monday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days2.tuesday" id="tuesday2">
                      <label class="cursor-pointer select-none" for="tuesday1">{{ $t('tuesday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days2.wednesday" id="wednesday2">
                      <label class="cursor-pointer select-none" for="wednesday1">{{ $t('wednesday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days2.thursday" id="thursday2">
                      <label class="cursor-pointer select-none" for="thursday1">{{ $t('thursday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days2.friday" id="friday2">
                      <label class="cursor-pointer select-none" for="friday1">{{ $t('friday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days2.saturday" id="saturday2">
                      <label class="cursor-pointer select-none" for="saturday1">{{ $t('saturday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days2.sunday" id="sunday2">
                      <label class="cursor-pointer select-none" for="sunday1">{{ $t('sunday') }}</label>
                    </div>
                  </div>
                </div>
              </div>
              <!-- third -->
              <div class="w-full flex flex-col gap-4 max-w-[400px]">
                <p class="text-accent-1 font-bold text-xs lg:text-base">{{ $t('thirdStep') }}</p>
                <div class="border border-label-secondary px-4 py-2 lg:px-8 lg:py-4 rounded-lg flex flex-col gap-2">
                  <label for="type" class="text-[12px] lg:text-[14px] font-semibold select-none text-label-primary">{{
                    $t('timePeriod') }}</label>
                  <div class="text-[12px] lg:text-[14px] flex w-full justify-between font-semibold">
                    <p>
                      {{ formatTimeView(thirdStep[0]) }}
                    </p>
                    <p>
                      {{ formatTimeView(thirdStep[1]) }}
                    </p>
                  </div>
                  <VueSlider v-model="thirdStep" :interval="0.25" :min="min" :max="max" :enableCross="false" />
                </div>
                <div class="border border-label-secondary px-4 py-2 lg:px-8 lg:py-4 rounded-lg flex flex-col gap-4">
                  <label for="type" class="text-[12px] lg:text-[14px] font-semibold select-none text-label-primary">{{
                    $t('daysActive') }}</label>
                  <div class=" flex justify-around w-full">
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days3.monday" id="monday3">
                      <label class="cursor-pointer select-none" for="monday1">{{ $t('monday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days3.tuesday" id="tuesday3">
                      <label class="cursor-pointer select-none" for="tuesday1">{{ $t('tuesday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days3.wednesday" id="wednesday3">
                      <label class="cursor-pointer select-none" for="wednesday1">{{ $t('wednesday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days3.thursday" id="thursday3">
                      <label class="cursor-pointer select-none" for="thursday1">{{ $t('thursday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days3.friday" id="friday3">
                      <label class="cursor-pointer select-none" for="friday1">{{ $t('friday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days3.saturday" id="saturday3">
                      <label class="cursor-pointer select-none" for="saturday1">{{ $t('saturday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days3.sunday" id="sunday3">
                      <label class="cursor-pointer select-none" for="sunday1">{{ $t('sunday') }}</label>
                    </div>
                  </div>
                </div>
              </div>
              <!-- fourth -->
              <div class="w-full flex flex-col gap-4 max-w-[400px]">
                <p class="text-accent-1 font-bold text-xs lg:text-base">{{ $t('fourthStep') }}</p>
                <div class="border border-label-secondary px-4 py-2 lg:px-8 lg:py-4 rounded-lg flex flex-col gap-2">
                  <label for="type" class="text-[12px] lg:text-[14px] font-semibold select-none text-label-primary">{{
                    $t('timePeriod') }}</label>
                  <div class="text-[12px] lg:text-[14px] flex w-full justify-between font-semibold">
                    <p>
                      {{ formatTimeView(fourthStep[0]) }}
                    </p>
                    <p>
                      {{ formatTimeView(fourthStep[1]) }}
                    </p>
                  </div>
                  <VueSlider v-model="fourthStep" :interval="0.25" :min="min" :max="max" :enableCross="false" />
                </div>
                <div class="border border-label-secondary px-4 py-2 lg:px-8 lg:py-4 rounded-lg flex flex-col gap-4">
                  <label for="type" class="text-[12px] lg:text-[14px] font-semibold select-none text-label-primary">{{
                    $t('daysActive') }}</label>
                  <div class=" flex justify-around w-full">
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days4.monday" id="monday4">
                      <label class="cursor-pointer select-none" for="monday1">{{ $t('monday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days4.tuesday" id="tuesday4">
                      <label class="cursor-pointer select-none" for="tuesday1">{{ $t('tuesday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days4.wednesday" id="wednesday4">
                      <label class="cursor-pointer select-none" for="wednesday1">{{ $t('wednesday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days4.thursday" id="thursday4">
                      <label class="cursor-pointer select-none" for="thursday1">{{ $t('thursday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days4.friday" id="friday4">
                      <label class="cursor-pointer select-none" for="friday1">{{ $t('friday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days4.saturday" id="saturday4">
                      <label class="cursor-pointer select-none" for="saturday1">{{ $t('saturday') }}</label>
                    </div>
                    <div
                      class="text-[12px] lg:text-[14px] flex font-semibold flex-col gap-1 items-center cursor-pointer w-fit">
                      <input class="cursor-pointer" type="checkbox" v-model="days4.sunday" id="sunday4">
                      <label class="cursor-pointer select-none" for="sunday1">{{ $t('sunday') }}</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full lg:w-fit py-3 lg:py-[32px]">
              <BaseButton type="submit" class="primary" :label="submitLabel" :loading="postDeviceSettingIsLoading" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>



</template>

<style scoped>
p {
  @apply select-none
}

.input-wrapper {
  @apply flex flex-col gap-1 text-left w-full px-4 py-2 rounded-[10px] border
}

select {
  @apply cursor-pointer text-xs lg:text-[14px] font-medium bg-transparent outline-none text-label-primary
}

option {
  @apply text-xs lg:text-sm
}

.text-field {
  @apply flex flex-col gap-1
}

.label {
  @apply text-[9px] lg:text-[12px] font-semibold select-none text-label-primary
}

input {
  @apply outline-none text-xs lg:text-[14px] bg-transparent font-medium text-label-primary
}

input::placeholder {
  @apply text-xs lg:text-[14px] text-label-secondary font-normal
}



.modal {
  @apply fixed top-0 left-0 w-full h-full overflow-x-hidden overflow-y-auto bg-[#ABADAF]/20 z-50
}

.modal-inner {
  @apply max-w-[500px] my-[100px] mx-auto
}

.modal-content {
  @apply relative w-[600px] p-[40px] bg-white rounded-xl gap-[40px] flex flex-col
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drop-in-enter-active,
.drop-in-leave-active {
  transition: all 0.3s ease-out;
}

.drop-in-enter-from,
.drop-in-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

.button-wrapper {
  @apply flex justify-between gap-8
}


.component-wrapper {
  @apply px-3 py-6 lg:px-[46px] lg:py-[32px]
}
</style>
