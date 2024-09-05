<template>
  <alert :message="shareDeviceStatus.message" :modalActive="modalActive" :isError="shareDeviceStatus.isError"
    @close="closeNotification" />
  <transition name="fade">
    <div class="modal" v-show="isOpen">
      <transition name="drop-in">
        <div class="modal-inner" v-show="isOpen" ref="target">
          <div class="modal-content">
            <h1 class="title">{{ title }}</h1>
            <VeeForm :validation-schema="schema" v-slot="{ handleSubmit }" as="div" ref="form">
              <form @submit="handleSubmit($event, onSubmit)" class="form-wrapper">
                <div class="px-3 py-2 border border-label-secondary rounded-lg bg-bkg-tertiary">
                  <p class="font-semibold text-xs">{{$t('deviceName')}}</p>
                  {{ props.formData.name }}
                </div>
                <div class="px-3 py-2 border border-label-secondary rounded-lg bg-bkg-tertiary">
                  <p class="font-semibold text-xs">{{$t('serialNumber')}}</p>
                  {{ props.formData.code }}
                </div>
                <BasicInput name="email" type="email" placeholder="Email" label="Email" />
                <div class="input-wrapper border-label-secondary">
                  <label for="role" class="text-[12px] font-semibold select-none text-label-primary">{{$t('role')}}</label>
                  <select name="role" v-model="role" class="cursor-pointer text-sm" required>
                    <option value="ADMIN">
                      ADMIN
                    </option>
                    <option value="USER">
                      USER
                    </option>
                  </select>
                </div>
                <div class="flex justify-between gap-10">
                  <BasicButton type="button" class="secondary" :label="cancelLabel" @click="cancelForm" />
                  <BasicButton type="submit" class="primary" :label="registerLabel" :loading="shareDeviceIsLoading"/>
                </div>
              </form>
            </VeeForm>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>


<script setup>
import { Form as VeeForm } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import * as yup from 'yup'
import { useDevicesStore } from '@/stores/master-data/devices-store'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))

//props
const props = defineProps({
  isOpen: Boolean,
  title: String,
  formData: {
    type: Object,
    // default: () => ({ imeiNumber: '', simNumber: '', simProvider: '', type: '', manufacturerName: '', variantName: '', notes: '' })
  }
})

const role = ref('')

// get location handler
const getLocationLoading = ref(false)

function getLocation() {
  getLocationLoading.value = true
  navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position) {
  props.formData.latitude = position.coords.latitude
  props.formData.longitude = position.coords.longitude
  getLocationLoading.value = false
}

// Define custom events
const emits = defineEmits(['close'])
const form = ref(null)
const target = ref(null)
onClickOutside(target, () => {
  if (props.isOpen) {
    emits('close')
    regButtonClick.value = 0
    registerLabel.value = 'SUBMIT'
    cancelButtonClick.value = 0
    cancelLabel.value = 'CANCEL'
  }
})

//validation schema
const schema = yup.object({
  email: yup.string().required().email().label(' '),
})

//stores
const devicesStore = useDevicesStore()
const { shareDeviceStatus, shareDeviceIsLoading } = storeToRefs(useDevicesStore())

//alert control
const modalActive = ref(false)
const closeNotification = () => {
  modalActive.value = false
}

//button label and action variable
const cancelLabel = ref('CANCEL')
const registerLabel = ref('REGISTER')
const regButtonClick = ref(0)
const cancelButtonClick = ref(0)

//cancel form handler
function cancelForm() {
  cancelButtonClick.value = ++cancelButtonClick.value
  switch (cancelButtonClick.value) {
    case 1:
      cancelLabel.value = 'The entered data will be lost!'
      break;
    case 2:
      emits('close')
      cancelButtonClick.value = 0
      cancelLabel.value = 'CANCEL'
      break;
  }
}

const onSubmit = async (values, { resetForm }) => {
  console.log(values)
  values.code = props.formData.code
  values.role = role.value
  regButtonClick.value = ++regButtonClick.value
  if (regButtonClick.value == 1) {
    registerLabel.value = 'the data entered is correct?'
  }

  if (regButtonClick.value == 2) {
    await devicesStore.shareDevice(values)
    modalActive.value = true
    if (shareDeviceStatus.value.isError) {
      setTimeout(closeNotification, 3000)
    } else {
      setTimeout(closeNotification, 3000)
      resetForm()
    }
    registerLabel.value = 'REGISTER'
    regButtonClick.value = 0
    emits('close')
    await delay(1000)
    devicesStore.getDevices()
  }
}

</script>

<style scoped>
.modal {
  @apply fixed top-0 left-0 w-full h-full overflow-x-hidden overflow-y-auto bg-[#ABADAF]/20 z-20
}

.modal-inner {
  @apply max-w-[500px] my-[100px] mx-auto
}

.modal-content {
  @apply relative w-[600px] p-[40px] bg-bkg-secondary rounded-xl gap-[20px] flex flex-col
}

.title {
  @apply text-left border-b-[1px] border-b-bkg-secondary text-[20px] font-semibold text-label-primary
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
</style>