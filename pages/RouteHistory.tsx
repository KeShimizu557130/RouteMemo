import * as React from 'react'
import { View, Text, Button, StyleSheet, FlatList } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { ListItem } from 'react-native-elements'
import { Route } from '../domains/Route'
import { AppStateInterface } from '../store/store'
import RouteHistoryListMenu from '../components/RouteHistoryListMenu'
import RouteNameDialog from '../components/RouteNameDialog'
import { createRoute, renameRoute, loadRoute } from '../thunk/RouteThunk'
import { NavigationScreenProp } from 'react-navigation'

interface RouteHistoryProps {
  navigation: NavigationScreenProp<any, any>,
  onRouteLongTap: (item: Route) => void,
  onRouteTap: (item: Route) => void
}

let selectedRouteId = -1

/**
 * ApplicationComponent
 */
export default (props: RouteHistoryProps) => {
  // ポップアップメニュー表示状態
  const [isPopupmenuVisible, setPopupmenuVisible] = React.useState<boolean>(false)
  const [isRoutenameDialogVisible, setRoutenameDialogVisible] = React.useState<boolean>(false)
  const dispatch = useDispatch()

  return (
    <View style={styles.container}>
      <RouteHistoryArea
        navigation={props.navigation}
        onRouteTap={handleRouteTap}
        onRouteLongTap={handleRouteLongTop} />
      <ButtonArea />
      <ModalArea
        isRoutenameDialogVisible={isRoutenameDialogVisible}
        onRenameOK={handleRouteRenameExec}
        onRenameCancel={handleRouteRenameCancel} />
      <MenuArea
        isPopupmenuVisible={isPopupmenuVisible}
        onRenameBegin={handleRouteRenameBegin}
        onMenuHide={handlePopupMenuHide} />
    </View>
  )

  /**
   * ポップアップメニュー非表示時の処理
   */
  function handlePopupMenuHide() {
    setRoutenameDialogVisible(true)
  }

  /**
   * ルート名タップ時の処理
   */
  function handleRouteTap(item: Route) {
    dispatch(loadRoute(item))
    props.navigation.navigate('Entry')
  }

  /**
   * ルート名ロングタップ時の処理
   */
  function handleRouteLongTop(item: Route) {
    selectedRouteId = item.id
    setPopupmenuVisible(true)
  }

  /**
   * ルート名変更開始
   * ルート名入力ダイアログ表示
   */
  function handleRouteRenameBegin() {
    setPopupmenuVisible(false)
    // setRoutenameDialogVisible(true)
  }

  /**
   * ルート名変更
   */
  function handleRouteRenameExec(newRouteName: string) {
    dispatch(renameRoute(selectedRouteId, newRouteName))
    setRoutenameDialogVisible(false)
  }

  /**
   * ルート名変更キャンセル
   */
  function handleRouteRenameCancel() {
    setRoutenameDialogVisible(false)
  }
}

/**
* ルート表示領域
*/
const RouteHistoryArea = (props: RouteHistoryProps) => {
  const allRoutes = useSelector<AppStateInterface>(state => state.route.allRoutes)

  return (
    <View>
      <Text>Route History</Text>
      <FlatList<Route>
        data={allRoutes}
        renderItem={value => renderList(value.item)}
        keyExtractor={value => `${value.id}`}
      />
    </View>
  )

  /**
   * リスト描画
   * @param item 
   */
  function renderList(item: Route) {
    return (
      <ListItem
        title={item.routeName}
        onPress={() => props.onRouteTap(item)}
        onLongPress={() => props.onRouteLongTap(item)} />
    )
  }
}

/**
 * ボタン表示領域
 */
const ButtonArea = () => {
  const dispatch = useDispatch()

  return (
    <Button title="NewRoute" onPress={() => dispatch(createRoute())} />
  )
}

/**
 * モーダル表示領域
 */
const ModalArea = ({ isRoutenameDialogVisible, onRenameOK, onRenameCancel }) => {
  return (
    <RouteNameDialog
      isModalVisible={isRoutenameDialogVisible}
      onDialogOK={onRenameOK}
      onDialogCancel={onRenameCancel}
    />
  )
}

/**
 * メニュー表示領域
 */
const MenuArea = ({ isPopupmenuVisible, onRenameBegin, onMenuHide }) => {
  return (
    <RouteHistoryListMenu
      menuItems={[
        { menuTitle: 'rename', onMenuPress: () => onRenameBegin() }
      ]}
      isModalVisible={isPopupmenuVisible}
      onMenuHide={onMenuHide}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
