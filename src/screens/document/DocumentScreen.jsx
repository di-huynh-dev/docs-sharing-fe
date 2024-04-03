import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import HorizontalItem from '../../components/HorizontalItem'
import documentServices from '../../apis/documentServives'
import { authSelector } from '../../redux/reducers/userSlice'
import VerticalItem from '../../components/VerticalItem'
import { useSelector } from 'react-redux'
import { useIsFocused, useNavigation } from '@react-navigation/native'

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
    const respDocs = await documentServices.getAllDocuments(auth.accessToken, 0, 20)
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
    <SafeAreaView className="m-2">
      <Text className="text-lg font-bold">Tất cả tài liệu</Text>
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

      <Text className="text-lg font-bold">Tài liệu của tôi</Text>
      {userDocs.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={userDocs}
          renderItem={({ item }) => <VerticalItem {...item} />}
          keyExtractor={(item) => item.docId}
        />
      ) : (
        <Text>Không có tài liệu nào</Text>
      )}
    </SafeAreaView>
  )
}

export default DocumentScreen
