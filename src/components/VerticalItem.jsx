import { View, Text, Image, TouchableOpacity, Modal } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { authSelector } from '../redux/reducers/userSlice'
import { useSelector } from 'react-redux'
import documentServices from '../apis/documentServives'
import Toast from 'react-native-toast-message'
import { formatDate } from '../utils/helpers'

const VerticalItem = ({
  docId,
  docName,
  docIntroduction,
  totalLikes,
  totalView,
  thumbnail,
  viewUrl,
  downloadUrl,
  uploadedAt,
  user,
  category,
  field,
}) => {
  const item = {
    docId,
    docName,
    docIntroduction,
    totalLikes,
    totalView,
    thumbnail,
    viewUrl,
    uploadedAt,
    downloadUrl,
    user,
    category,
    field,
  }
  const auth = useSelector(authSelector)
  const navigation = useNavigation()
  const [isShowModal, setIsShowModal] = useState(false)

  const handleDelete = async () => {
    try {
      const resp = await documentServices.deleteDocument(auth.accessToken, docId)
      setIsShowModal(false)
      if (resp.status == 200) {
        Toast.show({
          type: 'success',
          text1: resp.message,
        })
      } else {
        Toast.show({
          type: 'error',
          text1: resp.message,
        })
      }
    } catch (error) {}
  }
  return (
    <TouchableOpacity onPress={() => navigation.navigate('DocumentDetailScreen', { itemData: item })}>
      <View className="mx-2 rounded-lg my-4 border-b-[0.2px] w-full shadow-xl ">
        {isShowModal && (
          <Modal transparent={true} visible={true} animationType="slide">
            <View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
              <View className="bg-white p-4 mx-2 rounded-xl">
                <Text>Bạn có chắc chắn muốn xóa tài liệu này?</Text>
                <View className="flex-row gap-2 justify-center my-2">
                  <TouchableOpacity className="bg-red-500 p-2 rounded-xl " onPress={handleDelete}>
                    <Text className="text-white">Xác nhận</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-[#dadada] p-2 rounded-xl " onPress={() => setIsShowModal(false)}>
                    <Text>Hủy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
        <View className="flex-row items-center gap-2">
          <Image className="w-16 h-20 rounded-lg" source={{ uri: thumbnail }}></Image>
          <View className="flex-1">
            <Text className="text-blue-800">{formatDate(uploadedAt)}</Text>
            <Text numberOfLines={2} ellipsizeMode="tail" className="text-lg font-medium">
              {docName}
            </Text>
            <View className="flex-row gap-2 items-center">
              <View className="flex-row gap-2 justify-start">
                <AntDesign name="heart" size={16} color="pink" />
                <Text className="">{totalLikes}</Text>
              </View>
              <View className="flex-row gap-2 justify-start ">
                <AntDesign name="eye" size={16} color="pink" />
                <Text className="">{totalView}</Text>
              </View>
              {/* <TouchableOpacity
              className="flex-row gap-2 justify-start "
              onPress={() => navigation.navigate('EditDocumentScreen', { docId })}
            >
              <AntDesign name="edit" size={16} color="blue" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row gap-2 justify-start " onPress={() => setIsShowModal(true)}>
              <AntDesign name="delete" size={16} color="blue" />
            </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default VerticalItem
