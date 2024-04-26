import { View, Text, Image } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'

const HorizontalItem = ({ docName, totalLikes, totalView, thumbnail }) => {
  return (
    <View className="bg-slate-400 p-4 mx-2 rounded-lg">
      <View className="flex-row items-center justify-between gap-2">
        <Image className="w-12 h-16 rounded-lg" source={{ uri: thumbnail }}></Image>
        <View>
          <View className="flex-row gap-2 justify-start ">
            <AntDesign name="heart" size={16} color="white" />
            <Text className="text-white">{totalLikes}</Text>
          </View>
          <View className="flex-row gap-2 justify-start ">
            <AntDesign name="eye" size={16} color="white" />
            <Text className="text-white">{totalView}</Text>
          </View>
        </View>
      </View>
      <Text numberOfLines={3} ellipsizeMode="tail" className="text-md text-white">
        {docName.length > 22 ? docName.slice(0, 22) + '...' : docName}
      </Text>
    </View>
  )
}

export default HorizontalItem
