import * as React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import RouteEntry from './RouteEntry'
import RouteHistory from './RouteHistory'

const Drawer = createDrawerNavigator()

export default () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Entry">
        <Drawer.Screen name="Entry" component={RouteEntry} />
        <Drawer.Screen name="History" component={RouteHistory} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}
