import { View, Text, TouchableOpacity, Image, ScrollView, Modal, TextInput, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/userSlice'
import { AntDesign } from '@expo/vector-icons'
import { Feather, Entypo, MaterialIcons } from '@expo/vector-icons'
import commentServices from '../../apis/commentService'
import { formatDate } from '../../utils/helpers'
import Toast from 'react-native-toast-message'
import { useNavigation } from '@react-navigation/native'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { EvilIcons } from '@expo/vector-icons'
import CommentRender from '../../components/CommentRender'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const PostDetail = ({ route }) => {
  const { postId } = route.params

  const axiosPrivate = useAxiosPrivate()
  const auth = useSelector(authSelector)

  const client = useQueryClient()
  const [selectedCommentId, setSelectedCommentId] = useState(null)
  const [content, setContent] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalReplyVisible, setIsModalReplyVisible] = useState(false)
  const [modalActionsVisible, setModalActionsVisible] = useState(false)
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false)
  const [isMoreOptionsVisible, setIsMoreOptionsVisible] = useState(false)
  const [modalCommentOptions, setModalCommentOptions] = useState(false)
  const [modalPrivateOptions, setModalPrivateOptions] = useState(false)

  const navigation = useNavigation()

  const { data: postDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['PostDetail', postId],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/post/' + postId)
        return resp.data.data
      } catch (error) {
        throw new Error('Failed to fetch posts')
      }
    },
  })

  const deletePostMutation = useMutation({
    mutationFn: async () => {
      const resp = await axiosPrivate.delete('/post/' + postId)
      return resp
    },
    onSuccess: (resp) => {
      Toast.show({
        type: 'success',
        text1: resp.data.message,
      })
      navigation.goBack()
      setModalPrivateOptions(false)
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: async () => {
      const resp = await axiosPrivate.delete('/comment/' + selectedCommentId)
      return resp
    },
    onSuccess: (resp) => {
      Toast.show({
        type: 'success',
        text1: resp.data.message,
      })
      client.invalidateQueries(['PostComments', postId])
      setModalCommentOptions(false)
    },
  })

  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: ['PostComments', postId],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/comment/posts/' + postId + '?page=0&size=100')
        return resp.data.data.content
      } catch (error) {
        throw new Error('Failed to fetch posts')
      }
    },
  })

  const likePostMutation = useMutation({
    mutationFn: async () => {
      const resp = await axiosPrivate.post('/post/' + postId + '/like')
      return resp
    },
    onSuccess: (resp) => {
      client.invalidateQueries(['PostDetail', postId])
      Toast.show({
        type: 'success',
        text1: resp.data.message,
      })
    },
  })

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  const toggleModalReply = (commentId) => {
    setSelectedCommentId(commentId)
    setIsModalReplyVisible(!isModalReplyVisible)
  }

  const toggleModalCommentOptions = (commentId) => {
    setSelectedCommentId(commentId)
    setModalCommentOptions(!modalCommentOptions)
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
        client.invalidateQueries(['PostComments', postId])
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
      if (resp.status === 200) {
        Toast.show({
          type: 'success',
          text1: resp.message,
        })
        setContent('')
        toggleModalReply()
        client.invalidateQueries(['PostComments', postId])
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
        Toast.show({
          type: 'success',
          text1: resp.message,
        })
        client.invalidateQueries(['PostComments', postId])
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
        client.invalidateQueries(['PostComments', postId])
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

  if (isLoadingDetail || isLoadingComments) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }

  return (
    <View className=" flex-1 bg-white mx-2 my-2 rounded-2xl ">
      <View className="mx-2 flex-row items-center p-2">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>

        {auth.profile.email === postDetail.user.email ? (
          <View className="flex-1">
            <Text className="text-lg font-bold text-center">Bài viết của bạn</Text>
          </View>
        ) : (
          <View className="flex-1">
            <Text className="text-lg font-bold text-center">
              Bài viết của {postDetail?.user.lastName} {postDetail?.user.firstName}
            </Text>
          </View>
        )}
      </View>

      {/* Post detail */}
      <View className="bg-gray-100 p-2 rounded-lg">
        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={() => navigation.navigate('OtherUserProfileScreen', { user: postDetail.user })}
            className="flex-row items-center space-x-3"
          >
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
          </TouchableOpacity>

          <Modal
            transparent={true}
            visible={isMoreOptionsVisible}
            onRequestClose={() => {
              setIsMoreOptionsVisible(false)
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}
              onPress={toggleModal}
            >
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '40%' }}>
                <TouchableOpacity
                  onPress={() => {
                    deletePostMutation.mutate()
                  }}
                  className="flex-row gap-2"
                >
                  <AntDesign name="delete" size={24} color="black" />
                  <Text style={{ fontSize: 14 }}>Xóa bài viết</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          {auth.profile.email === postDetail.user.email && (
            <TouchableOpacity className="mx-4" onPress={() => setModalPrivateOptions(true)}>
              <Entypo name="dots-three-horizontal" size={24} color="#99A1BE" />
            </TouchableOpacity>
          )}
          <Modal
            transparent={true}
            visible={modalPrivateOptions}
            onRequestClose={() => {
              setModalPrivateOptions(false)
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}
              onPress={toggleModal}
            >
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '40%' }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('UpdatePostScreen', { postId: postId })}
                  className="flex-row gap-2"
                >
                  <Entypo name="edit" size={24} color="black" />
                  <Text style={{ fontSize: 14, marginBottom: 20 }}>Chỉnh sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deletePostMutation.mutate()} className="flex-row gap-2">
                  <AntDesign name="delete" size={24} color="black" />
                  <Text style={{ fontSize: 14 }}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
        <View className="my-3  rounded-xl p-2 ">
          <View>
            <Text className="text-base font-bold mb-3">{postDetail?.title}</Text>
            <Text className="text-sm text-gray-500">{postDetail?.content}</Text>
            {postDetail?.postImages && postDetail?.postImages.length > 0 && (
              <Image source={{ uri: postDetail?.postImages[0].url }} className="w-full h-80 rounded-lg my-2" />
            )}
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
      </View>

      {/*Modal more option Comments */}
      <Modal
        transparent={true}
        visible={modalCommentOptions}
        onRequestClose={() => {
          setModalCommentOptions(false)
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
          onPress={toggleModal}
        >
          <View className="bg-white p-4 border border-gray-300 rounded-lg w-[40%]">
            <TouchableOpacity
              onPress={() => {
                setModalUpdateVisible(true)
              }}
              className="flex-row gap-2 items-center  my-1"
            >
              <AntDesign name="edit" size={24} color="black" />
              <Text style={{ fontSize: 14 }}>Chỉnh sửa </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                deleteCommentMutation.mutate()
              }}
              className="flex-row gap-2 items-center  my-1"
            >
              <AntDesign name="delete" size={24} color="black" />
              <Text style={{ fontSize: 14 }}>Xóa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalCommentOptions(false)
              }}
              className="flex-row gap-2 items-center my-1"
            >
              <AntDesign name="close" size={24} color="black" />
              <Text style={{ fontSize: 14 }}>Hủy </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* Action */}
      <View className="flex-row items-center space-x-2 my-2  border border-gray-200 p-2 rounded-xl">
        <TouchableOpacity onPress={() => likePostMutation.mutate()} className="flex-row items-center">
          {postDetail?.liked === true ? (
            <View className="flex-row items-center">
              <EvilIcons name="like" size={32} color="blue" />
              <Text className="text-blue-700 font-bold">Đã thích</Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              <EvilIcons name="like" size={28} color="black" />
              <Text>Thích</Text>
            </View>
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

      <ScrollView>
        {comments?.length > 0 ? (
          comments.map((comment) => (
            <CommentRender
              key={comment.commentId}
              comment={comment}
              toggleModalCommentOptions={toggleModalCommentOptions}
              handleLikeComment={handleLikeComment}
              handleReplyComment={handleReplyComment}
              toggleModalReply={toggleModalReply}
              setModalActionsVisible={setModalActionsVisible}
              setSelectedCommentId={setSelectedCommentId}
              auth={auth}
            />
          ))
        ) : (
          <Text className="text-center">Chưa có bình luận nào</Text>
        )}
      </ScrollView>
    </View>
  )
}

export default PostDetail
