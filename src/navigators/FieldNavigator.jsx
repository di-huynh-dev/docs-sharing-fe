import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AddField, AdminField, UpdateField } from '../screens'

const FieldNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="FieldScreen" component={AdminField} />
      <Stack.Screen name="AddFieldScreen" component={AddField} />
      <Stack.Screen name="UpdateFieldScreen" component={UpdateField} />
    </Stack.Navigator>
  )
}

export default FieldNavigator
