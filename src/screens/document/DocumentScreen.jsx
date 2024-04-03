import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import HorizontalItem from '../../components/HorizontalItem'
import documentServices from '../../apis/documentServives'
import { authSelector } from '../../redux/reducers/userSlice'
import VerticalItem from '../../components/VerticalItem'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

const DocumentScreen = () => {
  const auth = useSelector(authSelector)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const navigation = useNavigation()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    const resDocuments = await documentServices.getAllDocuments(auth.accessToken, 0, 10)
    if (resDocuments.status == 200) {
      setData(resDocuments.data.content)
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
    <SafeAreaView className="flex-1 m-2">
      <Text className="text-lg font-bold">Nổi bật</Text>
      <FlatList
        data={data}
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

      <Text className="text-lg font-bold">Tất cả tài liệu</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({ item }) => <VerticalItem {...item} />}
        keyExtractor={(item) => item.docId}
      />
    </SafeAreaView>
  )
}

export default DocumentScreen
