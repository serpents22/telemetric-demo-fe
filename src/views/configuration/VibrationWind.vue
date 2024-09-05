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
  fields: 'gmode,gthresh,gdelay,wthresh0,wdelay0,wthresh1,wdelay1'
})
const vibrationWindData = useLocalStorage('vibrationWindData', {
  GMODE: '1',
  GTHRESH: '6',
  GDELAY: '4',
  WTHRESH0: '7',
  WDELAY0: '5',
  WTHRESH1: '3',
  WDELAY1: '4',
})

async function getDeviceConfigData() {
  await deviceConfigStore.getDeviceConfig(deviceConfigParams.value)
  vibrationWindData.value.GMODE = deviceConfigs.value.gmode
  vibrationWindData.value.GTHRESH = deviceConfigs.value.gthresh
  vibrationWindData.value.GDELAY = deviceConfigs.value.gdelay
  vibrationWindData.value.WTHRESH0 = deviceConfigs.value.wthresh0
  vibrationWindData.value.WDELAY0 = deviceConfigs.value.wdelay0
  vibrationWindData.value.WTHRESH1 = deviceConfigs.value.wthresh1
  vibrationWindData.value.WDELAY1 = deviceConfigs.value.wdelay1
  console.log(vibrationWindData.value)
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
  GTHRESH: yup.number().required().min(0).max(10),
  GDELAY: yup.number().required().min(0).max(3600),
  WTHRESH0: yup.number().required().min(0.00).max(200.00),
  WDELAY0: yup.number().required().min(0).max(3600),
  WTHRESH1: yup.number().required().min(0.00).max(200.00),
  WDELAY1: yup.number().required().min(0).max(3600),
})

const postVibrationConfigBody = ref({
  code: null,
  command: 'CONFIG',
  payload: {}
})

const onSubmit = async (values) => {
  submitClicked.value = ++submitClicked.value
  if (submitClicked.value === 1) {
    submitLabel.value = 'the data entered is correct?'
  }
  postVibrationConfigBody.value.code = props.id
  postVibrationConfigBody.value.payload = vibrationWindData.value

  if (submitClicked.value === 2) {
    await deviceConfigStore.postDeviceConfig(postVibrationConfigBody.value)
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
  <alert :message="postDeviceConfigStatus.message" :modalActive="modalActive" :isError="postDeviceConfigStatus.isError"
    @close="closeNotification" />
  <VeeForm :validation-schema="schema" v-slot="{ handleSubmit }" as="div" ref="form">
    <form @submit="handleSubmit($event, onSubmit)" class="form-wrapper">
      <div class="w-fit flex flex-col lg:flex-row gap-[20px] lg:gap-[70px]">
        <div class="flex flex-col gap-[5px] lg:gap-[10px] pb:[12px] lg:pr-[70px] max-w-[400px]">
          <p class="text-accent-1 font-bold text-xs lg:text-base">{{ $t('vibrationConfiguration') }}</p>
          <p class="text-label-secondary text-xs lg:text-sm">{{ $t('vibrationConfigurationDescription') }}</p>
        </div>
        <div
          class="flex flex-col gap-[24px] pb-[20px] lg:pr-[70px] border-b lg:border-r lg:border-b-0 w-full max-w-[400px]">
          <div class="input-wrapper border-label-secondary">
            <label for="type" class="text-[12px] font-semibold select-none text-label-primary">{{
              $t('vibrationActionAlarmChoice') }}</label>
            <select name="type" v-model="vibrationWindData.GMODE" class="cursor-pointer text-sm" required>
              <option value="0">
                {{ $t('disabled') }}
              </option>
              <option value="1">
                {{ $t('engineStop') }}
              </option>
              <option value="3">
                {{ $t('activeOut3') }}
              </option>
            </select>
          </div>
          <BaseInput name="GTHRESH" type="text" placeholder="0 to 10" :label="t('vibrationAlarmThreshold')"
            v-model="vibrationWindData.GTHRESH" />
          <BaseInput name="GDELAY" type="text" placeholder="0 to 3600" :label="t('vibrationAlarmDelay')"
            v-model="vibrationWindData.GDELAY" />
        </div>
        <div class="flex flex-col gap-[5px] lg:gap-[10px] pb:[12px] lg:pr-[70px] max-w-[400px]">
          <p class="text-accent-1 font-bold text-xs lg:text-base">{{ $t('windConfiguration') }}</p>
          <p class="text-label-secondary text-xs lg:text-sm">{{ $t('windConfigurationDescription') }}</p>
        </div>
        <div class="flex flex-col gap-[24px] pr-[70px] w-full max-w-[400px]">
          <BaseInput name="WTHRESH1" type="text" placeholder="0.00 to 200.00" :label="t('windAlarmThreshold')"
            v-model="vibrationWindData.WTHRESH1" />
          <BaseInput name="WDELAY1" type="text" placeholder="0 to 3600" :label="t('windAlarmActivationDelay')"
            v-model="vibrationWindData.WDELAY1" />
          <BaseInput name="WTHRESH0" type="text" placeholder="0 to 200.00" :label="t('windAlarmDeactivationSpeed')"
            v-model="vibrationWindData.WTHRESH0" />
          <BaseInput name="WDELAY0" type="text" placeholder="0 to 3600" :label="t('windAlarmDeactivationDelay')"
            v-model="vibrationWindData.WDELAY0" />
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
