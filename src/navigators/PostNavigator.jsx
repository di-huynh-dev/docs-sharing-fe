import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { CreatePost, PostComment, PostDetail, PostList } from '../screens'

const PostNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PostListScreen" component={PostList} />
      <Stack.Screen name="PostCommentScreen" component={PostComment} />
      <Stack.Screen name="PostDetailScreen" component={PostDetail} />
      <Stack.Screen name="CreatePostScreen" component={CreatePost} />
    </Stack.Navigator>
  )
}

export default PostNavigator
