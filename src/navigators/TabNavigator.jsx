import React, { useState } from 'react'
import { View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { appColors } from '../constants/appColors'
import { HomeScreen } from '../screens'
import ExploreNavigator from './ExploreNavigator'
import ProfileNavigator from './ProfileNavigator'
import DocumentNavigator from './DocumentNavigator'
import AddPost from '../screens/AddPost'
import { useNavigation } from '@react-navigation/native'
import OptionModal from '../components/OptionModal'
import AddDocumentModal from '../components/AddDocumentModal'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  const navigation = useNavigation()

  const [showOptions, setShowOptions] = useState(false)
  const [showAddPostModal, setShowAddPostModal] = useState(false)

  const handleAddPost = () => {
    navigation.navigate('AddPost')
    setShowOptions(false)
  }

  const handleAddDocument = () => {
    // Navigate to AddDocument screen or perform any action related to AddDocument
    setShowOptions(false)
    setShowAddPostModal(true)
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
              iconName = 'search-outline'
            } else if (route.name === 'Document') {
              iconName = 'save-outline'
            } else if (route.name === 'AddPost') {
              iconName = 'add-circle-outline'
              size = 35
              return (
                <Ionicons
                  name={iconName}
                  size={size}
                  color={color}
                  style={{ color: focused ? appColors.primary : appColors.gray5 }}
                  onPress={() => setShowOptions(true)} // Show modal only when AddPost icon is pressed
                />
              )
            } else if (route.name === 'Profile') {
              iconName = 'person-outline'
            } else if (route.name === 'AddDocument') {
              return null // Không hiện icon của AddDocument
            }
            color = focused ? appColors.primary : appColors.gray5
            size = route.name === 'AddPost' ? 60 : 30
            return <Ionicons name={iconName} size={size} color={color} />
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Explore" component={ExploreNavigator} />
        <Tab.Screen name="AddPost" component={AddPost} />
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
