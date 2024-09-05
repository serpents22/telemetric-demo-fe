import { defineStore } from 'pinia'
import devicesAPI from '@/services/master-data/devices-api'
import { ref } from 'vue'
import moment from 'moment'

export const useDeviceConfigStore = defineStore('Configs', {
  state: () => ({
    deviceConfigs: ref({}),
    getDeviceConfigStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    postDeviceConfigStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    getDeviceConfigIsLoading: ref(false),
    postDeviceConfigIsLoading: ref(false),
  }),
  actions: {
    async getDeviceConfig(params) {
      this.getDeviceConfigIsLoading = true
      try {
        const res = await devicesAPI.getDeviceConfig(params)
        console.log(res)
        this.deviceConfigs = res.data.config
        this.getDeviceConfigIsLoading = false
        this.getDeviceConfigStatus.code = res.status
        this.getDeviceConfigStatus.isError = false
        this.getDeviceConfigStatus.message = "Data Fetched"
      } catch (err) {
        console.error(err)
        this.getDeviceConfigIsLoading = false
        this.getDeviceConfigStatus.code = err.response.data.status
        this.getDeviceConfigStatus.message = JSON.stringify(err.response.data.data)
        this.getDeviceConfigStatus.isError = true
        return err
      }
    },
    async postDeviceConfig(data) {
      this.postDeviceConfigIsLoading = true
      try {
        const res = await devicesAPI.postDeviceConfig(data)
        this.postDeviceConfigIsLoading = false
        this.postDeviceConfigStatus.message = res.data.message
        this.postDeviceConfigStatus.code = res.data.status
        this.postDeviceConfigStatus.isError = false
      } catch (err) {
        console.error(err)
        this.postDeviceConfigStatus.message = err.data.message
        this.postDeviceConfigStatus.code = err.data.status
        this.postDeviceConfigStatus.isError = true
        this.postDeviceConfigIsLoading = false
        return err
      }
    }
  }
})