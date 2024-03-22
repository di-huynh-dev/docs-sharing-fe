import { View, Text } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import DocumentScreen from '../screens/document/DocumentScreen'

const DocumentNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DocumentScreen" component={DocumentScreen} />
    </Stack.Navigator>
  )
}

export default DocumentNavigator
