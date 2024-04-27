import { View, Text, ActivityIndicator, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AntDesign, FontAwesome6 } from '@expo/vector-icons'
import { formatDate } from '../../utils/helpers'
import { Table, Row, Rows } from 'react-native-table-component'
import Toast from 'react-native-toast-message'

const PostListAdmin = () => {
  const navigation = useNavigation()
  const axiosPrivate = useAxiosPrivate()
  const client = useQueryClient()

  const { data: posts, isLoading: postLoading } = useQuery({
    queryKey: ['Posts'],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/post/all?page=0&size=100&order=oldest')
        return resp.data.data.content
      } catch (error) {
        console.log(error)
        throw new Error('Failed to fetch posts')
      }
    },
  })
  const deletePostMutation = useMutation({
    mutationKey: ['DeletePost'],
    mutationFn: async (docId) => {
      try {
        const resp = await axiosPrivate.delete(`/post/${docId}`)
        if (resp.status === 200) {
          Toast.show({
            type: 'success',
            text1: resp.data.message,
          })
          client.invalidateQueries(['Posts'])
        }
      } catch (error) {
        console.log(error)
        throw new Error('Failed to delete document')
      }
    },
  })
  if (postLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }

  const data = posts?.map((post) => [
    post.postId,
    post.postImages.length > 0 ? (
      <Image source={{ uri: post.postImages[0].url }} style={{ width: 50, height: 50 }} />
    ) : (
      <AntDesign name="picture" size={24} color="black" />
    ),
    post.title,
    formatDate(post.createdAt),
    formatDate(post.updatedAt),
    post.totalComments,
    post.totalLikes,
    post.user.firstName,

    <View className="flex-row gap-2 justify-around my-1">
      <TouchableOpacity onPress={() => deletePostMutation.mutate(post.postId)}>
        <AntDesign name="delete" size={20} color="blue" style={{ marginRight: 10 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleEditpost(doc.docId)}>
        <FontAwesome6 name="ban" size={20} color="red" />
      </TouchableOpacity>
    </View>,
  ])

  return (
    <SafeAreaView className=" bg-[#f3f3f8]">
      <ScrollView className="m-2">
        <TouchableOpacity
          className="flex-row items-center gap-2"
          onPress={() => navigation.navigate('DocumentListAdmin')}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
          <Text className="text-lg font-bold">Quản lý tài liệu hệ thống</Text>
        </TouchableOpacity>

        <View className="my-2 flex-row justify-between">
          <Text className="text-sm font-bold my-2">Tổng cộng: {data.length} kết quả</Text>
        </View>
        <ScrollView horizontal={true} className="bg-white">
          <Table borderStyle={{ borderWidth: 2, borderColor: '#c8eefa' }} style={{ width: 900 }}>
            <Row
              data={[
                'Mã bài đăng',
                'Thumbnail',
                'Tiêu đề',
                'Ngày tạo',
                'Ngày cập nhật',
                'Tổng lượt bình luận',
                'Tổng lượt thích',
                'Người tạo',
                'Thao tác',
              ]}
              style={{
                height: 70,
                display: 'flex',
              }}
              textStyle={{ marginLeft: 10, flex: 1 }}
            />
            <Rows data={data} style={{ height: 70 }} textStyle={{ marginLeft: 10, flex: 1 }} />
          </Table>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PostListAdmin
