import axiosClient from './axiosClient'

const fieldServices = {
  getAllFields(accessToken, page, size) {
    const url = '/field/all?page=' + page + '&size=' + size
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
}

export default fieldServices
