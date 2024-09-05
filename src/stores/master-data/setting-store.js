import { defineStore } from 'pinia'
import devicesAPI from '@/services/master-data/devices-api'
import { ref } from 'vue'
import moment from 'moment'

export const useDeviceSettingStore = defineStore('Settings', {
  state: () => ({
    deviceSettings: ref({}),
    getDeviceSettingStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    postDeviceSettingStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    getDeviceSettingIsLoading: ref(false),
    postDeviceSettingIsLoading: ref(false),
  }),
  actions: {
    async getDeviceSetting(params) {
      this.getDeviceSettingIsLoading = true
      try {
        const res = await devicesAPI.getDeviceConfig(params)
        console.log(res)
        this.deviceSettings = res.data.config
        this.getDeviceSettingIsLoading = false
        this.getDeviceSettingStatus.code = res.status
        this.getDeviceSettingStatus.isError = false
        this.getDeviceSettingStatus.message = "Data Fetched"
      } catch (err) {
        console.error(err)
        this.getDeviceSettingIsLoading = false
        this.getDeviceSettingStatus.code = err.response.data.status
        this.getDeviceSettingStatus.message = JSON.stringify(err.response.data.data)
        this.getDeviceSettingStatus.isError = true
        return err
      }
    },
    async postDeviceSetting(data) {
      this.postDeviceSettingIsLoading = true
      try {
        const res = await devicesAPI.postDeviceConfig(data)
        this.postDeviceSettingIsLoading = false
        this.postDeviceSettingStatus.message = res.data.message
        this.postDeviceSettingStatus.code = res.data.status
        this.postDeviceSettingStatus.isError = false
      } catch (err) {
        console.error(err)
        this.postDeviceSettingStatus.message = err.data.message
        this.postDeviceSettingStatus.code = err.data.status
        this.postDeviceSettingStatus.isError = true
        this.postDeviceSettingIsLoading = false
        return err
      }
    }
  }
})