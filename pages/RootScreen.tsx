import * as React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import RouteEntry from './RouteEntry'
import RouteHistory from './RouteHistory'
import AppSettings from './AppSettings'
import { loadAllSettings } from '../thunk/SettingsThunk'
import { useDispatch } from 'react-redux'
import DriveEdit from './DriveEdit'

const Drawer = createDrawerNavigator()

export default () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(loadAllSettings())
  }, [])

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Entry">
        <Drawer.Screen name="Entry" component={RouteEntry} />
        <Drawer.Screen name="History" component={RouteHistory} />
        <Drawer.Screen name="Settings" component={AppSettings} />
        <Drawer.Screen name="Edit" component={DriveEdit} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}
