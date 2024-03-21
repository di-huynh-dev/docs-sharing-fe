import { createDrawerNavigator } from '@react-navigation/drawer'
import * as React from 'react'
import { Button, Text } from 'react-native'
import { Drawer } from 'react-native-drawer-layout'
import TabNavigator from './TabNavigator'
import DrawerCustom from '../components/DrawerCustom'

const DrawerNavigator = () => {
  const [open, setOpen] = React.useState(false)
  const Drawer = createDrawerNavigator()
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
      }}
      drawerContent={(props) => <DrawerCustom {...props} />}
    >
      <Drawer.Screen name="Main" component={TabNavigator} />
    </Drawer.Navigator>
  )
}

export default DrawerNavigator
