import { View, Text, Image, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'

const DocumentDetailScreen = ({ route }) => {
  const item = route.params.itemData

  return (
    <SafeAreaView className="flex-1 m-2">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-bold text-center">{item.docName}</Text>
        <Image source={{ uri: item.thumbnail }} className="w-full h-[200px] my-2" resizeMode="cover" />
        <Text className="mb-10 text-justify">{item.docIntroduction}</Text>

        <Text className="italic">
          Tải lên bởi: {item.user.firstName} {item.user.lastName}
        </Text>
        <Text className="italic">Thời gian: {item.uploadedAt}</Text>
        <Text className="italic">Lượt xem: {item.totalView}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DocumentDetailScreen
