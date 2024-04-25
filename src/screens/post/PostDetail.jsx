import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, Modal, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/userSlice'
import postServices from '../../apis/postServices'
import Entypo from 'react-native-vector-icons/Entypo'
import { AntDesign } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import Spinner from 'react-native-loading-spinner-overlay'
import commentServices from '../../apis/commentService'
import { formatDate } from '../../utils/helpers'
import Toast from 'react-native-toast-message'
import { useNavigation } from '@react-navigation/native'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { EvilIcons } from '@expo/vector-icons'
import CommentRender from '../../components/CommentRender'

const PostDetail = ({ route }) => {
  const { postId, shouldRefresh } = route.params
  const [isLoading, setIsLoading] = useState(false)
  const axiosPrivate = useAxiosPrivate()
  const auth = useSelector(authSelector)
  const [postDetail, setPostDetail] = useState(null)
  const [comments, setComments] = useState(null)

  const [selectedCommentId, setSelectedCommentId] = useState(null)
  const [content, setContent] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalReplyVisible, setIsModalReplyVisible] = useState(false)
  const [modalActionsVisible, setModalActionsVisible] = useState(false)
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false)

  const navigation = useNavigation()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const respPostDetail = await axiosPrivate.get('/post/' + postId)
      const respComment = await axiosPrivate.get(`/comment/posts/${postId}?page=0&size=100`)
      if (respPostDetail.status === 200 && respComment.status === 200) {
        setPostDetail(respPostDetail.data.data)
        setComments(respComment.data.data)
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  const toggleModalReply = (commentId) => {
    setSelectedCommentId(commentId)
    setIsModalReplyVisible(!isModalReplyVisible)
  }

  const handleViewAllReplies = (commentId) => {
    setSelectedCommentId(commentId)
  }

  const handleCreateComment = async () => {
    try {
      const resp = await commentServices.createComment(auth.accessToken, postId, content)
      if (resp.status === 200) {
        Toast.show({
          type: 'success',
          text1: resp.message,
        })
        setContent('')
        toggleModal()
        fetchData()
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
      })
    }
  }

  const handleReplyComment = async () => {
    try {
      const resp = await commentServices.replyComment(auth.accessToken, postId, selectedCommentId, content)
      console.log(resp)
      if (resp.status === 200) {
        Toast.show({
          type: 'success',
          text1: resp.message,
        })
        setContent('')
        toggleModalReply()
        fetchData()
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
      })
    }
  }

  const handleLikeComment = async (commentId) => {
    try {
      const resp = await commentServices.likeComment(auth.accessToken, commentId)
      if (resp.status === 200) {
        fetchData()
      }
    } catch (error) {}
  }

  const handleLikePost = async () => {
    try {
      const resp = await postServices.likePost(auth.accessToken, postId)
      if (resp.status === 200) {
        fetchData()
      }
    } catch (error) {}
  }

  const handleDeleteComment = async (commentId) => {
    try {
      const resp = await commentServices.deleteComment(auth.accessToken, commentId)
      if (resp.status === 200) {
        Toast.show({
          type: 'success',
          text1: resp.message,
        })
        fetchData()
      }
    } catch (error) {}
  }

  const handleEditComment = async () => {
    try {
      const resp = await commentServices.editComment(auth.accessToken, selectedCommentId, content, postId)
      if (resp.status === 200) {
        Toast.show({
          type: 'success',
          text1: resp.message,
        })
        fetchData()
        setContent('')
        setModalUpdateVisible(false)
      } else {
        Toast.show({
          type: 'error',
          text1: resp.message,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (isLoading) {
    return (
      <View>
        <Spinner visible={isLoading} />
      </View>
    )
  }

  return (
    <View className=" flex-1 bg-white mx-5 my-2 rounded-2xl">
      <View className="m-2 flex-row gap-4 items-center p-2">
        <TouchableOpacity className="mx-4" onPress={() => navigation.navigate('PostListScreen')}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">
          Bài viết của {postDetail?.user.lastName} {postDetail?.user.firstName}
        </Text>
      </View>
      {/* Post detail */}
      <View className="flex-row items-center space-x-3">
        {postDetail && postDetail?.user.image ? (
          <Image source={{ uri: postDetail?.user.image }} style={{ width: 40, height: 40, borderRadius: 50 }} />
        ) : (
          <Image source={require('../../../assets/images/no-avatar.jpg')} className="w-10 h-10 rounded-full" />
        )}
        <View className="">
          <Text className="text-base font-bold">
            {postDetail?.user.lastName} {postDetail?.user.firstName}
          </Text>
          <Text className="text-sm text-gray-500">{formatDate(postDetail?.createdAt)}</Text>
        </View>
      </View>
      <View className="my-3 border rounded-xl p-2 border-gray-200">
        <View>
          <Text className="text-base font-bold mb-3">{postDetail?.title}</Text>
          <Text className="text-sm text-gray-500">{postDetail?.content}</Text>
        </View>

        <View className="flex-row justify-end">
          <View className="flex-row space-x-3">
            <View>
              <View style={{ flexDirection: 'row', alignpostDetails: 'center' }}>
                <EvilIcons name="heart" size={28} color="black" />
                <Text>{postDetail?.totalLikes}</Text>
              </View>
            </View>

            <TouchableOpacity className="flex-row items-center" onPress={toggleModal}>
              <EvilIcons name="comment" size={28} color="black" />
              <Text>{postDetail?.totalComments}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Action */}
      <View className="flex-row items-center space-x-2 my-2">
        <TouchableOpacity onPress={() => handleLikePost()} className="flex-row items-center">
          {postDetail?.liked === true ? (
            <>
              <EvilIcons name="like" size={32} color="blue" />
              <Text className="text-blue-500 font-bold">Thích</Text>
            </>
          ) : (
            <>
              <EvilIcons name="like" size={28} color="black" />
              <Text>Thích</Text>
            </>
          )}
        </TouchableOpacity>
        <View className="flex-row items-center">
          <EvilIcons name="comment" size={28} color="black" />
          <Text>Bình luận</Text>
        </View>
      </View>
      {/* Update comment */}
      <Modal
        transparent={true}
        visible={modalUpdateVisible}
        onRequestClose={() => {
          setModalUpdateVisible(false)
        }}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <TouchableOpacity
              style={{ position: 'absolute', top: 10, right: 10 }}
              onPress={() => setModalUpdateVisible(false)}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            <View className="m-2">
              <Text>Nhập bình luận</Text>
              <TextInput
                className="flex-grow w-full border border-gray-200 rounded-xl h-20 p-4 mt-2"
                placeholder="Bình luận của bạn"
                value={content}
                onChangeText={(text) => setContent(text)}
              />
            </View>
            <View className="flex-row ">
              <TouchableOpacity className="mt-2 w-2/3 m-auto" onPress={handleEditComment}>
                <View className="bg-[#5669ff] rounded-xl h-14 justify-center items-center">
                  <Text className="text-white">Cập nhật</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* rep comment */}
      <Modal
        transparent={true}
        visible={isModalReplyVisible}
        onRequestClose={() => {
          toggleModalReply()
        }}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10 }} onPress={toggleModalReply}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            <View className="m-2">
              <Text>Nhập bình luận</Text>
              <TextInput
                className="flex-grow w-full border border-gray-200 rounded-xl h-20 p-4 mt-2"
                placeholder="Bình luận của bạn"
                value={content}
                onChangeText={(text) => setContent(text)}
              />
            </View>
            <View className="flex-row ">
              <TouchableOpacity className="mt-2 w-2/3 m-auto" onPress={handleReplyComment}>
                <View className="bg-[#5669ff] rounded-xl h-14 justify-center items-center">
                  <Text className="text-white">Đăng</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View className="border-b border-gray-300 my-2"></View>
      <View className="flex-row justify-between items-center gap-2">
        {auth.profile.image ? (
          <Image source={{ uri: auth.profile.image }} style={{ width: 40, height: 40, borderRadius: 50 }} />
        ) : (
          <Image source={require('../../../assets/images/no-avatar.jpg')} className="w-10 h-10 rounded-full" />
        )}

        <TextInput
          className="flex-grow border border-gray-200 rounded-xl h-20 p-2 mt-2"
          placeholder="Bình luận với vai trò của bạn"
          value={content}
          onChangeText={(text) => setContent(text)}
        />
        <TouchableOpacity onPress={handleCreateComment}>
          <Feather name="send" size={24} color="blue" />
        </TouchableOpacity>
      </View>
      {/* List comment */}
      {/* <ScrollView>
        {comments === null ? (
          <Text>Không có bình luận nào</Text>
        ) : (
          <>
            {comments?.content.map((comment) => (
              <View key={comment.commentId} className="mt-2">
                <View className="flex-row gap-2">
                  <View className="flex-row ">
                    {comment.user.image ? (
                      <Image source={{ uri: comment.user.image }} className="w-10 h-10 rounded-full" />
                    ) : (
                      <Image
                        source={require('../../../assets/images/no-avatar.jpg')}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                  </View>
                  <View className="flex">
                    <View className="flex-row gap-2 items-center justify-between">
                      <Text className="text-base font-bold">
                        {comment.user.firstName} {comment.user.lastName}
                        {comment.user.userId === auth.profile.userId ? ' (Bạn)' : ''}
                      </Text>
                    </View>
                    <Text className="text-sm my-1">{comment.content}</Text>
                    <View className="flex-row gap-2 items-center">
                      <Text className="text-gray-500 text-xs">{formatDate(comment.createdAt)}</Text>
                      <TouchableOpacity onPress={() => handleLikeComment(comment.commentId)}>
                        {comment.liked === false ? (
                          <Text className="text-blue-500">
                            <AntDesign name="like2" size={18} color="blue" />
                          </Text>
                        ) : (
                          <Text className="text-blue-500">
                            <AntDesign name="dislike2" size={18} color="red" />
                          </Text>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedCommentId(comment.commentId)
                          toggleModalReply()
                        }}
                      >
                        <Text className="text-blue-500">
                          <Entypo name="reply" size={18} color="blue" />
                        </Text>
                      </TouchableOpacity>

                      {comment.user.userId === auth.profile.userId && (
                        <>
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedCommentId(comment.commentId)
                              setModalActionsVisible(true)
                            }}
                          >
                            <Feather name="more-vertical" size={18} color="black" />
                          </TouchableOpacity>
                          <Modal
                            animationType="fade"
                            transparent={true}
                            visible={modalActionsVisible && selectedCommentId === comment.commentId}
                            onRequestClose={() => {
                              setModalActionsVisible(false)
                            }}
                          >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                              <View className="bg-[#f7f7f7] rounded-lg w-30%">
                                <TouchableOpacity
                                  onPress={() => {
                                    setModalUpdateVisible(true)
                                    setSelectedCommentId(comment.commentId)
                                    setModalActionsVisible(false)
                                  }}
                                  className="p-3 border-b border-gray-200 flex-row gap-2 items-center"
                                >
                                  <AntDesign name="edit" size={12} color="black" />
                                  <Text>Chỉnh sửa</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    handleDeleteComment(comment.commentId)
                                    setModalActionsVisible(false)
                                  }}
                                  className="p-3 border-b border-gray-200 flex-row gap-2 items-center"
                                >
                                  <AntDesign name="delete" size={12} color="black" />
                                  <Text>Xóa </Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setModalActionsVisible(false)} style={{ padding: 10 }}>
                                  <Text>Hủy</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </Modal>
                        </>
                      )}
                    </View>

                    {comment.childComments.length > 0 && (
                      <>
                        {comment.childComments.map((childComment) => (
                          <View key={childComment.commentId} style={{ marginLeft: 10 }}>
                            <View key={childComment.commentId} className="mt-2">
                              <View className="flex-row gap-2">
                                <View className="flex-row ">
                                  {childComment.user.image ? (
                                    <Image
                                      source={{ uri: childComment.user.image }}
                                      className="w-10 h-10 rounded-full"
                                    />
                                  ) : (
                                    <Image
                                      source={require('../../../assets/images/no-avatar.jpg')}
                                      className="w-10 h-10 rounded-full"
                                    />
                                  )}
                                </View>
                                <View className="flex">
                                  <View className="flex-row gap-2 items-center justify-between">
                                    <Text className="text-base font-bold">
                                      {childComment.user.firstName} {childComment.user.lastName}
                                      {childComment.user.userId === auth.profile.userId ? ' (Bạn)' : ''}
                                    </Text>
                                  </View>
                                  <Text className="text-sm my-1">{childComment.content}</Text>
                                  <View className="flex-row gap-2 items-center">
                                    <Text className="text-gray-500 text-xs">{formatDate(childComment.createdAt)}</Text>
                                    <TouchableOpacity onPress={() => handleLikeComment(childComment.commentId)}>
                                      {childComment.liked === false ? (
                                        <Text className="text-blue-500">
                                          <AntDesign name="like2" size={18} color="blue" />
                                        </Text>
                                      ) : (
                                        <Text className="text-blue-500">
                                          <AntDesign name="dislike2" size={18} color="red" />
                                        </Text>
                                      )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() => {
                                        setSelectedCommentId(childComment.commentId)
                                        toggleModalReply()
                                      }}
                                    >
                                      <Text className="text-blue-500">
                                        <Entypo name="reply" size={18} color="blue" />
                                      </Text>
                                    </TouchableOpacity>

                                    {childComment.user.userId === auth.profile.userId && (
                                      <>
                                        <TouchableOpacity
                                          onPress={() => {
                                            setSelectedCommentId(childComment.commentId)
                                            setModalActionsVisible(true)
                                          }}
                                        >
                                          <Feather name="more-vertical" size={18} color="black" />
                                        </TouchableOpacity>
                                        <Modal
                                          animationType="fade"
                                          transparent={true}
                                          visible={modalActionsVisible && selectedCommentId === childComment.commentId}
                                          onRequestClose={() => {
                                            setModalActionsVisible(false)
                                          }}
                                        >
                                          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <View className="bg-[#f7f7f7] rounded-lg w-30%">
                                              <TouchableOpacity
                                                onPress={() => {
                                                  setModalUpdateVisible(true)
                                                  setSelectedCommentId(childComment.commentId)
                                                  setModalActionsVisible(false)
                                                }}
                                                className="p-3 border-b border-gray-200 flex-row gap-2 items-center"
                                              >
                                                <AntDesign name="edit" size={12} color="black" />
                                                <Text>Chỉnh sửa</Text>
                                              </TouchableOpacity>
                                              <TouchableOpacity
                                                onPress={() => {
                                                  handleDeleteComment(childComment.commentId)
                                                  setModalActionsVisible(false)
                                                }}
                                                className="p-3 border-b border-gray-200 flex-row gap-2 items-center"
                                              >
                                                <AntDesign name="delete" size={12} color="black" />
                                                <Text>Xóa </Text>
                                              </TouchableOpacity>

                                              <TouchableOpacity
                                                onPress={() => setModalActionsVisible(false)}
                                                style={{ padding: 10 }}
                                              >
                                                <Text>Hủy</Text>
                                              </TouchableOpacity>
                                            </View>
                                          </View>
                                        </Modal>
                                      </>
                                    )}
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        ))}
                      </>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView> */}
      <ScrollView>
        {comments === null ? (
          <Text>Không có bình luận nào</Text>
        ) : (
          <>
            {comments.content.map((comment) => (
              <View key={comment.commentId}>
                {CommentRender(
                  comment,
                  handleLikeComment,
                  handleReplyComment,
                  toggleModalReply,
                  setModalActionsVisible,
                  setSelectedCommentId,
                  auth,
                  modalActionsVisible,
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  )
}

export default PostDetail
