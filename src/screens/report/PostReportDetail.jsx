import { View, Text, ActivityIndicator, TouchableOpacity, SafeAreaView, Linking, Image } from 'react-native'
import React from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import { formatDate } from '../../utils/helpers'

const PostReportDetail = ({ route }) => {
  const { reportId } = route.params
  const axiosPrivate = useAxiosPrivate()
  const navigation = useNavigation()

  const { data: reportDetail, isLoading: reportDetailLoading } = useQuery({
    queryKey: ['PostReportDetail', reportId],
    queryFn: async () => {
      const res = await axiosPrivate.get('/reports/post/' + reportId)
      return res.data.data
    },
  })

  if (reportDetailLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }
  return (
    <SafeAreaView className=" mx-2">
      <TouchableOpacity className="flex-row items-center gap-2" onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="black" />
        <Text className="text-lg font-bold">Xem chi tiết bài đăng bị báo cáo</Text>
      </TouchableOpacity>
      <View>
        <Text className="font-bold">
          Báo cáo bởi: {reportDetail.user.firstName} {reportDetail.user.lastName} ({reportDetail.user.email})
        </Text>
        <Text className="italic">Thời gian: {formatDate(reportDetail.reportedAt)}</Text>
      </View>
      <View>
        <Text className="font-bold">Loại báo cáo</Text>
        <Text className="font-bold bg-gray-100 p-2 rounded-lg">{reportDetail.reportType.reason}</Text>
      </View>
      <View>
        <Text className="font-bold">Lý do báo cáo</Text>
        <Text className="font-bold bg-gray-100 p-2 rounded-lg">{reportDetail.reason}</Text>
      </View>
      <View>
        <Text className="font-bold">Nội dung bài đăng</Text>
        <View className="font-bold bg-gray-100 p-2 rounded-lg">
          <Text>ID: {reportDetail.post.postId}</Text>
          {reportDetail.post.postImages.length > 0 && (
            <View>
              <Text>Hình ảnh:</Text>
              <Image source={{ uri: reportDetail.post.postImages[0].url }} className="w-full h-40" />
            </View>
          )}

          <Text>Tiêu đề: {reportDetail.post.title}</Text>
          <Text>Nội dung : {reportDetail.post.content}</Text>
          <Text>Thời gian: {formatDate(reportDetail.post.createdAt)}</Text>
          <Text>Tài khoản: {reportDetail.post.user.email} </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default PostReportDetail
