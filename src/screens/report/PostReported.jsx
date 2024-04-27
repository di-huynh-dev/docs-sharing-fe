import { View, Text, ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { formatDate } from '../../utils/helpers'
import { AntDesign, Entypo } from '@expo/vector-icons'
import { Table, Row, Rows } from 'react-native-table-component'

const PostReported = () => {
  const navigation = useNavigation()
  const axiosPrivate = useAxiosPrivate()

  const { data: postReported, isLoading: postReportedLoading } = useQuery({
    queryKey: ['PostReported'],
    queryFn: async () => {
      const res = await axiosPrivate.get('/reports/post?page=0&size=100')
      return res.data.data.content
    },
  })

  if (postReportedLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }

  const data = postReported.map((report) => [
    report.reportId,
    formatDate(report.reportedAt),
    report.reportType.reason,
    report.reason,
    report.post.postId,
    <Text>
      {report.user.firstName} {report.user.lastName}
    </Text>,
    report.read ? <Text>Đã xem</Text> : <Text className="text-red-500">Chưa xem</Text>,
    <View className="flex-row gap-2 justify-around my-1">
      <TouchableOpacity onPress={() => navigation.navigate('AdminPostReportDetail', { reportId: report.reportId })}>
        <Entypo name="dots-three-horizontal" size={24} color="black" />
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
          <Text className="text-lg font-bold">Quản lý bài đăng bị báo cáo</Text>
        </TouchableOpacity>

        <View className="my-2 flex-row justify-between">
          <Text className="text-sm font-bold my-2">Tổng cộng: {data.length} kết quả</Text>
        </View>
        <ScrollView horizontal={true} className="bg-white">
          <View>
            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8eefa' }} style={{ width: 900 }}>
              <Row
                data={[
                  'Mã báo cáo',
                  'Thời gian',
                  'Lỗi báo cáo',
                  'Nội dung',
                  'Mã bài đăng',
                  'Tên người báo cáo',
                  'Trạng thái',
                  'Xem chi tiết',
                ]}
                style={{ height: 70 }}
                textStyle={{ marginLeft: 10, width: 1100 / 7 }} // Chia độ rộng đều cho số cột
              />
              <Rows data={data} textStyle={{ marginLeft: 10, width: 1100 / 7 }} />
            </Table>
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PostReported
