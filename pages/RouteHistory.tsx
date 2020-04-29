import * as React from 'react'
import { View, Text, Button, StyleSheet, FlatList } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { ListItem } from 'react-native-elements'
import Dialog from "react-native-dialog"
import { Route } from '../domains/Route'
import { AppStateInterface } from '../store/store'
import RouteHistoryListMenu from '../components/RouteHistoryListMenu'
import { createRoute, renameRoute, loadRoute } from '../thunk/RouteThunk'
import { NavigationScreenProp } from 'react-navigation'

interface RouteHistoryProps {
  navigation: NavigationScreenProp<any, any>,
  setState: any
}

type RouteHistoryState = {
  isPopupmenuVisible: boolean
  isRoutenameDialogVisible: boolean
}

/**
 * ApplicationComponent
 */
export default (props: RouteHistoryProps) => {
  // ポップアップメニュー表示状態
  const [state, setState] = React.useState<RouteHistoryState>({
    isPopupmenuVisible: false,
    isRoutenameDialogVisible: false
  })

  return (
    <View style={styles.container}>
      <RouteHistoryArea navigation={props.navigation} setState={setState} />
      <ButtonArea />
      <ModalArea state={state} setState={setState} />
      <MenuArea state={state} setState={setState} />
    </View>
  )
}

let selectedRouteId = -1

/**
* ルート表示領域
*/
const RouteHistoryArea = (props: RouteHistoryProps) => {
  const allRoutes = useSelector<AppStateInterface>(state => state.route.allRoutes)
  const dispatch = useDispatch()

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
        onPress={() => handleRouteTop(item)}
        onLongPress={() => handleRouteLongTop(item)} />
    )
  }

  /**
   * ルート名タップ時の処理
   */
  function handleRouteTop(item: Route) {
    dispatch(loadRoute(item))
    props.navigation.navigate('Entry', item);
  }

  /**
   * ルート名ロングタップ時の処理
   */
  function handleRouteLongTop(item: Route) {
    selectedRouteId = item.id
    props.setState({ isPopupmenuVisible: true })
  }
}

/**
 * ボタン表示領域
 */
const ButtonArea = () => {
  const dispatch = useDispatch()

  return (
    <Button title="NewRoute" onPress={handleNewRouteBtnClick} />
  )

  /**
   * NewRouteボタン押下時の処理
   */
  function handleNewRouteBtnClick() {
    dispatch(createRoute())
  }
}

/**
 * モーダル表示領域
 */
const ModalArea = ({ state, setState }) => {
  let currentRouteName = ''
  const dispatch = useDispatch()

  return (
    <Dialog.Container visible={state.isRoutenameDialogVisible}>
      <Dialog.Title>ルート名変更</Dialog.Title>
      <Dialog.Input label="変更後のルート名称を入力してください。" onChangeText={(routeName) => { currentRouteName = routeName }} />
      <Dialog.Button label="Cancel" onPress={() => { setState({ isRoutenameDialogVisible: false }) }} />
      <Dialog.Button label="OK" onPress={handleRenameRouteOK} />
    </Dialog.Container>
  )

  /**
   * ルート名変更
   */
  function handleRenameRouteOK() {
    dispatch(renameRoute(selectedRouteId, currentRouteName))
    setState({ isRoutenameDialogVisible: false })
  }
}

/**
 * メニュー表示領域
 */
const MenuArea = ({ state, setState }) => {

  return (
    <RouteHistoryListMenu
      menuItems={[
        {
          menuTitle: 'rename',
          onMenuPress: () => { beginRenameRoute() }
        }
      ]}
      isModalVisible={state.isPopupmenuVisible}
    />
  )

  /**
   * ルート名入力ダイアログ表示
   */
  function beginRenameRoute() {
    setState({ isPopupmenuVisible: false })
    setState({ isRoutenameDialogVisible: true })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
