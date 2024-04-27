import { View, Text, ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity, Image, Linking } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Table, Row, Rows } from 'react-native-table-component'
import { AntDesign, FontAwesome6 } from '@expo/vector-icons'
import { formatDate } from '../../utils/helpers'
import Toast from 'react-native-toast-message'

const DocumentListAdmin = () => {
  const navigation = useNavigation()
  const axiosPrivate = useAxiosPrivate()
  const client = useQueryClient()

  const { data: documents, isLoading: documentLoading } = useQuery({
    queryKey: ['Documents'],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/document/search?page=0&size=100&order=oldest')
        return resp.data.data.content
      } catch (error) {
        console.log(error)
        throw new Error('Failed to fetch posts')
      }
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

  const handleEditDoc = (docId) => {
    navigation.navigate('EditDocumentScreen', { docId })
  }

  if (documentLoading) {
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
