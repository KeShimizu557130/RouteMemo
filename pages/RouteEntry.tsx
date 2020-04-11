import * as React from 'react';
import { View, Button, StyleSheet, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Drive } from '../domains/Drive';
import DriveList from '../components/DriveList';
import PointNameDialog, { PointNameDialogState } from '../components/PointNameDialog';
import { addPointName, loadAllRoutes, saveRoute, addNewRecord } from '../actions/RouteActions'
import AppStorage from '../AppStorage'

/**
 * ApplicationComponent
 */
export default () => {
   return (
    <View style={styles.container}>
        <RouteArea/>
        <ButtonArea/>
        <ModalArea/>
    </View>     
   )
}

/**
 * ルート表示領域
 */
const RouteArea = () => {

  const currentRoute = useSelector(state => state.user.currentRoute);

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
  function renderList(item: Drive)  {
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

  const appStorage     = new AppStorage()
  const allRoutes      = useSelector(state => state.user.allRoutes);
  const currentRoute   = useSelector(state => state.user.currentRoute);
  const currentRouteId = useSelector(state => state.user.currentRouteId);
  const dispatch       = useDispatch();

  return (
    <View>
      <Button title="Record"    onPress={handleRecordBtnClick} />
      <Button title="Store"     onPress={handleStoreBtnClick} />
      <Button title="Restore"   onPress={handleRecordBtnClick} />
      <Button title="ViewStore" onPress={dumpStore} />
    </View>
  )

  /**
   * Recordボタン押下時の処理
   */
  function handleRecordBtnClick() {
    dispatch(addNewRecord());
  }

  /**
   * Storeボタン押下時の処理
   */
  function handleStoreBtnClick() {
    //TODO: この処理はThunkに持っていく
    const newRoutes = allRoutes.map(value => {
      if (value.id !== currentRouteId) return value
      return { ...currentRoute }
    })
    if (newRoutes.length === 0) newRoutes.push(currentRoute)
    appStorage.saveAllRoutes(newRoutes, currentRouteId)
  }

  /**
   * Restoreボタン押下時の処理
   */
  async function handleRestoreBtnClick() {
    try {
      const routesAndCurrent = await appStorage.loadAllRoutes()
      this.props.loadAllRoutes(routesAndCurrent.allRoutes, routesAndCurrent.currentRouteId)
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

  const isModalVisible = useSelector(state => state.user.isModalVisible);
  const dispatch = useDispatch();

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
