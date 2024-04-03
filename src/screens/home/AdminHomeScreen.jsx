import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/userSlice'
import { SelectList } from 'react-native-dropdown-select-list'
import { AntDesign } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { FontAwesome6 } from '@expo/vector-icons'
import statsServices from '../../apis/statisticServices'
import { LineChart } from 'react-native-chart-kit'

const AdminHomeScreen = () => {
  const auth = useSelector(authSelector)
  const navigation = useNavigation()
  const [summary, setSumary] = useState({})
  const [documentStats, setDocumentStats] = useState(null)
  const [registrationStats, setRegistrationStats] = useState(null)
  const [postStats, setPostStats] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await statsServices.getSumary(auth.accessToken)
        setSumary(res.data)

        const docResp = await statsServices.getDocumentStats(auth.accessToken)
        setDocumentStats(docResp.data)

        const registrationResp = await statsServices.getUserRegisteredStats(auth.accessToken)
        setRegistrationStats(registrationResp.data)

        const postResp = await statsServices.getUserPostStats(auth.accessToken)
        setPostStats(postResp.data)

        setIsLoading(false)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [auth])
  const data = [1, 2, 3, 4, 5, 6]
  const chartDataDocument = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        data: documentStats,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  }
  const chartDataRegistration = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        data: registrationStats,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  }

  const chartDataPost = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
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
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="m-2" showsVerticalScrollIndicator={false}>
        <View className="my-2">
          <Text className="text-gray-500 font-bold">Chào mừng đã quay trở lại</Text>
          <Text className="text-lg font-bold">{auth.profile?.firstName}</Text>
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

        <View className="my-2">
          <Text>Biểu đồ thống kê</Text>
          <View>
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
        <View>
          <Text>Quản lý hệ thống</Text>
          <View className="flex-row justify-between gap-2 my-2">
            <TouchableOpacity className="w-1/2 shadow-lg bg-white p-4 rounded-xl">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold">Người dùng</Text>
                <View className="w-8 h-8 items-center justify-center rounded-lg bg-orange-200">
                  <AntDesign name="addusergroup" size={24} color="orange" />
                </View>
              </View>
              <Text className="text-4xl font-bold my-5">{summary.totalUsers}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-1/2 shadow-lg bg-white p-4 rounded-xl">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold">Bài viết</Text>
                <View className="w-8 h-8 items-center justify-center rounded-lg bg-green-200">
                  <AntDesign name="filetext1" size={24} color="green" />
                </View>
              </View>
              <Text className="text-4xl font-bold my-5">{summary.totalPosts}</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between gap-2 my-2">
            <TouchableOpacity className="w-1/2 shadow-lg bg-white p-4 rounded-xl">
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

          <View className="flex-row justify-between gap-2 my-2">
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
        </View>
      </ScrollView>
      {isLoading && <ActivityIndicator size="large" color="blue" />}
    </SafeAreaView>
  )
}

export default AdminHomeScreen
