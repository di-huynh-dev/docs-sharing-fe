import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { globalStyles } from '../../styles/globalStyles'
import { appColors } from '../../constants/appColors'
import { Feather } from '@expo/vector-icons'
import { Octicons } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import PostVerticalItem from '../../components/PostVerticalItem'

const PostList = () => {
  const navigation = useNavigation()
  const axiosPrivate = useAxiosPrivate()
  const client = useQueryClient()
  const [refreshing, setRefreshing] = useState(false)
  const [postsData, setPostsData] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const { data: posts, isLoading } = useQuery({
    queryKey: ['Posts', page],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/post/all?page=' + page + '&size=10')
        return resp
      } catch (error) {
        console.log(error)
        throw new Error('Failed to fetch posts')
      }
    },
  })
  useEffect(() => {
    if (posts) {
      if (posts.data.data.content.length === 0) {
        setHasMore(false)
      }
      setPostsData((prevPostsData) => [...prevPostsData, ...posts.data.data.content])
    }
  }, [posts])
  const onRefresh = () => {
    setRefreshing(true)
    client.invalidateQueries(['Posts'])
    setRefreshing(false)
    setPage(0)
    setPostsData([])
    setHasMore(true)
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }

  return (
    <View style={[globalStyles.container]}>
      <StatusBar barStyle={'light-content'} />
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
        <Text className="text-center text-white">Bạn muốn tìm kiếm bài viết nào?</Text>
        <View className="flex-row justify-between p-5 items-center">
          <View className="flex-row items-center space-x-2">
            <Feather name="search" size={30} color="white" />
            <TouchableOpacity onPress={() => navigation.navigate('PostSearchScreen')}>
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
      <FlatList
        className="flex-1 mb-5"
        data={postsData}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return <PostVerticalItem {...item} />
        }}
        onEndReached={() => {
          if (hasMore) {
            setPage(page + 1)
            client.invalidateQueries(['Posts'])
          }
        }}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          isLoading && (
            <TouchableOpacity style={styles.floatingButton}>
              <Text className="text-[#5D56F3] m-5">
                <AntDesign name="upcircleo" size={24} color="black" />
              </Text>
            </TouchableOpacity>
          )
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 25,
    padding: 10,
    zIndex: 999,
  },
})

export default PostList
