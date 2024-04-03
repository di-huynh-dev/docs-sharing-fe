import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { AddCategory, AdminCategory, UpdateCategory } from '../screens'

const CategoryNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CategoryScreen" component={AdminCategory} />
      <Stack.Screen name="AddCategoryScreen" component={AddCategory} />
      <Stack.Screen name="UpdateCategoryScreen" component={UpdateCategory} />
    </Stack.Navigator>
  )
}

export default CategoryNavigator
