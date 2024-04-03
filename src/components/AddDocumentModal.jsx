import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, SafeAreaView } from 'react-native'
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
import documentServices from '../apis/documentServives'

const AddDocumentModal = ({ onClose }) => {
  const auth = useSelector(authSelector)
  const [fields, setFields] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [fieldId, setFieldId] = useState('')
  const [message, setMessage] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const respFields = await fieldServices.getAllFields(auth.accessToken, 0, 10)
    setFields(respFields.data.content)
    const respCategories = await categoryServices.getAllCategories(auth.accessToken, 0, 10)
    setCategories(respCategories.data.content)
  }

  const handleAddDocument = async (values) => {
    const doc = {
      docName: values.docName,
      docIntroduction: values.docIntroduction,
      categoryId: categoryId,
      fieldId: fieldId,
    }

    const formData = new FormData()
    formData.append('docName', doc)

    setIsLoading(true)
    try {
      const resp = await documentServices.addDocument(auth.accessToken, formData)
      console.log(resp)
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

  //Form checking
  const addDocumentValidationSchema = yup.object().shape({
    docName: yup.string().required('Document name is required'),
    docIntroduction: yup.string().required('Document introduction is required'),
    // viewUrl: yup.string().required('View URL is required'),
    // downloadUrl: yup.string().required('Download URL is required'),
    // thumbnail: yup.string().required('Thumbnail URL is required'),
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

          <Formik
            validationSchema={addDocumentValidationSchema}
            initialValues={{
              docName: '',
              docIntroduction: '',
              viewUrl: '',
              downloadUrl: '',
              thumbnail: '',
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

                {/* <Text className="text-[#3588f4] font-bold mb-4 mt-2">Link xem</Text> */}
                {/* <TextInput
                  autoCapitalize="none"
                  value={values.viewUrl}
                  className="flex-grow h-12 bg-[#eff8ff] rounded-xl"
                  placeholder="drive...."
                  onChangeText={handleChange('viewUrl')}
                />
                {errors.viewUrl && <Text className="text-red-500 text-sm">{errors.viewUrl}</Text>}

                <Text className="text-[#3588f4] font-bold mb-4 mt-2">Link download</Text>
                <TextInput
                  autoCapitalize="none"
                  value={values.downloadUrl}
                  className="flex-grow h-12 bg-[#eff8ff] rounded-xl"
                  placeholder="drive...."
                  onChangeText={handleChange('downloadUrl')}
                />
                {errors.downloadUrl && <Text className="text-red-500 text-sm">{errors.downloadUrl}</Text>}

                <Text className="text-[#3588f4] font-bold mb-4 mt-2">Link thumbnail</Text>
                <TextInput
                  autoCapitalize="none"
                  value={values.thumbnail}
                  className="flex-grow h-12 bg-[#eff8ff] rounded-xl"
                  placeholder="drive...."
                  onChangeText={handleChange('thumbnail')}
                /> */}
                {/* {errors.thumbnail && <Text className="text-red-500 text-sm">{errors.thumbnail}</Text>} */}

                <Text className="text-[#3588f4] font-bold mb-4 mt-2">Danh mục</Text>

                <SelectList
                  placeholder="Chọn danh mục"
                  setSelected={(val) => setCategoryId(val)}
                  data={categories.map((val) => ({ value: val.categoryName, key: val.categoryId }))}
                  save="key"
                />
                {categoryId === '' && <Text className="text-red-500 text-sm">CategoryId is required</Text>}

                <Text className="text-[#3588f4] font-bold mb-4 mt-2">Lĩnh vực</Text>
                <SelectList
                  placeholder="Chọn lĩnh vực"
                  data={fields.map((val) => ({ value: val.fieldName, key: val.fieldId }))}
                  setSelected={(val) => setFieldId(val)}
                  save="key"
                />
                {fieldId === '' && <Text className="text-red-500 text-sm">FieldId is required</Text>}

                <Text className=" text-lg font-bold text-center">{message}</Text>

                <View className="flex-row justify-end">
                  <TouchableOpacity
                    onPress={handleSubmit}
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
