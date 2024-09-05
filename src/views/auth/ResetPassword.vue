<script setup>
import { Form as VeeForm } from 'vee-validate'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth/auth-store'
import { storeToRefs } from 'pinia';
import { resetPasswordSchema } from '@/composable/authSchema'
import router from '@/router'

const authStore = useAuthStore()
const { status, isLoading } = storeToRefs(useAuthStore())
const modalActive = ref(false)

const closeNotification = () => {
  modalActive.value = false
}

function toLoginPage() {
  router.push({ name: 'login' })
}

const email = ref('')

const onSubmit = async (values, { resetForm }) => {
  await authStore.forgotPassword(values)
  modalActive.value = true
  setTimeout(closeNotification, 5000)
  router.push({ name: 'newPassword', params: { email: email.value } })
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
        <p class="text-label-primary text-xl font-medium">Reset Password</p>
        <VeeForm :validationSchema="resetPasswordSchema" v-slot="{ handleSubmit }" as="div" class="w-full">
          <form @submit="handleSubmit($event, onSubmit)" class="form-wrapper">
            <BasicInput v-model="email" name="email" type="email" placeholder="your email" class="outlined" label="Email" />
            <div class="flex gap-1 text-xs">
            <p>Already remember your password?</p>
            <div class="cursor-pointer text-accent-1" @click="toLoginPage()">
              <p>Back to login</p>
            </div>
          </div>
            <BasicButton type="submit" class="primary" label="Request Password" :loading="isLoading" />
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
