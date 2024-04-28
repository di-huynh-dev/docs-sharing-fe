import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useNavigation } from '@react-navigation/native'
import { globalStyles } from '../../styles/globalStyles'
import { AntDesign } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import PostVerticalItem from '../../components/PostVerticalItem'

const PostSearch = () => {
  const navigation = useNavigation()
  const client = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const [searchQuery, setSearchQuery] = useState('@@@@@')
  const [loading, setLoading] = useState(false)

  const { data: resultsSearchPost } = useQuery({
    queryKey: ['SearchPost'],
    queryFn: async () => {
      setLoading(true)
      try {
        const resp = await axiosPrivate.get('/post/search?page=0&size=100&q=' + searchQuery)
        setLoading(false)
        return resp.data.data.content
      } catch (error) {
        console.log(error)
        throw new Error('Failed to fetch posts')
      }
    },
  })

  const handleSearch = () => {
    client.invalidateQueries(['SearchPost'])
  }

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View className="mx-2 flex-row items-center justify-between p-2">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('PostListScreen')
          }}
          className="flex-row items-center gap-2"
        >
          <AntDesign name="arrowleft" size={24} color="black" />
          <Text className="text-lg font-bold">Tìm kiếm bài viết</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between p-5 items-center">
        <View className="flex-row items-center space-x-2">
          <TouchableOpacity onPress={handleSearch}>
            <Feather name="search" size={30} color="gray" />
          </TouchableOpacity>
          <TextInput
            placeholder="Tìm kiếm.."
            className="text-lg "
            onChangeText={(text) => setSearchQuery(text)}
            onSubmitEditing={handleSearch}
          />
        </View>
        <TouchableOpacity
          onPress={handleSearch}
          className="flex-row bg-[#5D56F3] rounded-full items-center py-1 px-3 space-x-2"
        >
          <Ionicons name="filter-circle" size={26} color="white" />
          <Text className="text-white">Lọc</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : resultsSearchPost && resultsSearchPost.length > 0 ? (
        <View>
          <FlatList
            data={resultsSearchPost}
            renderItem={({ item }) => {
              return <PostVerticalItem {...item} />
            }}
            keyExtractor={(item) => item.postId}
          />
        </View>
      ) : (
        <Text className="text-center mt-10">Không có bài viết nào được tìm thấy</Text>
      )}
    </SafeAreaView>
  )
}

export default PostSearch
