import * as React from 'react'
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native'
import { ListItem } from 'react-native-elements'
import { NavigationScreenProp } from 'react-navigation'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import Dialog from "react-native-dialog"
import { Route } from '../domains/Route'
import RouteHistoryListMenu from '../components/RouteHistoryListMenu'
import {
  createRoute, renameRoute, loadRoute, saveRoute, setRouteHistoryPopupMenuVisible,
  deleteRoute, setRouteNameEntryDialogVisible
} from '../actions/RouteActions'

export class RouteHistory extends React.Component<RouteHistoryProps> {
  currentRouteName = ''
  selectedRouteId = -1

  render() {
    return (
      <View style={styles.container}>
        <Text>Route History</Text>
        <FlatList<Route>
          data={this.props.allRoutes}
          renderItem={value => this.renderList(value.item)}
          keyExtractor={value => `${value.id}`}
        />
        <View>
          <Button title="NewRoute" onPress={this.props.createRoute} />
        </View>
        <RouteHistoryListMenu
          menuItems={[
            {
              menuTitle: 'rename',
              onMenuPress: () => { this.beginRenameRoute() }
            }
          ]}
          isModalVisible={this.props.isRouteHistoryPopupMenuVisible}
        />
        <Dialog.Container visible={this.props.isRouteNameEntryDialogVisible}>
          <Dialog.Title>ルート名変更</Dialog.Title>
          <Dialog.Input label="変更後のルート名称を入力してください。" onChangeText={(routeName) => { this.currentRouteName = routeName }} />
          <Dialog.Button label="Cancel" onPress={() => { this.props.setRouteNameEntryDialogVisible(false) }} />
          <Dialog.Button label="OK" onPress={this.renameRoute} />
        </Dialog.Container>
      </View>
    )
  }

  /**
   * render drive process list
   */
  renderList = (item: Route) => {
    return (
      <ListItem
        title={item.routeName}
        onPress={() => this.handleRouteTop(item)}
        onLongPress={() => this.handleRouteLongTop(item)} />
    )
  }

  /**
   * ルート名タップ時の処理
   */
  handleRouteTop = (item: Route) => {
    this.props.loadRoute(item)
    this.props.navigation.navigate('Entry', item);
  }

  /**
   * ルート名ロングタップ時の処理
   */
  handleRouteLongTop = (item: Route) => {
    this.selectedRouteId = item.id
    this.props.setRouteHistoryPopupMenuVisible(true)
  }

  /**
   * ルート名入力ダイアログ表示
   */
  beginRenameRoute = () => {
    this.props.setRouteHistoryPopupMenuVisible(false)
    this.props.setRouteNameEntryDialogVisible(true)
  }

  /**
   * ルート名変更
   */
  renameRoute = () => {
    this.props.renameRoute(this.selectedRouteId, this.currentRouteName)
    this.props.setRouteNameEntryDialogVisible(false)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

const mapStateToProps = state => ({
  allRoutes: state.user.allRoutes,
  currentRoute: state.user.currentRoute,
  currentRouteId: state.user.currentRouteId,
  isRouteHistoryPopupMenuVisible: state.user.isRouteHistoryPopupMenuVisible,
  isRouteNameEntryDialogVisible: state.user.isRouteNameEntryDialogVisible
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  renameRoute: (routeId: number, newRouteName: string) => dispatch(renameRoute(routeId, newRouteName)),
  createRoute: () => dispatch(createRoute()),
  loadRoute: (route: Route) => dispatch(loadRoute(route)),
  saveRoute: () => dispatch(saveRoute()),
  setRouteHistoryPopupMenuVisible: (visible: boolean) => dispatch(setRouteHistoryPopupMenuVisible(visible)),
  deleteRoute: () => dispatch(deleteRoute()),
  setRouteNameEntryDialogVisible: (visible: boolean) => dispatch(setRouteNameEntryDialogVisible(visible))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteHistory)

interface NavigatorProps {
  navigation: NavigationScreenProp<any, any>,
}

type RouteHistoryProps = NavigatorProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
