import apiClient from "../api";
 
export default {
  getReport(params) {
    return apiClient.get('/report',{ params })
  },
}