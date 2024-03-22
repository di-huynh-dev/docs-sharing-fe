import { View, Text, StyleSheet, Button, Image } from 'react-native'
import React, { useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector, removeAuth } from '../redux/reducers/userSlice'

const DrawerCustom = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const user = useSelector(authSelector)

  const handleLogout = () => {
    dispatch(removeAuth())
  }

  return (
    <View style={[localStyles.container]}>
      <View className="mb-10">
        <Image source={require('../../assets/images/no-avatar.jpg')} style={localStyles.avatar} />
        <Text className="text-xl font-bold text-center">{/* {user.profile.lastName} {user.profile.firstName} */}</Text>
      </View>
      <View>
        <TouchableOpacity className="flex-row items-center mb-4" onPress={() => navigation.navigate('Main')}>
          <AntDesign name="home" size={24} color="black" />
          <Text className="text-lg ml-2">Trang chủ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center mb-4"
          // onPress={() => navigation.navigate('Profile')}
        >
          <AntDesign name="message1" size={24} color="black" />
          <Text className="text-lg ml-2">Tin nhắn</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center mb-4" onPress={() => navigation.navigate('Document')}>
          <AntDesign name="save" size={24} color="black" />
          <Text className="text-lg ml-2">Trang Tài liệu</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center mb-4" onPress={() => navigation.navigate('Profile')}>
          <AntDesign name="user" size={24} color="black" />
          <Text className="text-lg ml-2">Trang cá nhân</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center mb-4"
          // onPress={() => navigation.navigate('Profile')}
        >
          <AntDesign name="setting" size={24} color="black" />
          <Text className="text-lg ml-2">Cài đặt</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center mb-4" onPress={() => handleLogout()}>
          <AntDesign name="logout" size={24} color="black" />
          <Text className="text-lg ml-2">Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default DrawerCustom

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 100,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listItem: {
    paddingVertical: 12,
    justifyContent: 'flex-start',
  },

  listItemText: {
    paddingLeft: 12,
  },
})
