import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens'

export class HomeNavigator extends Component {
  render() {
    const Stack = createNativeStackNavigator()
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={Home} />
      </Stack.Navigator>
    )
  }
}

export default HomeNavigator
