import React from 'react'
import { Provider } from 'react-redux'
import store from './store/store'
import { NavigationContainer } from '@react-navigation/native'
import RootScreen from './pages/RootScreen'
import { Provider as PaperProvider } from 'react-native-paper'

/**
 * ApplicationComponent
 */
export default () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <RootScreen />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  )
}
