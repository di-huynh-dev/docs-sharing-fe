import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector, removeAuth } from '../../redux/reducers/userSlice'
import { SelectList } from 'react-native-dropdown-select-list'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { FontAwesome6 } from '@expo/vector-icons'
import { LineChart } from 'react-native-chart-kit'
import { formatDate } from '../../utils/helpers'
import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const AdminHomeScreen = () => {
  const auth = useSelector(authSelector)

  const navigation = useNavigation()
  const [isShowModal, setIsShowModal] = useState(false)
  const axiosPrivate = useAxiosPrivate()
  const dispatch = useDispatch()

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['Summary'],
    queryFn: async () => {
      const res = await axiosPrivate.get('/stats/stats/summary')
      return res.data.data
    },
  })

  const { data: documentStats, isLoading: documentStatsLoading } = useQuery({
    queryKey: ['DocumentStats'],
    queryFn: async () => {
      const res = await axiosPrivate.get('/stats/document/6month')
      return res.data.data
    },
  })
  const { data: registrationStats, isLoading: registrationStatsLoading } = useQuery({
    queryKey: ['RegistrationStats'],
    queryFn: async () => {
      const res = await axiosPrivate.get('/stats/registration/6month')
      return res.data.data
    },
  })
  const { data: postStats, isLoading: postStatsLoading } = useQuery({
    queryKey: ['PostStats'],
    queryFn: async () => {
      const res = await axiosPrivate.get('/stats/post/6month')
      return res.data.data
    },
  })

  const logout = () => {
    dispatch(removeAuth())
  }
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
  const chartDataRegistration = {
    labels: Array.from({ length: 6 }, (_, i) => {
      const currentDate = new Date()
      currentDate.setMonth(currentDate.getMonth() - i)
      const month = currentDate.getMonth() + 1 // 0-11
      const year = currentDate.getFullYear()
      return `${month.toString().padStart(2, '0')}/${year}`
    }).reverse(),
    datasets: [
      {
        data: registrationStats,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  }

  const chartDataPost = {
    labels: Array.from({ length: 6 }, (_, i) => {
      const currentDate = new Date()
      currentDate.setMonth(currentDate.getMonth() - i)
      const month = currentDate.getMonth() + 1 // 0-11
      const year = currentDate.getFullYear()
      return `${month.toString().padStart(2, '0')}/${year}`
    }).reverse(),
    datasets: [
      {
        data: postStats,
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
  if (documentStatsLoading || registrationStatsLoading || postStatsLoading || summaryLoading) {
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

        <View className="flex-row justify-between items-center">
          <Text>Chọn tháng, năm</Text>
          <SelectList
            placeholder="Tháng"
            data={[...Array(12)].map((_, index) => ({
              label: String(index + 1).padStart(2, '0'),
              value: index + 1,
            }))}
            value={new Date().getMonth() + 1}
            onSelect={() => {}}
          />
          <SelectList
            placeholder="Năm"
            data={[...Array(100)].map((_, index) => ({
              label: String(new Date().getFullYear() - index),
              value: new Date().getFullYear() - index,
            }))}
            value={new Date().getFullYear()}
            onSelect={() => {}}
          />
        </View>

        <View>
          <Text>Quản lý hệ thống</Text>
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

        <View className="my-2">
          <Text>Biểu đồ thống kê</Text>
          <View className="items-center">
            <Text className="font-bold text-center my-2">Biểu đồ thống kê tài liệu được đăng 6 tháng gần đây</Text>
            {documentStats && (
              <LineChart data={chartDataDocument} width={350} height={220} chartConfig={chartConfig} bezier />
            )}

            <Text className="font-bold text-center  my-2">Biểu đồ thống kê người dùng đăng ký 6 tháng gần đây</Text>
            {registrationStats && (
              <LineChart data={chartDataRegistration} width={350} height={220} chartConfig={chartConfig} bezier />
            )}
            <Text className="font-bold text-center  my-2">Biểu đồ thống kê bài viết được đăng 6 tháng gần đây</Text>
            {postStats && <LineChart data={chartDataPost} width={350} height={220} chartConfig={chartConfig} bezier />}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AdminHomeScreen
