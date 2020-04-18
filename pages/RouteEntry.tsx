import * as React from 'react'
import { View, Button, StyleSheet, FlatList } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Drive } from '../domains/Drive'
import DriveList from '../components/DriveList'
import PointNameDialog, { PointNameDialogState } from '../components/PointNameDialog'
import { addNewRecord, loadAllRoutes, addPointName } from '../reducers/RouteReducer'
import { AppStateInterface } from '../store/store'
import AppStorage from '../AppStorage'
import { saveRoute } from '../thunk/RouteThunk'

/**
 * ApplicationComponent
 */
export default () => {
  return (
    <View style={styles.container}>
      <RouteArea />
      <ButtonArea />
      <ModalArea />
    </View>
  )
}

/**
 * ルート表示領域
 */
const RouteArea = () => {

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
      <DriveList
        pointName={item.pointName!}
        arrivalTime={item.arrivalTime!}
        departureTime={item.departureTime!}
      />
    )
  }
}

/**
 * ボタン表示領域
 */
const ButtonArea = () => {

  const appStorage = new AppStorage()
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
    dispatch(saveRoute());
  }

  /**
   * Restoreボタン押下時の処理
   */
  async function handleRestoreBtnClick() {
    try {
      const routesAndCurrent = await appStorage.loadAllRoutes()
      dispatch(loadAllRoutes(routesAndCurrent.allRoutes, routesAndCurrent.currentRouteId))
    } catch (error) {
      console.warn('err:' + error)
    }
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

  const isModalVisible = useSelector<AppStateInterface>(state => state.route.isModalVisible)
  const dispatch = useDispatch()

  return (
    <PointNameDialog
      isModalVisible={isModalVisible}
      onDialogDismiss={handleDialogDismiss}
    />
  )

  /**
   * モーダル制御
   * @param value 
   */
  function handleDialogDismiss(value: PointNameDialogState) {
    if (value !== undefined) dispatch(addPointName(value.pointName))
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
