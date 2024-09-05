import apiClient from "../api";
 
const config = { 
  headers: {
    Accept: 'application/json'
  }
}

export default {
  signIn(data) {
    return apiClient.post('auth/signin',data,config)
  },
  signUp(data) {
    return apiClient.post('auth/signup',data,config)
  },
  signOut() {
    return apiClient.get('auth/signout',config)
  },
  forgotPassword(data) {
    return apiClient.post('auth/request-otp',data)
  },
  newPassword(data) {
    return apiClient.post('auth/reset-password',data)
  },

}