import React from 'react'
import { Provider } from 'react-redux'
import store from './store/store'
import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'
import RootScreen from './pages/RootScreen'
import RouteEntry from './pages/RouteEntry'
import RouteHistory from './pages/RouteHistory'
import DriveEdit from './pages/DriveEdit'
import AppSettings from './pages/AppSettings'

const RootStack = createStackNavigator(
  {
    Root: { screen: RootScreen },
    Entry: { screen: RouteEntry },
    History: { screen: RouteHistory },
    Edit: { screen: DriveEdit },
    Settings: { screen: AppSettings }
  },
  {
    initialRouteName: 'Root'
  }
)

const AppContainer = createAppContainer(RootStack)

/**
 * ApplicationComponent
 */
export default () => {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  )
}
