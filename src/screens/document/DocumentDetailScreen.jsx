import { View, Text, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'
import documentServices from '../../apis/documentServives'
import { authSelector } from '../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'
import Toast from 'react-native-toast-message'

const DocumentDetailScreen = ({ route }) => {
  const item = route.params.itemData
  const auth = useSelector(authSelector)
  const handleLike = async () => {
    try {
      const resp = await documentServices.likeDocument(auth.accessToken, item.docId)
      if (resp.status == 200) {
        if (resp.message === 'Like document successfully') {
          Toast.show({
            type: 'success',
            text1: '👍' + resp.message,
          })
        } else {
          Toast.show({
            type: 'info',
            text1: '👎' + resp.message,
          })
        }
      }
    } catch (error) {}
  }
  return (
    <SafeAreaView className="flex-1 m-2">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-bold text-center">{item.docName}</Text>
        <Image source={{ uri: item.thumbnail }} className="w-full h-[200px] my-2" resizeMode="cover" />
        <Text className="mb-10 text-justify">{item.docIntroduction}</Text>

        <Text className="italic">
          Tải lên bởi: {item.user.firstName} {item.user.lastName}
        </Text>
        <Text className="italic">Thời gian: {item.uploadedAt}</Text>
        <Text className="italic">Lượt xem: {item.totalView}</Text>
        <View className="flex-row my-10 items-center justify-center">
          <TouchableOpacity
            className="flex-row items-center gap-2 rounded-lg border border-red-500 p-2 justify-center"
            onPress={handleLike}
          >
            <Text className="text-lg font-bold">Yêu thích</Text>
            <AntDesign name="heart" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DocumentDetailScreen
