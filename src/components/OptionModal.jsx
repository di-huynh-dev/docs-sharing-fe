import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'

const OptionModal = ({ onClose, onAddPost, onAddDocument }) => {
  return (
    <Modal transparent visible={true} animationType="fade">
      <View className="flex-1  items-center mb-16 justify-end">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={onAddPost}
            className="rounded-full bg-[#fb5ba0] w-20 h-20 items-center justify-center"
          >
            <Text className="text-white font-bold text-2xl text-center">Post</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} className="mx-4">
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAddDocument}
            className="rounded-full bg-[#5cabef] w-20 h-20 items-center justify-center"
          >
            <Text className="text-white font-bold text-2xl text-center">Doc</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default OptionModal
