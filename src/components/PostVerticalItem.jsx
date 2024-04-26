import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import { AntDesign } from '@expo/vector-icons'
import { formatDate } from '../utils/helpers'
import { useNavigation } from '@react-navigation/native'

const PostVerticalItem = ({
  postId,
  title,
  content,
  createdAt,
  totalLikes,
  totalComments,
  user,
  postImages,
  liked,
}) => {
  const navigation = useNavigation()

  return (
    <View className="bg-white p-4 rounded-lg">
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={() => navigation.navigate('OtherUserProfileScreen', { user: user })}
          className="flex-row items-center space-x-3"
        >
          {user.image ? (
            <Image source={{ uri: user.image }} style={{ width: 40, height: 40, borderRadius: 50 }} />
          ) : (
            <Image source={require('../../assets/images/no-avatar.jpg')} className="w-14 h-14 rounded-full" />
          )}
          <View className="flex justify-center">
            <Text className="text-base font-bold">
              {user.firstName} {user.lastName}
            </Text>
            <Text className="text-sm text-gray-500">{formatDate(createdAt)}</Text>
          </View>
        </TouchableOpacity>

        <View className="flex items-center justify-center">
          <TouchableOpacity className="bg-[#F1F4F5] w-[40px] h-[40px] rounded-full flex items-center justify-center">
            <Entypo name="dots-three-horizontal" size={24} color="#99A1BE" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        className="mt-2 mx-4"
        onPress={() => navigation.navigate('PostDetailScreen', { postId: postId })}
      >
        <Text className="text-base font-bold mb-2">{title}</Text>

        <Text className="text-sm text-gray-500">{content}</Text>
        {postImages && postImages.length > 0 && (
          <Image source={{ uri: postImages[0].url }} className="w-full h-80 rounded-lg mt-5" />
        )}
      </TouchableOpacity>
      <View className="flex-row justify-between mt-5 mb-2 mx-2">
        <View className="flex-row gap-2">
          <TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {liked ? (
                <AntDesign name="heart" size={24} color="#f75050" style={{ marginRight: 5 }} />
              ) : (
                <AntDesign name="hearto" size={24} color="#f75050" style={{ marginRight: 5 }} />
              )}
              <Text>{totalLikes}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center space-x-2">
            <Entypo name="chat" size={24} color="#bbb" />
            <Text> Bình luận({totalComments})</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default PostVerticalItem
