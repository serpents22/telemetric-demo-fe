import { defineStore } from 'pinia'

export const useLoadingStore = defineStore({
  id: 'loading',
  state: () => ({
    loading: false
  }),
  actions: {
    startLoading() {
      this.loading = true
    },
    stopLoading() {
      this.loading = false
    }
  }
})
