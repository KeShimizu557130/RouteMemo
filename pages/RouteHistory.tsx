import * as React from 'react'
import { View, Text, Button, StyleSheet, FlatList } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { ListItem } from 'react-native-elements'
import { Route } from '../domains/Route'
import { AppStateInterface } from '../store/store'
import RouteHistoryListMenu, { ListMenuItem } from '../components/RouteHistoryListMenu'
import RouteNameDialog from '../components/RouteNameDialog'
import { createRoute, renameRoute, loadRoute, openMail } from '../thunk/RouteThunk'
import { NavigationScreenProp } from 'react-navigation'

interface RouteHistoryProps {
  navigation: NavigationScreenProp<any, any>
}

/**
 * ApplicationComponent
 */
export default (props: RouteHistoryProps) => {
  // ポップアップメニュー表示状態
  const [isPopupmenuVisible, setPopupmenuVisible] = React.useState<boolean>(false)
  const [isRoutenameDialogVisible, setRoutenameDialogVisible] = React.useState<boolean>(false)
  const [selectedRouteId, setSelectedRouteId] = React.useState<number>(-1)
  const dispatch = useDispatch()
  const menuItems: ListMenuItem[] = [{
    menuTitle: 'rename',
    onMenuPress: () => setPopupmenuVisible(false),
    onMenuHide: () => setRoutenameDialogVisible(true)
  }, {
    menuTitle: 'export',
    onMenuPress: handleRouteExportExec,
    onMenuHide: () => { }
  }]

  return (
    <View style={styles.container}>
      <RouteHistoryArea
        onRouteTap={handleRouteTap}
        onRouteLongTap={handleRouteLongTop} />
      <ButtonArea />
      <ModalArea
        isRoutenameDialogVisible={isRoutenameDialogVisible}
        onRenameOK={handleRouteRenameExec}
        onRenameCancel={() => setRoutenameDialogVisible(false)} />
      <MenuArea
        isPopupmenuVisible={isPopupmenuVisible}
        menuItems={menuItems} />
    </View>
  )

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
    setSelectedRouteId(item.id)
    setPopupmenuVisible(true)
  }

  /**
   * ルート名変更
   */
  function handleRouteRenameExec(newRouteName: string) {
    dispatch(renameRoute(selectedRouteId, newRouteName))
    setRoutenameDialogVisible(false)
  }

  function handleRouteExportExec() {
    dispatch(openMail(selectedRouteId))
    setPopupmenuVisible(false)
  }
}

/**
* ルート表示領域
*/
const RouteHistoryArea: React.FC<{ onRouteTap: (Route) => void, onRouteLongTap: (Route) => void }> = ({ onRouteTap, onRouteLongTap }) => {
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
        onPress={() => onRouteTap(item)}
        onLongPress={() => onRouteLongTap(item)} />
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
const ModalArea: React.FC<{ isRoutenameDialogVisible: boolean, onRenameOK: (newRouteName: string) => void, onRenameCancel: () => void }> = ({ isRoutenameDialogVisible, onRenameOK, onRenameCancel }) => {
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
const MenuArea: React.FC<{ isPopupmenuVisible: boolean, menuItems: ListMenuItem[] }> = ({ isPopupmenuVisible, menuItems }) => {
  return (
    <RouteHistoryListMenu
      menuItems={menuItems}
      isModalVisible={isPopupmenuVisible}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
