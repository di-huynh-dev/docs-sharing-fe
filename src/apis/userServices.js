import axiosClient from './axiosClient'

const userServices = {
  login(email, password) {
    const url = '/auth/login'
    return axiosClient.post(url, { email, password })
  },
  signup(email, password, confirmPassword, firstName, lastName) {
    const url = '/auth/signup'
    return axiosClient.post(url, {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
    })
  },
  sendOTP(email, type) {
    const url = '/auth/sendEmail?email=' + email + '&type=' + type
    return axiosClient.post(url)
  },

  verifyOTP(email, code) {
    const url = '/auth/verify?email=' + email + '&code=' + code + '&type=register'
    return axiosClient.post(url)
  },
  resetPassword(email, newPassword, confirmPassword) {
    const url = '/users/password/reset'
    return axiosClient.put(url, {
      email,
      newPassword,
      confirmPassword,
    })
  },
  getProfile(accessToken) {
    const url = '/users/profile'
    return axiosClient.get(url, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },

  updateProfile(accessToken, data) {
    const url = '/users/profile'
    return axiosClient.put(url, data, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
}

export default userServices
