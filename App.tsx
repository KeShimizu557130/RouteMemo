import React from 'react'
import { Provider } from 'react-redux'
import store from './store/store'
import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'
import RouteEntry from './pages/RouteEntry'
import RootScreen from './pages/RootScreen'
import RouteHistory from './pages/RouteHistory'

const RootStack = createStackNavigator(
  {
    Root: RootScreen,
    Entry: RouteEntry,
    History: RouteHistory
  },
  {
    initialRouteName: 'Root'
  }
)

const AppContainer = createAppContainer(RootStack);

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
