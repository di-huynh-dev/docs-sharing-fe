import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TagNavigator from './TagNavigator'
import FieldNavigator from './FieldNavigator'
import CategoryNavigator from './CategoryNavigator'
import AdminHomeNavigator from './AdminHomeNavigator'
import UserNavigator from './UserNavigator'

const AdminMainNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminHome" component={AdminHomeNavigator} />
      <Stack.Screen name="AdminTagNavigator" component={TagNavigator} />
      <Stack.Screen name="AdminFieldNavigator" component={FieldNavigator} />
      <Stack.Screen name="AdminUserNavigator" component={UserNavigator} />
      <Stack.Screen name="AdminCategoryNavigator" component={CategoryNavigator} />
    </Stack.Navigator>
  )
}

export default AdminMainNavigator