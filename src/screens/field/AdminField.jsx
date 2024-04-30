import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { Table, Row, Rows } from 'react-native-table-component'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/userSlice'
import fieldServices from '../../apis/fieldServices'
import { formatDate } from '../../utils/helpers'
import Toast from 'react-native-toast-message'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Feather } from '@expo/vector-icons'

const AdminField = () => {
  const auth = useSelector(authSelector)

  const navigation = useNavigation()
  const axiosPrivate = useAxiosPrivate()
  const client = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')

  const { data: fieldList, isLoading: fieldListLoading } = useQuery({
    queryKey: ['FieldListAdmin'],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/field/search?page=0&size=100&q=' + searchQuery)
      return resp.data.data.content
    },
  })

  const handleDeleteField = async (fieldId) => {
    try {
      const resp = await fieldServices.deleteField(auth.accessToken, fieldId)
      if (resp.status === 200) {
        Toast.show({
          type: 'success',
          text1: resp.message,
        })
        client.invalidateQueries(['FieldListAdmin'])
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
  const handleSearch = () => {
    client.invalidateQueries(['FieldListAdmin'])
  }

  const handleEditField = (fieldId) => {
    navigation.navigate('UpdateFieldScreen', { fieldId })
  }

  if (fieldListLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }
  const data = fieldList.map((field) => [
    field.fieldId.toString(),
    field.fieldName,
    formatDate(field.createdAt),
    formatDate(field.updatedAt),
    field.totalUses.toString(),
    field.disabled ? (
      <AntDesign name="close" size={24} color="red" />
    ) : (
      <AntDesign name="check" size={24} color="green" />
    ),
    <View className="flex-row gap-2 justify-around my-1">
      <TouchableOpacity onPress={() => handleDeleteField(field.fieldId)}>
        <AntDesign name="delete" size={20} color="red" style={{ marginRight: 10 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleEditField(field.fieldId)}>
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
          <Text className="text-lg font-bold">Quản lý lĩnh vực </Text>
        </TouchableOpacity>

        <View className="flex-row justify-between">
          <View className="flex-row items-center space-x-2 p-2 rounded-lg bg-white  w-4/5">
            <TouchableOpacity onPress={handleSearch}>
              <Feather name="search" size={30} color="gray" />
            </TouchableOpacity>
            <TextInput
              placeholder="Nhập từ khóa tìm kiếm..."
              onChangeText={(text) => setSearchQuery(text)}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity
            className="bg-[#ffffff] rounded-xl h-14 w-14 justify-center"
            onPress={() => navigation.navigate('AddFieldScreen')}
          >
            <View className="flex-row items-center justify-center gap-2">
              <AntDesign name="plus" size={24} color="gray" />
            </View>
          </TouchableOpacity>
        </View>
        <View className="my-2 flex-row justify-between">
          <Text className="text-sm font-bold my-2">Tổng cộng: {data.length} kết quả</Text>
        </View>
        <ScrollView horizontal={true} className="bg-white">
          <Table borderStyle={{ borderWidth: 2, borderColor: '#c8eefa' }} style={{ width: 900 }}>
            <Row
              data={[
                'Mã lĩnh vực',
                'Tên lĩnh vực',
                'Ngày tạo',
                'Ngày cập nhật',
                'Tổng người dùng',
                'Trạng thái',
                'Thao tác',
              ]}
              className="h-10 text-center bg-blue-400 text-lg font-bold"
              textStyle={{ color: 'white', textAlign: 'center' }}
            />
            <Rows data={data} style={{ height: 50 }} textStyle={{ marginLeft: 10, flex: 1, textAlign: 'center' }} />
          </Table>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AdminField
