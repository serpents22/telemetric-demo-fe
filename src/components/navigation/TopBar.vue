<template>
  <div class="topbar">
    <slot></slot>
    <transition name="modal-animation">
      <div v-if="isNotificationShow" class="rounded-md bg-white absolute right-20 top-12 shadow-md" ref="target">

        <div v-if="!getViolationNotificationIsLoading && violationsNotification.length !== 0"
          v-for="notif in violationsNotification" class="border-b px-3 py-2 text-left flex gap-2">
          <div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="12" fill="#F65D54" fill-opacity="0.2" />
              <path
                d="M12 5C8.13438 5 5 8.13438 5 12C5 15.8656 8.13438 19 12 19C15.8656 19 19 15.8656 19 12C19 8.13438 15.8656 5 12 5ZM12 17.8125C8.79063 17.8125 6.1875 15.2094 6.1875 12C6.1875 8.79063 8.79063 6.1875 12 6.1875C15.2094 6.1875 17.8125 8.79063 17.8125 12C17.8125 15.2094 15.2094 17.8125 12 17.8125Z"
                fill="#F75D54" />
              <path
                d="M11.25 9.25C11.25 9.44891 11.329 9.63968 11.4697 9.78033C11.6103 9.92098 11.8011 10 12 10C12.1989 10 12.3897 9.92098 12.5303 9.78033C12.671 9.63968 12.75 9.44891 12.75 9.25C12.75 9.05109 12.671 8.86032 12.5303 8.71967C12.3897 8.57902 12.1989 8.5 12 8.5C11.8011 8.5 11.6103 8.57902 11.4697 8.71967C11.329 8.86032 11.25 9.05109 11.25 9.25V9.25ZM12.375 11H11.625C11.5562 11 11.5 11.0562 11.5 11.125V15.375C11.5 15.4438 11.5562 15.5 11.625 15.5H12.375C12.4438 15.5 12.5 15.4438 12.5 15.375V11.125C12.5 11.0562 12.4438 11 12.375 11Z"
                fill="#F75D54" />
            </svg>
          </div>
          <div class="flex flex-col gap-[2px]">
            <h1 class="font-semibold text-xs">{{ notif.contractor }} : {{ notif.hullNumber }}</h1>
            <h1 class="font-semibold text-xs"></h1>
            <p class="text-xs">{{ notif.eventIo }}</p>
            <p class="text-xs text-gray-500">{{ notif.eventTime }}</p>
          </div>
        </div>

        <div v-if="!getViolationNotificationIsLoading && violationsNotification.length === 0"
          class="border-b px-3 py-2 text-left flex gap-2">
          <h1 class="font-semibold text-xs">{{ notificationStatus.message }}</h1>
        </div>

        <div v-if="getViolationNotificationIsLoading" class="border-b px-3 py-2 text-left flex gap-2">
          <div class="animate-pulse flex space-x-4 w-32">
            <div class="flex-1 space-y-6 py-1">
              <div class="h-2 bg-slate-200 rounded"></div>
              <div class="space-y-3">
                <div class="grid grid-cols-3 gap-4">
                  <div class="h-2 bg-slate-200 rounded col-span-2"></div>
                </div>
                <div class="grid grid-cols-3 gap-4">
                  <div class="h-2 bg-slate-200 rounded col-span-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core'

const target = ref(null)
onClickOutside(target, () => {
  isNotificationShow.value = false
})

const isNotificationShow = ref(false)

function viewNotifications() {
  isNewMessage.value = false
  isNotificationShow.value = true
  violationsStore.getViolationNotification()
}
const props = defineProps(['title'])


</script>

<style scoped>
/*animation*/
.modal-animation-enter-active,
.modal-animation-leave-active {
  transition: opacity 0.5s ease;
}

.modal-animation-enter-from,
.modal-animation-leave-to {
  opacity: 0;
}

.topbar {
  @apply sticky w-full h-[60px] p-5 z-10 flex gap-2 justify-between items-center transition-all ease-in-out duration-200 top-0 left-0 border-b-2
  bg-bkg-primary border-label-tertiary
}

.topbar-header {
  @apply p-1
}
</style>