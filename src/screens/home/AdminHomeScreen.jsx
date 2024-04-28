import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector, removeAuth } from '../../redux/reducers/userSlice'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { FontAwesome6 } from '@expo/vector-icons'
import { formatDate } from '../../utils/helpers'
import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import Toast from 'react-native-toast-message'

const AdminHomeScreen = () => {
  const auth = useSelector(authSelector)
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [isShowModal, setIsShowModal] = useState(false)
  const axiosPrivate = useAxiosPrivate()

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['Summary'],
    queryFn: async () => {
      const res = await axiosPrivate.get('/stats/stats/summary')
      return res.data.data
    },
  })

  const logout = () => {
    dispatch(removeAuth())
    Toast.show({
      type: 'success',
      text1: 'Đăng xuất tài khoản thành công!',
    })
  }

  if (summaryLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {isShowModal && (
        <Modal transparent={true} visible={true} animationType="slide">
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
              <TouchableOpacity onPress={() => setIsShowModal(false)} style={{ alignSelf: 'flex-end' }}>
                <AntDesign name="close" size={18} color="black" />
              </TouchableOpacity>
              <Text className="text-center font-bold text-lg">Thông tin cá nhân</Text>
              <View>
                <Text>Mã người dùng:</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{auth.profile.userId}</Text>
                <Text>Họ và tên:</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                  {auth.profile.lastName} {auth.profile.firstName}
                </Text>
                <Text>Email:</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{auth.profile.email}</Text>
                <Text>Ngày sinh:</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{formatDate(auth.profile.dateOfBirth)}</Text>
              </View>
              <TouchableOpacity className="flex-row gap-2 items-center justify-center my-4 " onPress={logout}>
                <AntDesign name="logout" size={24} color="black" />
                <Text>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      <ScrollView className="m-2" showsVerticalScrollIndicator={false}>
        <View className="my-2">
          <Text className="text-gray-500 font-bold">Chào mừng đã quay trở lại</Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-xl font-bold">
              {auth.profile?.firstName} {auth.profile?.lastName}
            </Text>
            <TouchableOpacity onPress={() => setIsShowModal(true)}>
              <Entypo name="dots-three-vertical" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text>Quản lý hệ thống Docs Sharing App</Text>
          <View className="flex-row justify-between gap-2 my-1">
            <TouchableOpacity
              onPress={() => navigation.navigate('AdminUser')}
              className="w-1/2 shadow-lg bg-white p-4 rounded-xl"
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold">Người dùng</Text>
                <View className="w-8 h-8 items-center justify-center rounded-lg bg-orange-200">
                  <AntDesign name="addusergroup" size={24} color="orange" />
                </View>
              </View>
              <Text className="text-4xl font-bold my-5">{summary.totalUsers}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('PostListAdmin')}
              className="w-1/2 shadow-lg bg-white p-4 rounded-xl"
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold">Bài đăng</Text>
                <View className="w-8 h-8 items-center justify-center rounded-lg bg-green-200">
                  <AntDesign name="filetext1" size={24} color="green" />
                </View>
              </View>
              <Text className="text-4xl font-bold my-5">{summary.totalPosts}</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between gap-2 my-1">
            <TouchableOpacity
              onPress={() => navigation.navigate('DocumentListAdmin')}
              className="w-1/2 shadow-lg bg-white p-4 rounded-xl"
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold">Tài liệu</Text>
                <View className="w-8 h-8 items-center justify-center rounded-lg bg-blue-200">
                  <Feather name="book-open" size={24} color="blue" />
                </View>
              </View>
              <Text className="text-4xl font-bold my-5">{summary.totalDocuments}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-1/2 shadow-lg bg-white p-4 rounded-xl"
              onPress={() => navigation.navigate('AdminCategoryNavigator')}
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold">Danh mục</Text>
                <View className="w-8 h-8 items-center justify-center rounded-lg bg-red-200">
                  <Entypo name="text" size={24} color="red" />
                </View>
              </View>
              <Text className="text-4xl font-bold my-5">{summary.totalCategories}</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between gap-2 my-1">
            <TouchableOpacity
              className="w-1/2 shadow-lg bg-white p-4 rounded-xl"
              onPress={() => navigation.navigate('AdminTagNavigator')}
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold">Thẻ</Text>
                <View className="w-8 h-8 items-center justify-center rounded-lg bg-purple-200">
                  <AntDesign name="tagso" size={24} color="purple" />
                </View>
              </View>
              <Text className="text-4xl font-bold my-5">{summary.totalTags}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-1/2 shadow-lg bg-white p-4 rounded-xl"
              onPress={() => navigation.navigate('AdminFieldNavigator')}
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold">Lĩnh vực</Text>
                <View className="w-8 h-8 items-center justify-center rounded-lg bg-purple-200">
                  <FontAwesome6 name="people-line" size={24} color="black" />
                </View>
              </View>
              <Text className="text-4xl font-bold my-5">{summary.totalFields}</Text>
            </TouchableOpacity>
          </View>
          <Text>Báo cáo vi phạm</Text>
          <View className="flex-row justify-between gap-2 my-1">
            <TouchableOpacity
              className="w-1/2 shadow-lg bg-white p-4 rounded-xl"
              onPress={() => navigation.navigate('AdminDocumentReported')}
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold">Tài liệu</Text>
                <View className="w-8 h-8 items-center justify-center rounded-lg bg-orange-200">
                  <MaterialIcons name="report" size={24} color="orange" />
                </View>
              </View>
              <Text className="text-4xl font-bold my-5">{summary.totalTags}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-1/2 shadow-lg bg-white p-4 rounded-xl"
              onPress={() => navigation.navigate('AdminPostReported')}
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold">Bài đăng</Text>
                <View className="w-8 h-8 items-center justify-center rounded-lg bg-red-200">
                  <MaterialIcons name="report-problem" size={24} color="red" />
                </View>
              </View>
              <Text className="text-4xl font-bold my-5">{summary.totalFields}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AdminHomeScreen
