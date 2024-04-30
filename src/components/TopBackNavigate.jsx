import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const TopBackNavigate = ({ page }) => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity className="flex-row items-center gap-2" onPress={() => navigation.goBack()}>
      <AntDesign name="arrowleft" size={24} color="black" />
      <Text className="text-lg font-bold">{page}</Text>
    </TouchableOpacity>
  )
}

export default TopBackNavigate
