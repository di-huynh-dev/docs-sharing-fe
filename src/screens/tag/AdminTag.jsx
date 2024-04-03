import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native'
import React, { useEffect } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { Table, Row, Rows } from 'react-native-table-component'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import Spinner from 'react-native-loading-spinner-overlay'
import categoryServices from '../../apis/categoryServices'
import { useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/userSlice'
import { formatDate } from '../../utils/helpers'
import tagServices from '../../apis/tagServices'

const AdminTag = () => {
  const [tagList, setTagList] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const auth = useSelector(authSelector)
  const navigation = useNavigation()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const resp = await tagServices.getAllTags(auth.accessToken, 0, 100)
        if (resp.status === 200) {
          setTagList(resp.data.content)
          setIsLoading(false)
        } else {
          Toast.show({
            type: 'success',
            text1: resp.message,
          })
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [navigation])

  const handleDeleteTag = async (tagId) => {
    try {
      const resp = await tagServices.deleteTag(auth.accessToken, tagId)
      if (resp.status === 200) {
        Toast.show({
          type: 'success',
          text1: resp.message,
        })
        const updatedTagList = tagList.filter((tag) => tag.categoryId !== tagId)
        setTagList(updatedTagList)
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
