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
  addCategory(accessToken, categoryName, disabled) {
    const url = '/category/create'
    return axiosClient.post(
      url,
      { categoryName, disabled },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  },
  deleteCategory(accessToken, categoryId) {
    const url = '/category/' + categoryId
    return axiosClient.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },

  updateCategory(accessToken, categoryId, categoryName, disabled) {
    const url = '/category/' + categoryId
    return axiosClient.put(
      url,
      { categoryName, disabled },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  },
}

export default categoryServices
