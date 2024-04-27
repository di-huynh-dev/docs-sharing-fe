import { View, Text, ActivityIndicator, TouchableOpacity, SafeAreaView, Linking, Image } from 'react-native'
import React from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import { formatDate } from '../../utils/helpers'

const DocumentReportDetail = ({ route }) => {
  const { reportId } = route.params
  const axiosPrivate = useAxiosPrivate()
  const navigation = useNavigation()

  const { data: reportDetail, isLoading: reportDetailLoading } = useQuery({
    queryKey: ['DocumentReportDetail', reportId],
    queryFn: async () => {
      const res = await axiosPrivate.get('/reports/document/' + reportId)
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
        <Text className="text-lg font-bold">Xem chi tiết tài liệu bị báo cáo</Text>
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
        <Text className="font-bold">Nội dung tài liệu</Text>
        <View className="font-bold bg-gray-100 p-2 rounded-lg">
          <Text>ID: {reportDetail.document.docId}</Text>
          <Text>Hình ảnh:</Text>
          <Image source={{ uri: reportDetail.document.thumbnail }} className="w-full h-40" />
          <Text>Tiêu đề: {reportDetail.document.docName}</Text>
          <Text>Nội dung tóm tắt: {reportDetail.document.docIntroduction}</Text>
          <View className="flex-row gap-2">
            <Text>Tệp tài liệu</Text>
            <TouchableOpacity onPress={() => Linking.openURL(reportDetail.document.downloadUrl)}>
              <Text className="text-blue-500">Xem tại đây</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default DocumentReportDetail
