import { View, Text, ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { formatDate } from '../../utils/helpers'
import { AntDesign } from '@expo/vector-icons'
import { Table, Row, Rows } from 'react-native-table-component'
import { Entypo } from '@expo/vector-icons'

const DocumentReported = () => {
  const navigation = useNavigation()
  const axiosPrivate = useAxiosPrivate()

  const { data: docReported, isLoading: docReportedLoading } = useQuery({
    queryKey: ['DocumentReported'],
    queryFn: async () => {
      const res = await axiosPrivate.get('/reports/document?page=0&size=100')
      return res.data.data.content
    },
  })

  if (docReportedLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }

  const data = docReported.map((report) => [
    report.reportId,
    formatDate(report.reportedAt),
    report.reportType.reason,
    report.reason,
    report.document.docId,
    <Text>
      {report.user.firstName} {report.user.lastName}
    </Text>,
    report.read ? <Text className="text-green-500">Đã xem</Text> : <Text className="text-red-500">Chưa xem</Text>,
    <View className="flex-row gap-2 justify-around my-1">
      <TouchableOpacity onPress={() => navigation.navigate('AdminDocumentReportDetail', { reportId: report.reportId })}>
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
          <Text className="text-lg font-bold">Quản lý tài liệu bị báo cáo</Text>
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
                  'Mã tài liệu',
                  'Reporter',
                  'Trạng thái',
                  'Xem chi tiết',
                ]}
                className="h-10 text-center bg-blue-400 text-lg font-bold"
                textStyle={{ color: 'white', textAlign: 'center' }}
              />
              <Rows data={data} style={{ height: 50 }} textStyle={{ marginLeft: 10, flex: 1, textAlign: 'center' }} />
            </Table>
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DocumentReported
