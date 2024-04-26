import { View, Text, Image, SafeAreaView, ScrollView, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import Toast from 'react-native-toast-message'
import { formatDate } from '../../utils/helpers'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const DocumentDetailScreen = ({ route }) => {
  const item = route.params.itemData
  const navigation = useNavigation()
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
      <View className="flex-row gap-2 items-center">
        <TouchableOpacity onPress={() => navigation.navigate('PostListScreen')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold leading-snug">Chi tiết tài liệu</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text className="font-bold">
            Tải lên bởi: {item.user.firstName} {item.user.lastName}
          </Text>
          <Text className="italic">Thời gian: {formatDate(item.uploadedAt)}</Text>
          <Text className="italic">Tổng lượt xem: {item.totalView}</Text>
        </View>
        <View>
          <Text className="font-bold">Tên tài liệu</Text>
          <Text className="font-bold bg-gray-100 p-2 rounded-lg">{item.docName}</Text>
        </View>
        <Image source={{ uri: item.thumbnail }} className="w-full h-[400px] my-2" resizeMode="cover" />
        <View>
          <Text className="font-bold">Giới thiệu về tài liệu</Text>
          <Text className=" bg-gray-100 p-2 rounded-lg">{item.docIntroduction}</Text>
        </View>
        <View>
          <Text className="font-bold">Tệp tài liệu</Text>
          <TouchableOpacity onPress={handleDownload}>
            <Text className="text-blue-500">Download tại đây</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text className="font-bold">Danh mục</Text>
          <Text className=" bg-gray-100 p-2 rounded-lg">{item.category.categoryName}</Text>
        </View>
        <View>
          <Text className="font-bold">Lĩnh vực</Text>
          <Text className=" bg-gray-100 p-2 rounded-lg">{item.field.fieldName}</Text>
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
