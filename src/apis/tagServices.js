import axiosClient from './axiosClient'

const tagServices = {
  getAllTags(accessToken, page, size) {
    const url = '/tag/all?page=' + page + '&size=' + size
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
  addTag(accessToken, name) {
    const url = '/tag/create'
    return axiosClient.post(
      url,
      { name },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  },
  deleteTag(accessToken, tagId) {
    const url = '/tag/' + tagId
    return axiosClient.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },

  updateTag(accessToken, tagId, name) {
    const url = '/tag/' + tagId
    return axiosClient.put(
      url,
      { name },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  },
}

export default tagServices
