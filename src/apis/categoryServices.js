import axiosClient from './axiosClient'

const categoryServices = {
  getAllCategories(accessToken, page, size) {
    const url = '/category/all?page=' + page + '&size=' + size
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
}

export default categoryServices
