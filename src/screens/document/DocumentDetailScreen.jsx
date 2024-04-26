import { View, Text, Image, SafeAreaView, ScrollView, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'
import documentServices from '../../apis/documentServives'
import { authSelector } from '../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'
import Toast from 'react-native-toast-message'
import { formatDate } from '../../utils/helpers'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const DocumentDetailScreen = ({ route }) => {
  const item = route.params.itemData
  const axiosPrivate = useAxiosPrivate()

  const handleLike = async () => {
    try {
      const resp = await axiosPrivate.post('/document/' + item.docId + '/like')
      if (resp.status == 200) {
        Toast.show({
          type: 'success',
          text1: '👍' + resp.data.message,
        })
      } else {
        Toast.show({
          type: 'info',
          text1: '👎' + resp.message,
        })
      }
    } catch (error) {}
  }

  const handleDownload = () => {
    const downloadLink = item.downloadUrl
    Linking.openURL(downloadLink)
  }
  return (
    <SafeAreaView className="flex-1 m-2">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-bold text-center">{item.docName}</Text>
        <Image source={{ uri: item.thumbnail }} className="w-full h-[200px] my-2" resizeMode="cover" />
        <Text className="mb-10 text-justify">{item.docIntroduction}</Text>
        <Text className="font-bold">Thông tin về tài liệu:</Text>
        <View className="mx-2">
          <TouchableOpacity onPress={handleDownload}>
            <Text className="text-blue-500">Download tại đây</Text>
          </TouchableOpacity>
          <Text className="italic">
            Tải lên bởi: {item.user.firstName} {item.user.lastName}
          </Text>
          <Text className="italic">Danh mục: {item.category.categoryName}</Text>
          <Text className="italic">Lĩnh vực: {item.field.fieldName}</Text>
          <Text className="italic">Thời gian: {formatDate(item.uploadedAt)}</Text>
          <Text className="italic">Tổng lượt xem: {item.totalView}</Text>
        </View>
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
