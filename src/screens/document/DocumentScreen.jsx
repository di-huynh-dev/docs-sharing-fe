import { View, Text, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import HorizontalItem from '../../components/HorizontalItem'
import { globalStyles } from '../../styles/globalStyles'
import { authSelector } from '../../redux/reducers/userSlice'
import VerticalItem from '../../components/VerticalItem'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { appColors } from '../../constants/appColors'
import { Feather } from '@expo/vector-icons'
import { Octicons } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { AntDesign } from '@expo/vector-icons'

const DocumentScreen = () => {
  const auth = useSelector(authSelector)
  const navigation = useNavigation()
  const client = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const [refreshing, setRefreshing] = useState(false)

  const { data: documents, isLoading: documentLoading } = useQuery({
    queryKey: ['Documents'],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/document/search?page=0&size=100&order=newest')
        return resp.data.data.content
      } catch (error) {
        console.log(error)
        throw new Error('Failed to fetch posts')
      }
    },
  })

  const { data: topList, isLoading: topListLoading } = useQuery({
    queryKey: ['TopList'],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/document/top10')
        return resp.data.data
      } catch (error) {
        console.log(error)
        throw new Error('Failed to fetch posts')
      }
    },
  })
  const onRefresh = () => {
    setRefreshing(true)
    client.invalidateQueries(['Documents'])
    setRefreshing(false)
  }
  if (documentLoading || topListLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }

  const handleItemPress = (item) => {
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
            <TouchableOpacity onPress={() => navigation.navigate('DocumentSearchScreen')}>
              <Text>|Tìm kiếm....</Text>
            </TouchableOpacity>
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
        {topList.length > 0 ? (
          <FlatList
            data={topList}
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

        <View className="flex-row justify-between items-center mt-5">
          <Text className="text-lg font-bold">Tất cả tài liệu</Text>
        </View>
        {documents.length > 0 ? (
          <FlatList
            className="mr-2"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            showsVerticalScrollIndicator={false}
            data={documents}
            renderItem={({ item }) => <VerticalItem {...item} />}
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
