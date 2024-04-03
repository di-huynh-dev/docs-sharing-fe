import { View, Text, Button, StatusBar, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { globalStyles } from '../../styles/globalStyles'
import { appColors } from '../../constants/appColors'
import { Feather } from '@expo/vector-icons'
import { Octicons } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/userSlice'
const HomeScreen = () => {
  const navigation = useNavigation()
  const auth = useSelector(authSelector)
  return (
    <View style={[globalStyles.container]}>
      <StatusBar barStyle={'light-content'} />
      {/* Header */}
      <View
        style={{
          backgroundColor: appColors.primary,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <View className="flex-row justify-between items-center p-4">
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Feather name="align-left" size={35} color="white" />
          </TouchableOpacity>
          <Text className="italic text-white text-lg font-medium">Sharing Docs</Text>
          <View className="flex items-center justify-center">
            <TouchableOpacity className="bg-[#F1F4F5] w-[35px] h-[35px] rounded-full flex items-center justify-center">
              <Octicons name="bell-fill" size={18} color="#2D3F7B" />
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-center text-white">Bạn muốn tìm kiếm tài liệu gì?</Text>
        <View className="flex-row justify-between p-5 items-center">
          <View className="flex-row items-center space-x-2">
            <Feather name="search" size={30} color="white" />
            <TextInput placeholder="| Tìm kiếm.." className="text-lg text-white" />
          </View>

          <View>
            <TouchableOpacity className="flex-row bg-[#5D56F3] rounded-full items-center py-1 px-3 space-x-2">
              <Ionicons name="filter-circle" size={26} color="white" />
              <Text className="text-white">Bộ lọc</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Body */}
    </View>
  )
}

export default HomeScreen
