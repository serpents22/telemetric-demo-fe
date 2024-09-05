<script setup>
import { useLocalStorage } from '@vueuse/core';
import { useDeviceConfigStore } from '@/stores/master-data/config-store'
import { onMounted, ref } from 'vue'
import BaseInput from '@/components/input/BaseInput.vue'
import BaseButton from '@/components/input/BaseButton.vue'
import { Form as VeeForm } from 'vee-validate'
import * as yup from 'yup'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))


const props = defineProps(['id'])


//stores
const deviceConfigStore = useDeviceConfigStore()
const { deviceConfigs, getDeviceConfigStatus, getDeviceConfigIsLoading, postDeviceConfigIsLoading, postDeviceConfigStatus } = storeToRefs(useDeviceConfigStore())
const deviceConfigParams = ref({
  code: null,
  command: 'CONFIG',
  fields: 'tmode,tam,ta0,tc0,ta1,tc1,tcm'
})
const temperatureData = useLocalStorage('temperatureData', {
  TMODE: '0',
  TAM: '0',
  TA0: '0',
  TC0: '0',
  TA1: '100',
  TC1: '10',
  TCM: '10',
})

async function getDeviceConfigData() {
  await deviceConfigStore.getDeviceConfig(deviceConfigParams.value)
  temperatureData.value.TMODE = deviceConfigs.value.tmode
  temperatureData.value.TAM = deviceConfigs.value.tam
  temperatureData.value.TA0 = deviceConfigs.value.ta0
  temperatureData.value.TC0 = deviceConfigs.value.tc0
  temperatureData.value.TA1 = deviceConfigs.value.ta1
  temperatureData.value.TC1 = deviceConfigs.value.tc1
  temperatureData.value.TCM = deviceConfigs.value.tcm
  console.log(temperatureData.value)
}

onMounted(async () => {
  deviceConfigParams.value.code = props.id
  getDeviceConfigData()
})
//alert control
const modalActive = ref(false)
const closeNotification = () => {
  modalActive.value = false
}
//update
const submitLabel = ref('Update')
const submitClicked = ref(0)

const schema = yup.object({
  TAM: yup.number().required().min(-20).max(100),
  TA0: yup.number().required().min(-20).max(100),
  TC0: yup.number().required().min(-20).max(100),
  TA1: yup.number().required().min(-20).max(100),
  TC1: yup.number().required().min(-20).max(100),
  TCM: yup.number().required().min(-20).max(100),
})

const postTemperatureConfigBody = ref({
  code: null,
  command: 'CONFIG',
  payload: {}
})

const onSubmit = async (values) => {
  submitClicked.value = ++submitClicked.value
  if (submitClicked.value === 1) {
    submitLabel.value = 'the data entered is correct?'
  }
  postTemperatureConfigBody.value.code = props.id
  postTemperatureConfigBody.value.payload = temperatureData.value

  if (submitClicked.value === 2) {
    await deviceConfigStore.postDeviceConfig(postTemperatureConfigBody.value)
    modalActive.value = true
    submitLabel.value = 'Update'
    submitClicked.value = 0
    if (postDeviceConfigStatus.value.isError) {
      closeNotification()
    } else {
      await delay(1000)
      closeNotification()
      getDeviceConfigData()
    }
  }
}



</script>
<template>
  <alert :message="postDeviceConfigStatus.message" :modalActive="modalActive" :isError="postDeviceConfigStatus.isError" @close="closeNotification" />
  <VeeForm :validation-schema="schema" v-slot="{ handleSubmit }" as="div" ref="form">
    <form @submit="handleSubmit($event, onSubmit)" class="form-wrapper">
      <div class="w-fit flex flex-col lg:flex-row gap-[20px] lg:gap-[70px]">
        <div class="flex flex-col gap-[5px] lg:gap-[10px] pb:[12px] lg:pr-[70px] max-w-[400px]">
          <p class="text-accent-1 font-bold text-xs lg:text-base">{{$t('temperatureConfiguration')}}</p>
          <p class="text-label-secondary text-xs lg:text-sm">{{$t('temperatureConfigurationDescription')}}</p>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-[20px] lg:gap-[32px] w-full">
          <div class="input-wrapper border-label-secondary">
            <label for="type" class="text-[12px] font-semibold select-none text-label-primary">Temp Alarm Mode</label>
            <select name="type" v-model="temperatureData.TMODE" class="cursor-pointer text-sm" required>
              <option value="0">
                {{$t('tempAlarmModeDisabled')}}
              </option>
              <option value="1">
                {{$t('tempAlarmModeCanopy')}}
              </option>
              <option value="2">
                {{$t('tempAlarmModeAir')}}
              </option>
              <option value="3">
                {{$t('tempAlarmModeBoth')}}
              </option>
              <option value="4">
                {{$t('tempAlarmModeAny')}}
              </option>
            </select>
          </div>
          <BaseInput name="TAM" type="number" placeholder="-20 to 100" :label="t('airTempModemActivation')"
            v-model="temperatureData.TAM" />
          <BaseInput name="TA0" type="number" placeholder="-20 to 100" :label="t('airTempStopAlarm')"
            v-model="temperatureData.TA0" />
          <BaseInput name="TC0" type="number" placeholder="-20 to 100" :label="t('tempStopCanopyAlarm')"
            v-model="temperatureData.TC0" />
          <BaseInput name="TA1" type="number" placeholder="-20 to 100" :label="t('airTempStartAlarm')"
            v-model="temperatureData.TA1" />
          <BaseInput name="TC1" type="number" placeholder="-20 to 100" :label="t('tempStartCanopyAlarm')"
            v-model="temperatureData.TC1" />
          <BaseInput name="TCM" type="number" placeholder="-20 to 100" :label="t('canopyTempModemActivation')"
            v-model="temperatureData.TCM" />
        </div>
      </div>
      <div class="w-full lg:w-fit py-3 lg:py-[32px]">
        <BaseButton type="submit" class="primary" :label="submitLabel" :loading="postDeviceConfigIsLoading" />
      </div>
    </form>
  </VeeForm>
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
</style>
