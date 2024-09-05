import apiClient from "../api";
 
export default {
  getDevices() {
    return apiClient.get('devices')
  },
  getDevice(id) {
    return apiClient.get(`devices/${id}`)
  },
  getDeviceConfig(params) {
    return apiClient.get('/device-config',{ params })
  },
  createDevice(data) {
    return apiClient.post('devices',data)
  },
  editDevice(id, data) {
    return apiClient.patch(`devices/${id}`, data)
  },
  deleteDevice(id) {
    return apiClient.delete(`devices/${id}`)
  },
  postDeviceConfig(data) {
    return apiClient.post('/device-config',data)
  },
  shareDevice(data) {
    return apiClient.post('/devices/invite',data)
  },

  
  
}