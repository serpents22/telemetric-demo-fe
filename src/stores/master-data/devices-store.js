import { defineStore } from 'pinia'
import devicesAPI from '@/services/master-data/devices-api'
import { ref } from 'vue'
import moment from 'moment'

export const useDevicesStore = defineStore('Devices', {
  state: () => ({
    devices: ref([]),
    getDevicesStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    createDeviceStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    editDeviceStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    deleteDeviceStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    shareDeviceStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    deleteDeviceLoading: ref(false),
    createDeviceLoading: ref(false),
    editDeviceLoading: ref(false),
    getDevicesLoading: ref(false),
    shareDeviceIsLoading: ref(false),
  }),
  actions: {
    async getDevices() {
      this.getDevicesLoading = true
      try {
        const res = await devicesAPI.getDevices()
        console.log(res)
        this.getDevicesLoading = false
        this.devices = res.data.devices
        this.devices.map((item, index) => {
          item.no = index + 1
          item.formattedCreatedAt = moment(item.createdAt).format("YYYY-MM-DD HH:mm")
          item.formattedUpdatedAt = moment(item.updatedAt).format("YYYY-MM-DD HH:mm")
        })
        console.log('devices data', this.devices)
        console.log(res)
        this.getDevicesStatus.code = res.status
        this.getDevicesStatus.isError = false
        this.getDevicesStatus.message = "Data Fetched"
      } catch (err) {
        console.error(err)
        this.getDevicesLoading = false
        this.getDevicesStatus.code = err.response.data.status
        this.getDevicesStatus.message = JSON.stringify(err.response.data.data)
        this.getDevicesStatus.isError = true
        return err
      }
    },
    async createDevice(data) {
      this.createDeviceLoading = true
      try {
        const res = await devicesAPI.createDevice(data)
        console.log(res)
        this.createDeviceLoading = false
        this.createDeviceStatus.isError = false
        this.createDeviceStatus.message = 'Data Posted'
        this.createDeviceStatus.code = res.data.status
      } catch (err) {
        console.error(err)
        this.createDeviceLoading = false
        this.createDeviceStatus.isError = true
        this.createDeviceStatus.code = err.response.data.status
        this.createDeviceStatus.message = err.response.data.data
        return err
      }
    },
    async deleteDevice(id) {
      this.deleteDeviceLoading = true
      try {
        const res = await devicesAPI.deleteDevice(id)
        console.log(res)
        this.deleteDeviceLoading = false
        this.deleteDeviceStatus.message = 'Data Deleted'
        this.deleteDeviceStatus.code = res.status
      } catch (err) {
        console.error(err)
        this.deleteDeviceLoading = false
        this.deleteDeviceStatus.message = err.response.data.error
        this.deleteDeviceStatus.code = err.response.data.status
        return err
      }
    },
    async editDevice(id, data) {
      this.editDeviceLoading = true
      try {
        const res = await devicesAPI.editDevice(id, data)
        console.log(res)
        this.editDeviceLoading = false
        this.editDeviceStatus.message = 'Data Updated'
        this.editDeviceStatus.code = res.data.status
      } catch (err) {
        console.error(err)
        this.editDeviceLoading = false
        this.editDeviceStatus.message = JSON.stringify(err.response.data.data)
        this.editDeviceStatus.code = err.response.data.status
        return err
      }
    },
    async shareDevice(data) {
      this.shareDeviceIsLoading = true
      try {
        const res = await devicesAPI.shareDevice(data)
        this.shareDeviceIsLoading = false
        this.shareDeviceStatus.message = res.data.message
        this.shareDeviceStatus.code = res.data.status
        this.shareDeviceStatus.isError = false
      } catch (err) {
        console.error(err)
        this.shareDeviceStatus.message = err.data.message
        this.shareDeviceStatus.code = err.data.status
        this.shareDeviceStatus.isError = true
        this.shareDeviceIsLoading = false
        return err
      }
    }
  }
})