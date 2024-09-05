<script setup>

import router from '@/router';

function toLoginPage() {
  router.push({ name: 'login' })
}
const onSubmit = async (values, { resetForm }) => {
  await authStore.signUp(values)
  modalActive.value = true
  setTimeout(closeNotification, 5000)
  resetForm()
}
</script>
<template>
  <div class=" w-full h-full bg-cover absolute z-0 flex p-[20px] bg-bkg-primary">
    <div class="w-full xl:w-fit my-auto xl:mx-auto items-center flex flex-col gap-10">
      <img alt="aid logo" class="w-[100px]" src="../../assets/aid-logo.svg" width="200" height="200" />
      <div
        class="shadow-md w-fit xl:px-10 xl:py-[42px] px-[20px] py-[30px] bg-bkg-primary rounded-lg flex-col justify-start items-start gap-8 flex">
        <p class="text-label-primary text-xs xl:text-xl font-medium">Your Password Recovery is Success!</p>
          <div class="cursor-pointer text-accent-1 justify-center flex" @click="toLoginPage()">
            <p class="font-semibold text-lg">Try to Login again here</p>
          </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
p {
  @apply select-none
}
</style>
