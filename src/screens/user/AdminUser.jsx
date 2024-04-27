import { View, Text, ActivityIndicator, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AntDesign } from '@expo/vector-icons'
import { formatDate } from '../../utils/helpers'
import { Table, Row, Rows } from 'react-native-table-component'
import Toast from 'react-native-toast-message'

const AdminUser = () => {
  const navigation = useNavigation()
  const axiosPrivate = useAxiosPrivate()
  const client = useQueryClient()
  const { data: userList, isLoading: userListLoading } = useQuery({
    queryKey: ['UserList'],
    queryFn: async () => {
      const res = await axiosPrivate.get('/users/all?page=0&size=100')
      return res.data.data.content
    },
  })

  const deleteUserMutation = useMutation({
    mutationKey: ['DeleteUser'],
    mutationFn: async (userId) => {
      try {
        const resp = await axiosPrivate.delete(`/users/${userId}`)
        if (resp.status === 200) {
          Toast.show({
            type: 'success',
            text1: resp.data.message,
          })
          client.invalidateQueries(['UserList'])
        }
      } catch (error) {
        console.log(error)
        throw new Error('Failed to delete document')
      }
    },
  })
  if (userListLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }

  const data = userList.map((user) => [
    user.userId,
    <Text>
      {user.firstName} {user.lastName}
    </Text>,
    user.email,
    user.gender === 0 ? <Text>Nam</Text> : <Text>Nữ</Text>,
    formatDate(user.createdAt),
    formatDate(user.updatedAt),
    user.role.roleName,
    user.disabled ? (
      <AntDesign name="close" size={24} color="red" />
    ) : (
      <AntDesign name="check" size={24} color="green" />
    ),
    <View className="flex-row gap-2 justify-around my-1">
      <TouchableOpacity onPress={() => deleteUserMutation.mutate(user.userId)}>
        <AntDesign name="delete" size={20} color="red" style={{ marginRight: 10 }} />
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
                'Mã người dùng',
                'Họ và tên',
                'Email',
                'Giới tính',
                'Ngày tạo',
                'Ngày cập nhật',
                'Vai trò',
                'Trạng thái tài khoản',
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

export default AdminUser
