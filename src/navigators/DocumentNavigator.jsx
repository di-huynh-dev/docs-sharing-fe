import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import DocumentScreen from '../screens/document/DocumentScreen'
import DocumentDetail from '../screens/document/DocumentDetailScreen'
import AddDocument from '../screens/AddDocument'

const DocumentNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DocumentScreen" component={DocumentScreen} />
      <Stack.Screen name="DocumentDetailScreen" component={DocumentDetail} />
      <Stack.Screen name="AddDocumentScreen" component={AddDocument} />
    </Stack.Navigator>
  )
}

export default DocumentNavigator
