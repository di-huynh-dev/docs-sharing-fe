import { View, Text, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import HorizontalItem from '../../components/HorizontalItem'
import { globalStyles } from '../../styles/globalStyles'
import documentServices from '../../apis/documentServives'
import { authSelector } from '../../redux/reducers/userSlice'
import VerticalItem from '../../components/VerticalItem'
import { useSelector } from 'react-redux'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { appColors } from '../../constants/appColors'
import { Feather } from '@expo/vector-icons'
import { Octicons } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native-gesture-handler'

const DocumentScreen = () => {
  const auth = useSelector(authSelector)
  const [isLoading, setIsLoading] = useState(false)
  const [userDocs, setUserDocs] = useState([])
  const [docs, setDocs] = useState([])
  const navigation = useNavigation()
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      fetchData()
    }
  }, [isFocused])

  const fetchData = async () => {
    setIsLoading(true)
    const resUserDocuments = await documentServices.getAllUserDocuments(auth.accessToken, 0, 20)
    const respDocs = await documentServices.getAllDocuments(auth.accessToken, 0, 10)
    if (resUserDocuments.status == 200 && respDocs.status == 200) {
      setUserDocs(resUserDocuments.data.content)
      setDocs(respDocs.data.content)
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }

  const handleItemPress = (item) => {
    // Navigate to DocumentDetailScreen and pass item data
    navigation.navigate('DocumentDetailScreen', { itemData: item })
  }

  return (
    <SafeAreaView style={[globalStyles.container]}>
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
      <View className="mx-5">
        <Text className="text-lg font-bold">Nổi bật</Text>
        {docs.length > 0 ? (
          <FlatList
            data={docs}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.docId}
            contentContainerStyle={{
              paddingHorizontal: 8,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleItemPress(item)}>
                <View
                  style={{
                    width: 150,
                    height: 200,
                  }}
                >
                  <HorizontalItem {...item} />
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text>Không có tài liệu nào</Text>
        )}

        <Text className="text-lg font-bold">Tất cả tài liệu</Text>
        {docs.length > 0 ? (
          <FlatList
            className="mr-2"
            showsVerticalScrollIndicator={false}
            data={docs}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleItemPress(item)}>
                <VerticalItem {...item} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.docId}
          />
        ) : (
          <Text>Không có tài liệu nào</Text>
        )}
      </View>
    </SafeAreaView>
  )
}

export default DocumentScreen
