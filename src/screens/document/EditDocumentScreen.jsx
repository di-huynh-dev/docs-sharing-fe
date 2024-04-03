import { View, Text } from 'react-native'
import React from 'react'

const EditDocumentScreen = ({ route }) => {
  const { docId } = route.params
  console.log(docId)
  return (
    <View>
      <Text>EditDocumentScreen</Text>
    </View>
  )
}

export default EditDocumentScreen
