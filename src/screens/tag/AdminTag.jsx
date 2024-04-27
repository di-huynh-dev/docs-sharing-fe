import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native'
import React, { useEffect } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { Table, Row, Rows } from 'react-native-table-component'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import Spinner from 'react-native-loading-spinner-overlay'
import { useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/userSlice'
import { formatDate } from '../../utils/helpers'
import tagServices from '../../apis/tagServices'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const AdminTag = () => {
  // const [tagList, setTagList] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const auth = useSelector(authSelector)
  const navigation = useNavigation()
  const axiosPrivate = useAxiosPrivate()
  const client = useQueryClient()

  const { data: tagList, isLoading: tagListLoading } = useQuery({
    queryKey: ['TagListAdmin'],
    queryFn: async () => {
      const res = await axiosPrivate.get('/tag/all?page=0&size=100')
      return res.data.data.content
    },
  })

  const handleDeleteTag = async (tagId) => {
    try {
      const resp = await tagServices.deleteTag(auth.accessToken, tagId)
      if (resp.status === 200) {
        Toast.show({
          type: 'success',
          text1: resp.message,
        })
        client.invalidateQueries(['TagListAdmin'])
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

  const handleEditTag = (tagId) => {
    navigation.navigate('UpdateTagScreen', { tagId })
  }
  if (tagListLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }
  const data = tagList.map((tag) => [
    tag.tagId.toString(),
    tag.name,
    formatDate(tag.createdAt),
    formatDate(tag.updatedAt),
    tag.totalUses.toString(),
    tag.disabled ? (
      <AntDesign name="close" size={24} color="red" />
    ) : (
      <AntDesign name="check" size={24} color="green" />
    ),
    <View className="flex-row gap-2 justify-around my-1">
      <TouchableOpacity onPress={() => handleDeleteTag(tag.tagId)}>
        <AntDesign name="delete" size={20} color="red" style={{ marginRight: 10 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleEditTag(tag.tagId)}>
        <AntDesign name="edit" size={20} color="blue" />
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
          <Text className="text-lg font-bold">Quản lý danh mục tài liệu</Text>
        </TouchableOpacity>
        <View className="my-2 flex-row justify-between">
          <Text className="text-sm font-bold my-2">Tổng cộng: {data.length} kết quả</Text>
          <TouchableOpacity
            className="bg-[#ffffff] rounded-xl h-14 w-14 justify-center"
            onPress={() => navigation.navigate('AddTagScreen')}
          >
            <View className="flex-row items-center justify-center gap-2">
              <AntDesign name="plus" size={24} color="gray" />
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal={true} className="bg-white">
          <View>
            <Table
              borderStyle={{ borderWidth: 2, borderColor: '#c8eefa' }}
              style={{ width: 1200 }}
              flexArr={[1, 2, 2, 2, 2, 2, 1]}
            >
              <Row
                data={['Mã thẻ', 'Tên thẻ', 'Ngày tạo', 'Ngày cập nhật', 'Tổng người dùng', 'Trạng thái', 'Thao tác']}
                style={{ height: 70 }}
                textStyle={{ marginLeft: 10 }} // Chia độ rộng đều cho số cột
              />
              <Rows data={data} textStyle={{ marginLeft: 10, width: 1100 / 7 }} />
            </Table>
          </View>
        </ScrollView>
      </ScrollView>
      <Spinner visible={isLoading} />
    </SafeAreaView>
  )
}

export default AdminTag
