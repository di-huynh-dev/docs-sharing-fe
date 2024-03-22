import { View, Text, Image } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'

const VerticalItem = ({ docName, totalLikes, totalView, thumbnail }) => {
  return (
    <View className="mx-2 rounded-lg my-2 border-b-[0.2px]">
      <View className="flex-row items-center gap-2">
        <Image className="w-12 h-16 rounded-lg" source={{ uri: thumbnail }}></Image>
        <View>
          <Text numberOfLines={2} ellipsizeMode="tail" className="">
            {docName}
          </Text>
          <View className="flex-row gap-2">
            <View className="flex-row gap-2 justify-start ">
              <AntDesign name="heart" size={16} color="pink" />
              <Text className="">{totalLikes}</Text>
            </View>
            <View className="flex-row gap-2 justify-start ">
              <AntDesign name="eye" size={16} color="pink" />
              <Text className="">{totalView}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default VerticalItem
