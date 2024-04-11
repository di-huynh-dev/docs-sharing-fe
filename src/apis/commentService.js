import axiosClient from './axiosClient'

const commentServices = {
  getCommentListByPostId(accessToken, postId, page, size) {
    const url = `/comment/posts/${postId}?page=${page}&size=${size}`
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
  createComment(accessToken, postId, content) {
    const url = `/comment`
    return axiosClient.post(
      url,
      { content, postId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  },
  replyComment(accessToken, postId, parentCommentId, content) {
    const url = `/comment?parentCommentId=${parentCommentId}`
    return axiosClient.post(
      url,
      { content, postId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  },
  likeComment(accessToken, commentId) {
    const url = `/comment/${commentId}/like`
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
  deleteComment(accessToken, commentId) {
    const url = `/comment/${commentId}`
    return axiosClient.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
  editComment(accessToken, commentId, content, postId) {
    const url = `/comment/${commentId}`
    return axiosClient.put(
      url,
      { content, postId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  },
}

export default commentServices
