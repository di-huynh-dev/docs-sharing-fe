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
  addDocument(accessToken, docName, docIntroduction, viewUrl, downloadUrl, thumbnail, categoryId, fieldId) {
    const url = '/document/create'
    return axiosClient.post(
      url,
      { docName, docIntroduction, viewUrl, downloadUrl, thumbnail, categoryId, fieldId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  },
}
export default documentServices
