import React from 'react'
import { Provider } from 'react-redux'
import store from './store/store'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import RootScreen from './pages/RootScreen'

/**
 * ApplicationComponent
 */
export default () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationContainer>
            <RootScreen />
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  )
}
