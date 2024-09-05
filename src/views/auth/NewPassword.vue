<script setup>
import { Form as VeeForm } from 'vee-validate'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth/auth-store'
import { storeToRefs } from 'pinia';
import { updatePasswordSchema } from '@/composable/authSchema'
import router from '@/router';

const authStore = useAuthStore()
const { status, isLoading } = storeToRefs(useAuthStore())
const modalActive = ref(false)

const password = ref(false)
const passwordConfirm = ref(false)

const props = defineProps(['email'])

const closeNotification = () => {
  modalActive.value = false
}

function toLoginPage() {
  router.push({ name: 'login' })
}

const onSubmit = async (values, { resetForm }) => {
  values.email = props.email
  console.log(values)
  await authStore.newPassword(values)
  modalActive.value = true
  setTimeout(closeNotification, 5000)
  resetForm()
}
</script>
<template>
  <alert :message="status.message" :modalActive="modalActive" :isError="status.isError" @close="closeNotification" />

  <div class=" w-full h-full bg-cover absolute z-0 flex p-[20px] bg-bkg-primary">
    <div class="w-full xl:w-fit my-auto xl:mx-auto items-center flex flex-col gap-10">
      <img alt="aid logo" class="w-[100px]" src="../../assets/aid-logo.svg" width="200" height="200" />
      <div
        class="shadow-md w-full xl:w-[463px] xl:px-10 xl:py-[42px] px-[20px] py-[30px] bg-bkg-primary rounded-lg flex-col justify-start items-start gap-8 flex">
        <div class="flex flex-col gap-2">
          <p class="text-label-primary text-xl font-medium">Password Recovery</p>
          <p class="text-label-primary text-sm font-medium">Please kindly check <span class="text-accent-1">{{
              props.email }}</span> inbox to get the OTP</p>
        </div>
        <VeeForm :validationSchema="updatePasswordSchema" v-slot="{ handleSubmit }" as="div" class="w-full">
          <form @submit="handleSubmit($event, onSubmit)" class="form-wrapper">
            <BasicInput name="otp" type="text" placeholder="6 digits OTP" class="outlined" label="OTP" />
            <div class="flex items-center gap-2">
              <BasicInput name="password" :type="password ? 'text' : 'password'" placeholder="enter new password"
                class="outlined" label="Password" />
              <input class="cursor-pointer hidden w-[30px]" id="show-password" type="checkbox" v-model="password"><label
                class="cursor-pointer" for="show-password">
                <img v-if="!password" alt="aid logo" class="w-[24px]" src="../../assets/eye-open.svg" width="200"
                  height="200" />
                <img v-if="password" alt="aid logo" class="w-[24px]" src="../../assets/eye-close.svg" width="200"
                  height="200" />
              </label>
            </div>
            <div class="flex items-center gap-2">
              <BasicInput name="confirmPassword" :type="passwordConfirm ? 'text' : 'password'"
                placeholder="re enter your password" class="outlined" label="Confirm Password" />
              <input class="cursor-pointer hidden w-[30px]" id="show-password-confirm" type="checkbox"
                v-model="passwordConfirm"><label class="cursor-pointer" for="show-password-confirm">
                <img v-if="!passwordConfirm" alt="aid logo" class="w-[24px]" src="../../assets/eye-open.svg"
                  width="200" height="200" />
                <img v-if="passwordConfirm" alt="aid logo" class="w-[24px]" src="../../assets/eye-close.svg"
                  width="200" height="200" />
              </label>
            </div>
            <BasicButton type="submit" class="primary" label="Update Password" :loading="isLoading" />
          </form>
        </VeeForm>
      </div>
    </div>
  </div>

</template>

<style scoped>
p {
  @apply select-none
}
</style>
