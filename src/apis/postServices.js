import axiosClient from './axiosClient'

const postServices = {
  getAllPost(accessToken, page, size) {
    const url = '/post/all?page=' + page + '&size=' + size
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },

  getPostDetail(accessToken, postId) {
    const url = '/post/' + postId
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },

  likePost(accessToken, postId) {
    const url = '/post/' + postId + '/like'
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
  getLikedPosts(accessToken, page, size) {
    const url = '/post/liked?page=' + page + '&size=' + size
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
}

export default postServices
