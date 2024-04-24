import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { PostComment, PostDetail, PostList } from '../screens'
import AddDocument from '../screens/AddDocument'

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
      <Stack.Screen name="CreateDocumentScreen" component={AddDocument} />
    </Stack.Navigator>
  )
}

export default PostNavigator
