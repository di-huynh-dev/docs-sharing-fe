import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Button, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { SelectList } from 'react-native-dropdown-select-list'
import fieldServices from '../apis/fieldServices'
import { useSelector } from 'react-redux'
import { authSelector } from '../redux/reducers/userSlice'
import categoryServices from '../apis/categoryServices'
import { Feather } from '@expo/vector-icons'
import * as yup from 'yup'
import { Formik } from 'formik'
import Toast from 'react-native-toast-message'
import Spinner from 'react-native-loading-spinner-overlay'
import * as ImagePicker from 'expo-image-picker'
import * as DocumentPicker from 'expo-document-picker'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const AddDocumentModal = ({ onClose }) => {
  const auth = useSelector(authSelector)
  const axiosPrivate = useAxiosPrivate()
  const [fields, setFields] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [fieldId, setFieldId] = useState('')
  const [message, setMessage] = useState('')
  const [img, setImg] = useState('')
  const [docFile, setDocFile] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const uploadDocument = async () => {
    try {
      const resp = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      })
      setDocFile(resp)
    } catch (error) {}
  }
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

  const handleAddDocument = async (values) => {
    const doc = {
      docName: values.docName,
      docIntroduction: values.docIntroduction,
      categoryId: categoryId,
      fieldId: fieldId,
    }

    const formData = new FormData()
    formData.append('doc', JSON.stringify(doc))

    // if (img) {
    //   formData.append('file', {
    //     uri: img,
    //     type: 'image/png',
    //     name: 'image-doc',
    //   })
    // }

    if (docFile.assets[0].uri) {
      const audioFile = {
        name: docFile.assets[0].name.split('.')[0],
        uri: docFile.assets[0].uri,
        type: docFile.assets[0].mimeType,
        size: docFile.assets[0].size,
      }
      formData.append('file', audioFile)
    }

    setIsLoading(true)
    try {
      const resp = await axiosPrivate.post('/document/create', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log(resp.data.message)
      setIsLoading(false)
      setMessage(resp.message)
    } catch (error) {
      setIsLoading(false)
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

  const fetchData = async () => {
    const respFields = await fieldServices.getAllFields(auth.accessToken, 0, 10)
    setFields(respFields.data.content)
    const respCategories = await categoryServices.getAllCategories(auth.accessToken, 0, 10)
    setCategories(respCategories.data.content)
  }

  const addDocumentValidationSchema = yup.object().shape({
    docName: yup.string().required('Document name is required'),
    docIntroduction: yup.string().required('Document introduction is required'),
  })

  return (
    <Modal>
      <SafeAreaView>
        <ScrollView>
          <View className="m-2 flex-row gap-4 items-center p-2">
            <TouchableOpacity onPress={onClose} className="mx-4">
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-lg font-bold">Chia sẻ tài liệu</Text>
          </View>
          <Button title="Thêm tài liệu" onPress={uploadDocument} />
          <Formik
            validationSchema={addDocumentValidationSchema}
            initialValues={{
              docName: '',
              docIntroduction: '',
            }}
            onSubmit={handleAddDocument}
          >
            {({ handleChange, handleSubmit, values, errors }) => (
              <View className="m-4">
                <Text className="text-[#3588f4] font-bold mb-4 mt-2">Tên tài liệu</Text>
                <TextInput
                  autoCapitalize="none"
                  value={values.docName}
                  className="flex-grow h-12 bg-[#eff8ff] rounded-xl"
                  placeholder="Vd: Lập trình Web"
                  onChangeText={handleChange('docName')}
                />
                {errors.docName && <Text className="text-red-500 text-sm">{errors.docName}</Text>}
                <Text className="text-[#3588f4] font-bold mb-4 mt-2">Giới thiệu tài liệu</Text>
                <TextInput
                  autoCapitalize="none"
                  value={values.docIntroduction}
                  className="flex-grow h-20 bg-[#eff8ff] rounded-xl"
                  placeholder="Vd: Hướng dẫn cơ bản về lập trình web"
                  onChangeText={handleChange('docIntroduction')}
                />
                {errors.docIntroduction && <Text className="text-red-500 text-sm">{errors.docIntroduction}</Text>}

                <Text className="text-[#3588f4] font-bold mb-4 mt-2">Danh mục</Text>

                <SelectList
                  placeholder="Chọn danh mục"
                  setSelected={(val) => setCategoryId(val)}
                  data={categories.map((val) => ({ value: val.categoryName, key: val.categoryId }))}
                  save="key"
                />

                <Text className="text-[#3588f4] font-bold mb-4 mt-2">Lĩnh vực</Text>
                <SelectList
                  placeholder="Chọn lĩnh vực"
                  data={fields.map((val) => ({ value: val.fieldName, key: val.fieldId }))}
                  setSelected={(val) => setFieldId(val)}
                  save="key"
                />

                <Text className=" text-lg font-bold text-center">{message}</Text>

                <Text className="text-[#3588f4] font-bold mb-4 mt-2">Hình ảnh</Text>
                <TouchableOpacity className="flex-row gap-3" onPress={() => setModalVisible(true)}>
                  <AntDesign name="upload" size={24} color="black" />
                  <Text>Tải lên ảnh</Text>
                </TouchableOpacity>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible)
                  }}
                >
                  <View
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
                        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                          <AntDesign name="close" size={24} color="black" />
                          <Text>Đóng</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>

                {img && (
                  <View>
                    <View className="flex-row justify-between">
                      <Text className="">Ảnh được tải lên</Text>
                      <TouchableOpacity onPress={removeImage}>
                        <AntDesign name="delete" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                    <Image source={{ uri: img }} className="w-full h-80 rounded-xl" />
                  </View>
                )}
                <View className="flex-row justify-end">
                  <TouchableOpacity
                    onPress={() => handleSubmit(values)}
                    className="mt-4 bg-[#3588f4] w-14 h-14 rounded-full flex-row items-center justify-center"
                  >
                    <Feather name="send" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
        <Spinner isLoading={isLoading} />
      </SafeAreaView>
    </Modal>
  )
}

export default AddDocumentModal
