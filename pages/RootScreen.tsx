import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import RouteEntry from './RouteEntry'
import RouteHistory from './RouteHistory'
import AppSettings from './AppSettings'
import { loadAllRoutes } from '../thunk/RouteThunk'
import { loadAllSettings } from '../thunk/SettingsThunk'
import { useDispatch } from 'react-redux'
import DriveEdit from './DriveEdit'
import SideBar from '../components/SideBar'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

const DrawerComponent = () => {
  return (
    <Drawer.Navigator initialRouteName="Entry" drawerContent={props => <SideBar {...props} />}>
      <Drawer.Screen name="Entry" component={RouteEntry} />
      <Drawer.Screen name="History" component={RouteHistory} />
      <Drawer.Screen name="Settings" component={AppSettings} />
      <Drawer.Screen name="Edit" component={DriveEdit} />
    </Drawer.Navigator>
  )
}

export default () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    console.debug("RootScreen useEffect")
    dispatch(loadAllRoutes())
    dispatch(loadAllSettings())
  }, [])

  return (
    <Stack.Navigator headerMode={'none'}>
      <Stack.Screen component={DrawerComponent} name="Drawer"></Stack.Screen>
    </Stack.Navigator>
  )
}
