import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import DocumentScreen from '../screens/document/DocumentScreen'
import DocumentDetail from '../screens/document/DocumentDetailScreen'
import AddDocument from '../screens/AddDocument'
import { CreateReportDoc, EditDocumentScreen } from '../screens'
import DocumentSearch from '../screens/document/DocumentSearch'

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
      <Stack.Screen name="EditDocumentScreen" component={EditDocumentScreen} />
      <Stack.Screen name="DocumentSearchScreen" component={DocumentSearch} />
      <Stack.Screen name="CreateReportDocScreen" component={CreateReportDoc} />
    </Stack.Navigator>
  )
}

export default DocumentNavigator
