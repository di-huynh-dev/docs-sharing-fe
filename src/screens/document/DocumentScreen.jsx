import { View, Text, ScrollView, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import HorizontalItem from '../../components/HorizontalItem'
import documentServices from '../../apis/documentServives'
import { useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/userSlice'
import VerticalItem from '../../components/VerticalItem'

const DocumentScreen = () => {
  const auth = useSelector(authSelector)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    const resDocuments = await documentServices.getAllDocuments(auth.accessToken, 0, 10)
    if (resDocuments.status === '200') {
      setData(resDocuments.data.content)
      setIsLoading(false)
    }
  }

  return (
    <ScrollView className="m-2">
      <View className="">
        <View>
          <Text className="text-lg font-bold">Nổi bật</Text>

          <FlatList
            data={data}
            horizontal={true}
            renderItem={({ item }) => <HorizontalItem {...item} />}
            keyExtractor={(item) => item.docId}
          />
        </View>
        <View>
          <Text className="text-lg font-bold">Tất cả tài liệu</Text>

          <FlatList
            data={data}
            renderItem={({ item }) => <VerticalItem {...item} />}
            keyExtractor={(item) => item.docId}
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default DocumentScreen
