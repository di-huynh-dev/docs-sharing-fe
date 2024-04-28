import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  TextInput,
} from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Table, Row, Rows } from 'react-native-table-component'
import { AntDesign, FontAwesome6 } from '@expo/vector-icons'
import { formatDate } from '../../utils/helpers'
import Toast from 'react-native-toast-message'
import { LineChart } from 'react-native-chart-kit'
import { Feather } from '@expo/vector-icons'

const DocumentListAdmin = () => {
  const navigation = useNavigation()
  const axiosPrivate = useAxiosPrivate()
  const client = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')

  const { data: documents, isLoading: documentLoading } = useQuery({
    queryKey: ['Documents'],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/document/search?page=0&size=100&q=' + searchQuery)
        return resp.data.data.content
      } catch (error) {
        console.log(error)
        throw new Error('Failed to fetch posts')
      }
    },
  })

  const { data: documentStats, isLoading: documentStatsLoading } = useQuery({
    queryKey: ['DocumentStats'],
    queryFn: async () => {
      const res = await axiosPrivate.get('/stats/document/6month')
      return res.data.data
    },
  })

  const deleteDocMutation = useMutation({
    mutationKey: ['DeleteDocument'],
    mutationFn: async (docId) => {
      try {
        const resp = await axiosPrivate.delete(`/document/${docId}`)
        if (resp.status === 200) {
          Toast.show({
            type: 'success',
            text1: resp.data.message,
          })
          client.invalidateQueries(['Documents'])
        }
      } catch (error) {
        console.log(error)
        throw new Error('Failed to delete document')
      }
    },
  })

  const chartDataDocument = {
    labels: Array.from({ length: 6 }, (_, i) => {
      const currentDate = new Date()
      currentDate.setMonth(currentDate.getMonth() - i)
      const month = currentDate.getMonth() + 1 // 0-11
      const year = currentDate.getFullYear()
      return `${month.toString().padStart(2, '0')}/${year}`
    }).reverse(),
    datasets: [
      {
        data: documentStats,
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
  const handleSearch = () => {
    client.invalidateQueries(['Documents'])
  }
  const handleEditDoc = (docId) => {
    navigation.navigate('EditDocumentScreen', { docId })
  }

  if (documentLoading || documentStatsLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }

  const data = documents?.map((doc) => [
    doc.docId,
    doc.thumbnail ? (
      <Image source={{ uri: doc.thumbnail }} style={{ width: 50, height: 50 }} />
    ) : (
      <AntDesign name="picture" size={24} color="black" />
    ),
    doc.docName,
    formatDate(doc.uploadedAt),
    formatDate(doc.updatedAt),
    doc.totalView,
    doc.totalLikes,
    doc.downloadUrl ? (
      <TouchableOpacity onPress={() => Linking.openURL(doc.dowloadUrl)}>
        <Text className="text-blue-500">Xem</Text>
      </TouchableOpacity>
    ) : (
      <Text>Không</Text>
    ),
    doc.totalLikes,
    // doc.disabled ? (
    //   <AntDesign name="close" size={24} color="red" />
    // ) : (
    //   <AntDesign name="check" size={24} color="green" />
    // ),
    <View className="flex-row gap-2 justify-around my-1">
      <TouchableOpacity onPress={() => deleteDocMutation.mutate(doc.docId)}>
        <AntDesign name="delete" size={20} color="blue" style={{ marginRight: 10 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleEditDoc(doc.docId)}>
        <FontAwesome6 name="ban" size={20} color="red" />
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
          <Text className="text-lg font-bold">Quản lý tài liệu hệ thống</Text>
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
        <Text className="font-bold text-center my-2">Biểu đồ thống kê tài liệu được đăng 6 tháng gần đây</Text>
        {documentStats && (
          <LineChart data={chartDataDocument} width={380} height={220} chartConfig={chartConfig} bezier />
        )}
        <View className="my-2 flex-row justify-between">
          <Text className="text-sm font-bold my-2">Tổng cộng: {data.length} kết quả</Text>
        </View>
        <ScrollView horizontal={true} className="bg-white">
          <Table borderStyle={{ borderWidth: 2, borderColor: '#c8eefa' }} style={{ width: 900 }}>
            <Row
              data={[
                'Mã tài liệu',
                'Thumbnail',
                'Tên tài liệu',
                'Ngày tạo',
                'Ngày cập nhật',
                'Tổng lượt xem',
                'Tổng lượt thích',
                'Link',
                'Chia sẻ bởi',
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

export default DocumentListAdmin
