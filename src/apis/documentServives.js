import axiosClient from './axiosClient'

const documentServices = {
  getAllDocuments(accessToken, page, size) {
    const url = '/document/all?page=' + page + '&size=' + size
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
}
export default documentServices
