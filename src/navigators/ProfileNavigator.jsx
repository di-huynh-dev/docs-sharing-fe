import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Profile from '../screens/profile/Profile'
import UpdateProfile from '../screens/profile/UpdateProfile'

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileScreen" component={Profile} />
      <Stack.Screen name="UpdateProfileScreen" component={UpdateProfile} />
    </Stack.Navigator>
  )
}

export default ProfileNavigator
