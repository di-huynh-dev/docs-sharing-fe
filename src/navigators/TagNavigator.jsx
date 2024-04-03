import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AddTag, AdminTag, UpdateTag } from '../screens'

const TagNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TagScreen" component={AdminTag} />
      <Stack.Screen name="AddTagScreen" component={AddTag} />
      <Stack.Screen name="UpdateTagScreen" component={UpdateTag} />
    </Stack.Navigator>
  )
}

export default TagNavigator
