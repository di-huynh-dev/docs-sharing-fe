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
  addField(accessToken, fieldName, disabled) {
    const url = '/field/create'
    return axiosClient.post(
      url,
      { fieldName, disabled },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  },
  deleteField(accessToken, fieldId) {
    const url = '/field/' + fieldId
    return axiosClient.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },

  updateField(accessToken, fieldId, fieldName, disabled) {
    const url = '/field/' + fieldId
    return axiosClient.put(
      url,
      { fieldName, disabled },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  },
}

export default fieldServices
