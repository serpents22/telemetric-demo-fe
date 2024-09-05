<script setup>
import { Form as VeeForm } from 'vee-validate'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth/auth-store'
import { storeToRefs } from 'pinia';
import { createUserSchema } from '@/composable/authSchema'
import router from '@/router';
import IntlTelInput from "intl-tel-input/vueWithUtils";
import "intl-tel-input/styles";

const privacyPolicyState = ref(false)
const privacyPolicy = import.meta.env.VITE_APP_API_URL + 'resources/privacy-policy.pdf'
const password = ref(false)
const passwordConfirm = ref(false)
const authStore = useAuthStore()
const { status, isLoading } = storeToRefs(useAuthStore())
const modalActive = ref(false)
const closeNotification = () => {
  modalActive.value = false
}
function toLoginPage() {
  router.push({ name: 'login' })
}
const onSubmit = async (values, { resetForm }) => {
  console.log(phoneNumber.value)
  await authStore.signUp(values)
  modalActive.value = true
  setTimeout(closeNotification, 5000)
  resetForm()
}

const phoneNumber = ref()
</script>
<template>
  <alert :message="status.message" :modalActive="modalActive" :isError="status.isError" @close="closeNotification" />

  <div class=" w-full h-full bg-cover absolute z-0 flex p-[20px] bg-bkg-primary">
    <div class="w-full xl:w-fit my-auto xl:mx-auto items-center flex flex-col gap-10">
      <img alt="aid logo" class="w-[100px]" src="../../assets/aid-logo.svg" width="200" height="200" />
      <div
        class="shadow-md w-full xl:w-[463px] xl:px-10 xl:py-[42px] px-[20px] py-[30px] bg-bkg-primary rounded-lg flex-col justify-start items-start gap-8 flex">
        <p class="text-label-primary text-xl font-medium">Sign Up</p>
        <VeeForm  v-slot="{ handleSubmit }" as="div" class="w-full">
          <form @submit="handleSubmit($event, onSubmit)" class="form-wrapper">
            <BasicInput name="name" type="text" placeholder="your username" class="outlined" label="Username" />
            <BasicInput name="email" type="mail" placeholder="your email" class="outlined" label="Email" />
            <IntlTelInput :options="{
              initialCountry: 'it',
            }" v-model="phoneNumber"/>
            <BasicInput name="phone" type="text" placeholder="your phone number" class="outlined"
              label="Phone Number" />
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
                <img v-if="!passwordConfirm" alt="aid logo" class="w-[24px]" src="../../assets/eye-open.svg" width="200"
                  height="200" />
                <img v-if="passwordConfirm" alt="aid logo" class="w-[24px]" src="../../assets/eye-close.svg" width="200"
                  height="200" />
              </label>
            </div>

            <div class="flex gap-2 items-center text-xs sm:text-sm">
              <input class="cursor-pointer" id="privacyPolicy" name="privacyPolicy" type="checkbox"
                v-model="privacyPolicyState" />
              <label>I have read and accept the
                <a class="cursor-pointer underline" :href="privacyPolicy" target="_blank">Privacy Policy</a>
              </label>
            </div>
            <BasicButton type="submit" class="primary" :class="{ 'cursor-not-allowed': !privacyPolicyState }"
              :disabled="!privacyPolicyState" label="Register" :loading="isLoading" />
          </form>
          <div class="flex gap-1 text-xs">
            <p>Already have an account?</p>
            <div class="cursor-pointer text-accent-1" @click="toLoginPage()">
              <p>Login here</p>
            </div>
          </div>
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
