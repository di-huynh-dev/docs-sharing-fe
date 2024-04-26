import axiosClient from './axiosClient'

const documentServices = {
  getAllUserDocuments(accessToken, page, size) {
    const url = '/document/user/documents?page=' + page + '&size=' + size
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
  getAllDocuments(accessToken, page, size) {
    const url = '/document/all?page=' + page + '&size=' + size
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
  addDocument(accessToken, formData) {
    const url = '/document/create'
    return axiosClient.post(url, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  updateDocument(accessToken, docId, docName, docIntroduction, viewUrl, downloadUrl, thumbnail, categoryId, fieldId) {
    const url = '/document/' + docId
    return axiosClient.put(
      url,
      { docName, docIntroduction, viewUrl, downloadUrl, thumbnail, categoryId, fieldId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  },
  deleteDocument(accessToken, docId) {
    const url = '/document/' + docId
    return axiosClient.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },

  likeDocument(accessToken, docId) {
    const url = '/document/' + docId + '/like'
    return axiosClient.post(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
}
export default documentServices
