import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Button, Image } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'

import Toast from 'react-native-toast-message'
import * as ImagePicker from 'expo-image-picker'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const AddDocumentModal = ({ onClose }) => {
  const axiosPrivate = useAxiosPrivate()
  const [img, setImg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const requestImageLibraryPermission = async (mode) => {
    try {
      if (mode === 'camera') {
        await ImagePicker.requestCameraPermissionsAsync()
        let result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspects: [1, 1],
          quality: 1,
        })
        if (!result.canceled) {
          await saveImage(result.assets[0].uri)
        }
      } else {
        await ImagePicker.requestMediaLibraryPermissionsAsync()
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        })
        if (!result.canceled) {
          await saveImage(result.assets[0].uri)
        }
      }
    } catch (err) {
      console.warn('Error accessing image library:', err)
      // Handle error here
    }
  }

  const handleUploadAvatar = async () => {
    const formData = new FormData()
    if (img) {
      formData.append('avatar', {
        uri: img,
        type: 'image/png',
        name: 'image-doc',
      })
    }
    setIsLoading(true)
    try {
      const resp = await axiosPrivate.put('/users/avatar', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      })
      if (resp.status === 200) {
        setIsLoading(false)
        Toast.show({
          type: 'success',
          text1: resp.data.message,
        })
        removeImage()
        onClose()
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
      })
    }
  }

  const removeImage = () => {
    setImg('')
  }

  const saveImage = async (image) => {
    try {
      setImg(image)
    } catch (error) {}
  }

  return (
    <Modal animationType="fade" transparent={true}>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <View className="bg-white p-2 rounded-lg w-80">
          <Text className="text-center font-bold">Chọn hình ảnh</Text>
          <View className="flex-row justify-around items-center">
            <TouchableOpacity onPress={() => requestImageLibraryPermission('camera')}>
              <AntDesign name="camera" size={24} color="black" />
              <Text>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => requestImageLibraryPermission('gallery')}>
              <AntDesign name="picture" size={24} color="black" />
              <Text>Thư viện</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color="black" />
              <Text>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
        {img && (
          <View>
            <Image className="w-80 h-80 rounded-lg" source={{ uri: img }} />
            <View className="flex-row justify-around">
              <Button title="Xóa hình ảnh" onPress={removeImage} />
              <Button title={isLoading ? 'Đang xử lý' : 'Xong'} onPress={handleUploadAvatar} />
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  )
}

export default AddDocumentModal
