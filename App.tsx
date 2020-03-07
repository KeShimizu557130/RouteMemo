import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { store } from './Reducer'
import { RouteEntry, RouteHistory } from './RouteEntry'
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

const RootStack = createStackNavigator(
  {
    Entry: RouteEntry,
    History: RouteHistory
  },
  {
    initialRouteName: 'Entry'
  }
);

const AppContainer = createAppContainer(RootStack);

/**
 * ApplicationComponent
 */
export default class Root extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
