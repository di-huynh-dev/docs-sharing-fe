import React, { useState } from 'react'
import { View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { appColors } from '../constants/appColors'
import ExploreNavigator from './ExploreNavigator'
import ProfileNavigator from './ProfileNavigator'
import DocumentNavigator from './DocumentNavigator'
import AddPost from '../screens/AddPost'
import { useNavigation } from '@react-navigation/native'
import OptionModal from '../components/OptionModal'
import AddDocumentModal from '../components/AddDocumentModal'
import { AntDesign } from '@expo/vector-icons'
import PostNavigator from './PostNavigator'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  const navigation = useNavigation()

  const [showOptions, setShowOptions] = useState(false)
  const [showAddPostModal, setShowAddPostModal] = useState(false)

  const handleAddPost = () => {
    navigation.navigate('CreatePostScreen')
    setShowOptions(false)
  }

  const handleAddDocument = () => {
    setShowOptions(false)
    // setShowAddPostModal(true)
    navigation.navigate('CreateDocumentScreen')
  }

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            height: 68,
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarLabel: () => null,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName
            if (route.name === 'Home') {
              iconName = 'home-outline'
            } else if (route.name === 'Explore') {
              iconName = 'earth-outline'
            } else if (route.name === 'Document') {
              iconName = 'save-outline'
            } else if (route.name === 'CreatePostScreen') {
              iconName = 'plus'
              size = 35
              return (
                <View className="rounded-full bg-[#3588f4] w-16 h-16 items-center justify-center">
                  <AntDesign name={iconName} size={size} color="white" onPress={() => setShowOptions(true)} />
                </View>
              )
            } else if (route.name === 'Profile') {
              iconName = 'person-outline'
            } else if (route.name === 'AddDocument') {
              return null
            }
            color = focused ? appColors.primary : appColors.gray5
            size = route.name === 'AddPost' ? 60 : 30
            return <Ionicons name={iconName} size={size} color={color} />
          },
        })}
      >
        <Tab.Screen name="Home" component={PostNavigator} />
        <Tab.Screen name="Explore" component={ExploreNavigator} />
        <Tab.Screen name="CreatePostScreen" component={AddPost} />
        <Tab.Screen name="Document" component={DocumentNavigator} />
        <Tab.Screen name="Profile" component={ProfileNavigator} />
      </Tab.Navigator>
      {showOptions && (
        <OptionModal
          onClose={() => setShowOptions(false)}
          onAddPost={handleAddPost}
          onAddDocument={handleAddDocument}
        />
      )}
      {showAddPostModal && <AddDocumentModal onClose={() => setShowAddPostModal(false)} />}
    </View>
  )
}

export default TabNavigator
