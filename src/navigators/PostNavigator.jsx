import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { OtherUserProfile, PostComment, PostDetail, PostList, PostSearch } from '../screens'
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
      <Stack.Screen name="PostSearchScreen" component={PostSearch} />
      <Stack.Screen name="OtherUserProfileScreen" component={OtherUserProfile} />
    </Stack.Navigator>
  )
}

export default PostNavigator
