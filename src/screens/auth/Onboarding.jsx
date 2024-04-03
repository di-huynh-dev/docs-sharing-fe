import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import Swiper from 'react-native-swiper'
import { useNavigation } from '@react-navigation/native'
import { globalStyles } from '../../styles/globalStyles'
import { appColors } from '../../constants/appColors'

const Onboarding = () => {
  const [index, setIndex] = useState(0)
  const navigation = useNavigation()
  return (
    <View style={[globalStyles.container]}>
      <Swiper
        style={{}}
        loop={false}
        onIndexChanged={(num) => setIndex(num)}
        index={index}
        activeDotColor={appColors.white}
      >
        <Image
          source={require('../../../assets/images/Onboarding01.png')}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
        <Image
          source={require('../../../assets/images/Onboarding02.png')}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
        <Image
          source={require('../../../assets/images/Onboarding03.png')}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      </Swiper>
      <View
        style={[
          {
            paddingHorizontal: 16,
            paddingVertical: 20,
            position: 'absolute',
            bottom: 20,
            right: 20,
            left: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text className="text-white">Bỏ qua</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => (index < 2 ? setIndex(index + 1) : navigation.navigate('Login'))}>
          <Text className="text-white">Tiếp theo</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Onboarding
