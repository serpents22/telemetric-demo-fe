import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    locale: useLocalStorage('locale','ita'),
  }),
  actions: {
    async setLocale(lang) {
      this.locale = lang
      }
    }
  })