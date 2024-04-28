import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { Table, Row, Rows } from 'react-native-table-component'
import categoryServices from '../../apis/categoryServices'
import { useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/userSlice'
import { formatDate } from '../../utils/helpers'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Feather } from '@expo/vector-icons'

const AdminCategory = () => {
  const auth = useSelector(authSelector)
  const navigation = useNavigation()
  const axiosPrivate = useAxiosPrivate()
  const client = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')

  const { data: categoryList, isLoading: categoryListLoading } = useQuery({
    queryKey: ['CategoryListAdmin'],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/category/search?page=0&size=100&q=' + searchQuery)
      return resp.data.data.content
    },
  })

  const handleDeleteCategory = async (categoryId) => {
    try {
      const resp = await categoryServices.deleteCategory(auth.accessToken, categoryId)
      if (resp.status === 200) {
        Toast.show({
          type: 'success',
          text1: resp.message,
        })
        client.invalidateQueries(['CategoryListAdmin'])
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

  const handleEditCategory = (categoryId) => {
    navigation.navigate('UpdateCategoryScreen', { categoryId })
  }

  const handleSearch = () => {
    client.invalidateQueries(['CategoryListAdmin'])
  }

  if (categoryListLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }
  const data = categoryList?.map((category) => [
    category.categoryId.toString(),
    category.categoryName,
    formatDate(category.createdAt),
    formatDate(category.updatedAt),
    category.totalUses.toString(),
    category.disabled ? (
      <AntDesign name="close" size={24} color="red" />
    ) : (
      <AntDesign name="check" size={24} color="green" />
    ),
    <View className="flex-row gap-2 justify-around my-1">
      <TouchableOpacity onPress={() => handleDeleteCategory(category.categoryId)}>
        <AntDesign name="delete" size={20} color="red" style={{ marginRight: 10 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleEditCategory(category.categoryId)}>
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
        <View className="my-2 flex-row justify-between">
          <Text className="text-sm font-bold my-2">Tổng cộng: {data.length} kết quả</Text>
          <TouchableOpacity
            className="bg-[#ffffff] rounded-xl h-14 w-14 justify-center"
            onPress={() => navigation.navigate('AddCategoryScreen')}
          >
            <View className="flex-row items-center justify-center gap-2">
              <AntDesign name="plus" size={24} color="gray" />
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal={true} className="bg-white">
          <View>
            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8eefa' }} style={{ width: 900 }}>
              <Row
                data={[
                  'Mã danh mục',
                  'Tên danh mục',
                  'Ngày tạo',
                  'Ngày cập nhật',
                  'Tổng người dùng',
                  'Trạng thái',
                  'Thao tác',
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

export default AdminCategory
