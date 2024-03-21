import React from 'react'
import { View, Image } from 'react-native'

const Splash = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Image source={require('../../../assets/logo.png')} />
    </View>
  )
}

export default Splash
