import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CategoryNavigator from './CategoryNavigator'
import UserNavigator from './UserNavigator'
import AdminHomeScreen from '../screens/home/AdminHomeScreen'

const AdminHomeNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AdminHomeScreen" component={AdminHomeScreen} />
    </Stack.Navigator>
  )
}

export default AdminHomeNavigator
