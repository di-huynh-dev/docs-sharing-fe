import React, { ReactNode } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ProfileNavigator from './ProfileNavigator'
import ExploreNavigator from './ExploreNavigator'
import AddPost from '../screens/AddPost'
import { appColors } from '../constants/appColors'
import { Ionicons } from '@expo/vector-icons'
import SavedNavigator from './SavedNavigator'
import { HomeScreen } from '../screens'

const TabNavigator = () => {
  const Tab = createBottomTabNavigator()
  return (
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
          } else if (route.name === 'AddPost') {
            iconName = 'add-circle-outline'
            size = 35
          } else if (route.name === 'Saved') {
            iconName = 'save-outline'
          } else if (route.name === 'Profile') {
            iconName = 'person-outline'
          }
          color = focused ? appColors.primary : appColors.gray5
          size = route.name === 'AddPost' ? 60 : 30
          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
              style={route.name === 'AddPost' && { color: appColors.primary }}
            />
          )
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreNavigator} />
      <Tab.Screen name="AddPost" component={AddPost} />
      <Tab.Screen name="Saved" component={SavedNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  )
}

export default TabNavigator
