import React from 'react'
import { Provider } from 'react-redux'
import store from './store/store'
import { NavigationContainer } from '@react-navigation/native'
import RootScreen from './pages/RootScreen'

/**
 * ApplicationComponent
 */
export default () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootScreen />
      </NavigationContainer>
    </Provider>
  )
}
