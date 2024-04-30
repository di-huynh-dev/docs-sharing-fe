import {
  View,
  Text,
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AntDesign, FontAwesome6 } from '@expo/vector-icons'
import { formatDate } from '../../utils/helpers'
import { Table, Row, Rows } from 'react-native-table-component'
import Toast from 'react-native-toast-message'
import { LineChart } from 'react-native-chart-kit'
import { Feather } from '@expo/vector-icons'
import { authSelector } from '../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'

const PostListAdmin = () => {
  const navigation = useNavigation()
  const axiosPrivate = useAxiosPrivate()
  const auth = useSelector(authSelector)
  const client = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')

  const { data: posts, isLoading: postLoading } = useQuery({
    queryKey: ['Posts'],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/post/search?page=0&size=100&q=' + searchQuery)
        return resp.data.data.content
      } catch (error) {
        console.log(error)
        throw new Error('Failed to fetch posts')
      }
    },
  })

  const handleSearch = () => {
    client.invalidateQueries(['Posts'])
  }

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
  const { data: postStats, isLoading: postStatsLoading } = useQuery({
    queryKey: ['PostStats'],
    queryFn: async () => {
      const res = await axiosPrivate.get('/stats/post/6month')
      return res.data.data
    },
  })
  const chartDataPost = {
    labels: Array.from({ length: 6 }, (_, i) => {
      const currentDate = new Date()
      currentDate.setMonth(currentDate.getMonth() - i)
      const month = currentDate.getMonth() + 1
      const year = currentDate.getFullYear()
      return `${month.toString().padStart(2, '0')}/${year}`
    }).reverse(),
    datasets: [
      {
        data: postStats,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  }
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  }

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
    </View>,
  ])

  return (
    <SafeAreaView className=" bg-[#f3f3f8]">
      <ScrollView className="m-2">
        <TouchableOpacity
          className="flex-row items-center gap-2"
          onPress={() => navigation.navigate('AdminHomeScreen')}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
          <Text className="text-lg font-bold">Quản lý bài đăng hệ thống</Text>
        </TouchableOpacity>
        <View className="flex-row items-center space-x-2 p-2 rounded-lg bg-white">
          <TouchableOpacity onPress={handleSearch}>
            <Feather name="search" size={30} color="gray" />
          </TouchableOpacity>
          <TextInput
            placeholder="Nhập từ khóa tìm kiếm..."
            onChangeText={(text) => setSearchQuery(text)}
            onSubmitEditing={handleSearch}
          />
        </View>
        <Text className="font-bold text-center  my-2">Biểu đồ thống kê bài viết được đăng 6 tháng gần đây</Text>
        {postStats && (
          <LineChart
            data={chartDataPost}
            width={Dimensions.get('window').width}
            height={220}
            chartConfig={chartConfig}
            bezier
            onDataPointClick={(data) => Toast.show({ text1: `Có ${data.value} bài đăng` })}
          />
        )}
        <View>
          <Text className="text-sm font-bold my-2">Danh sách bài đăng hệ thống</Text>
          <Text>Tổng cộng: {data.length} kết quả</Text>
        </View>
        <ScrollView horizontal={true} className="bg-white">
          <Table borderStyle={{ borderWidth: 2, borderColor: '#c8eefa' }} style={{ width: 1200 }}>
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
              className="h-10 text-center bg-blue-400 text-lg font-bold"
              textStyle={{ color: 'white', textAlign: 'center' }}
            />
            <Rows data={data} style={{ height: 70 }} textStyle={{ marginLeft: 10, flex: 1, textAlign: 'center' }} />
          </Table>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PostListAdmin
