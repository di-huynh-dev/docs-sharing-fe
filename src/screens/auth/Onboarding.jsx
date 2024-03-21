import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import Swiper from 'react-native-swiper'
import { appInfo } from '../../constants/appInfos'
import { useNavigation } from '@react-navigation/native'
import { globalStyles } from '../../styles/globalStyles'
import { appColors } from '../../constants/appColors'
import { fontFamilies } from '../../constants/fontFamilies'

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
          style={{ width: appInfo.sizes.WIDTH, height: appInfo.sizes.HEIGHT, resizeMode: 'cover' }}
        />
        <Image
          source={require('../../../assets/images/Onboarding02.png')}
          style={{ width: appInfo.sizes.WIDTH, height: appInfo.sizes.HEIGHT, resizeMode: 'cover' }}
        />
        <Image
          source={require('../../../assets/images/Onboarding03.png')}
          style={{ width: appInfo.sizes.WIDTH, height: appInfo.sizes.HEIGHT, resizeMode: 'cover' }}
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
          <Text className="text-white">Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => (index < 2 ? setIndex(index + 1) : navigation.navigate('Login'))}>
          <Text className="text-white">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Onboarding
