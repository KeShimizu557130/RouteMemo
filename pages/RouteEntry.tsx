import * as React from 'react'
import { View, Button, StyleSheet, FlatList } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Drive, DriveCondition } from '../domains/Drive'
import DriveList from '../components/DriveList'
import PointNameDialog from '../components/PointNameDialog'
import { AppStateInterface } from '../store/store'
import { addNewRecord, saveAllRoutes, loadAllRoutes } from '../thunk/RouteThunk'

/**
 * ApplicationComponent
 */
export default (props) => {
  return (
    <View style={styles.container}>
      <RouteArea navigation={props.navigation} />
      <ButtonArea />
      <ModalArea />
    </View>
  )
}

/**
 * ルート表示領域
 */
const RouteArea = (props) => {
  const currentRoute = useSelector<AppStateInterface>(state => state.route.currentRoute)

  return (
    <FlatList<Drive>
      data={currentRoute.drives}
      renderItem={value => renderList(value.item)}
      keyExtractor={value => `${value.id}`}
    />
  )

  /**
   * リスト描画
   * @param item 
   */
  function renderList(item: Drive) {
    return (
      <DriveList navigation={props.navigation} drive={item} />
    )
  }
}

/**
 * ボタン表示領域
 */
const ButtonArea = () => {
  const allRoutes = useSelector<AppStateInterface>(state => state.route.allRoutes)
  const currentRoute = useSelector<AppStateInterface>(state => state.route.currentRoute)
  const currentRouteId = useSelector<AppStateInterface>(state => state.route.currentRouteId)
  const dispatch = useDispatch()

  return (
    <View>
      <Button title="Record" onPress={handleRecordBtnClick} />
      <Button title="Store" onPress={handleStoreBtnClick} />
      <Button title="Restore" onPress={handleRestoreBtnClick} />
      <Button title="ViewStore" onPress={dumpStore} />
    </View>
  )

  /**
   * Recordボタン押下時の処理
   */
  function handleRecordBtnClick() {
    dispatch(addNewRecord())
  }

  /**
   * Storeボタン押下時の処理
   */
  function handleStoreBtnClick() {
    dispatch(saveAllRoutes())
  }

  /**
   * Restoreボタン押下時の処理
   */
  function handleRestoreBtnClick() {
    dispatch(loadAllRoutes())
  }
  /**
   * デバッグ用
   */
  function dumpStore() {
    console.log('allRoutes:' + JSON.stringify(allRoutes))
    console.log('currentRoute:' + JSON.stringify(currentRoute))
    console.log('currentRouteId:' + JSON.stringify(currentRouteId))
  }
}

/**
 * モーダル表示領域
 */
const ModalArea = () => {
  return (
    <PointNameDialog isModalVisible={isModalVisible()} />
  )

  function isModalVisible(): boolean {
    const currentRoute = useSelector<AppStateInterface>(state => state.route.currentRoute)
    if (currentRoute.drives.length === 0) return false
    const latestDrive = currentRoute.drives[currentRoute.drives.length - 1]
    return latestDrive.mode === DriveCondition.WAIT_FOR_POINT_NAME
  }
}

/**
 * Define view styles.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
