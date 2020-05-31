import * as React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import RouteEntry from './RouteEntry'
import RouteHistory from './RouteHistory'
import AppSettings from './AppSettings'
import { loadAllRoutes } from '../thunk/RouteThunk'
import { loadAllSettings } from '../thunk/SettingsThunk'
import { useDispatch } from 'react-redux'
import DriveEdit from './DriveEdit'
import SideBar from '../components/SideBar'

const Drawer = createDrawerNavigator()

export default () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(loadAllRoutes())
    dispatch(loadAllSettings())
  }, [])

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Entry" drawerContent={props => <SideBar {...props} />}>
        <Drawer.Screen name="Entry" component={RouteEntry} />
        <Drawer.Screen name="History" component={RouteHistory} />
        <Drawer.Screen name="Settings" component={AppSettings} />
        <Drawer.Screen name="Edit" component={DriveEdit} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}
