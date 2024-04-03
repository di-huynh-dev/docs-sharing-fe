import axiosClient from './axiosClient'

const statsServices = {
  getSumary(accessToken) {
    const url = '/stats/stats/summary'
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
  getDocumentStats(accessToken) {
    const url = '/stats/document/6month'
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
  getUserRegisteredStats(accessToken) {
    const url = '/stats/registration/6month'
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
  getUserPostStats(accessToken) {
    const url = '/stats/post/6month'
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
}

export default statsServices
