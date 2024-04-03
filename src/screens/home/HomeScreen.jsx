import { View, Text, Button, StatusBar, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { globalStyles } from '../../styles/globalStyles'
import { appColors } from '../../constants/appColors'
import { Feather } from '@expo/vector-icons'
import { Octicons } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/userSlice'
import postServices from '../../apis/postServices'
import Entypo from 'react-native-vector-icons/Entypo'
import { AntDesign } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'

const HomeScreen = () => {
  const navigation = useNavigation()
  const auth = useSelector(authSelector)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const resp = await postServices.getAllPost(auth.accessToken, 0, 10)
      if (resp.status === 200) {
        setPosts(resp.data.content)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleLikePost = async (postId) => {
    try {
      const resp = await postServices.likePost(auth.accessToken, postId)
      if (resp.status === 200) {
        Toast.show({
          type: 'success',
          text1: resp.message,
        })
        fetchData()
      }
    } catch (error) {}
  }
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
      <FlatList
        className="flex-1 mb-5"
        data={posts}
        renderItem={({ item }) => {
          return (
            <View className="bg-white mx-5 rounded-2xl p-3 my-2">
              <View className="flex-row justify-between">
                <View className="flex-row items-center space-x-3">
                  {item.user.image ? (
                    <Image source={{ uri: item.user.image }} style={{ width: 70, height: 70, borderRadius: 50 }} />
                  ) : (
                    <AntDesign name="user" size={24} color="black" />
                  )}
                  <Text className="text-base font-bold">{item.user.firstName}</Text>
                </View>

                <View className="flex items-center justify-center">
                  <TouchableOpacity className="bg-[#F1F4F5] w-[40px] h-[40px] rounded-full flex items-center justify-center">
                    <Entypo name="dots-three-horizontal" size={24} color="#99A1BE" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="mt-5">
                <Text className="text-base font-bold mb-3">{item.title}</Text>

                <Text className="text-sm text-gray-500">{item.content}</Text>
              </View>

              <View className="flex-row justify-between mt-5 mb-2">
                <View className="flex-row space-x-4">
                  <TouchableOpacity onPress={() => handleLike(item.postId)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity onPress={() => handleLikePost(item.postId)}>
                        {item.liked === true ? (
                          <AntDesign name="heart" size={24} color="#f75050" style={{ marginRight: 5 }} />
                        ) : (
                          <AntDesign name="hearto" size={24} color="#f75050" style={{ marginRight: 5 }} />
                        )}
                      </TouchableOpacity>
                      <Text>{item.totalLikes}</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity className="flex-row items-center space-x-2">
                    <Entypo name="chat" size={24} color="#bbb" />
                    <Text> Bình luận</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity className="flex-row items-center space-x-2">
                  <Entypo name="share" size={24} color="#bbb" />
                  <Text>11</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }}
      ></FlatList>
    </View>
  )
}

export default HomeScreen
