import * as React from 'react';
import { View, Button, StyleSheet, FlatList } from 'react-native';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Drive } from '../domains/Drive';
import { Route } from '../domains/Route';
import DriveList from '../components/DriveList';
import PointNameDialog, { PointNameDialogState } from '../components/PointNameDialog';
import { addPointName, loadAllRoutes, saveRoute, addNewRecord } from '../actions/RouteActions'
import AppStorage from '../AppStorage'

const appStorage = new AppStorage()

/**
 * ApplicationComponent
 */
export class RouteEntry extends React.Component<RouteEntryProps> {
  /**
   * render main view.
   */
  render() {
    return (
      <View style={styles.container}>
        <FlatList<Drive>
          data={this.props.currentRoute.drives}
          renderItem={value => this.renderList(value.item)}
          keyExtractor={value => `${value.id}`}
        />
        <View>
          <Button title="Record" onPress={this.handleRecordBtnClick} />
          <Button title="Store" onPress={this.store} />
          <Button title="Restore" onPress={this.restore} />
          <Button title="ViewStore" onPress={this.viewStore} />
        </View>
        <PointNameDialog
          isModalVisible={this.props.isModalVisible}
          onDialogDismiss={this.handleDialogDismiss}
        />
      </View>
    )
  }

  /**
   * render drive process list
   */
  renderList = (item: Drive) => {
    //Optional型のアンラップはもう少し丁寧にやる
    return (
      <DriveList
        pointName={item.pointName!}
        arrivalTime={item.arrivalTime!}
        departureTime={item.departureTime!}
      />
    )
  }

  /**
   * Recordボタン押下時の処理
   */
  handleRecordBtnClick = () => {
    this.props.addNewRecord()
  }

  /**
   * モーダルダイアログで発生したイベントハンドリング
   */
  handleDialogDismiss = (value: PointNameDialogState) => {
    if (value !== undefined) {
      this.props.addPointName(value.pointName)
    }
  }

  viewStore = () => {
    console.log('allRoutes:' + JSON.stringify(this.props.allRoutes))
    console.log('currentRoute:' + JSON.stringify(this.props.currentRoute))
    console.log('currentRouteId:' + JSON.stringify(this.props.currentRouteId))
  }

  /**
   * 現在入力中のルートだけをストレージに保存する
   * アプリが非表示になったときとかに呼ばれる想定だけど未実装
   */
  storeData = () => {
    appStorage.saveCurrentRoute(this.props.currentRoute.drives)
  }

  /**
   * 全ルートのデータをストレージに保存
   */
  store = () => {
    const newRoutes = this.props.allRoutes.map(value => {
      if (value.id !== this.props.currentRouteId) return value
      return { ...this.props.currentRoute }
    })
    if (newRoutes.length === 0) newRoutes.push(this.props.currentRoute)

    appStorage.saveAllRoutes(newRoutes, this.props.currentRouteId)
  }

  /**
   * ストレージに保存されている全ルートをstoreにロード
   */
  restore = async () => {
    try {
      const routesAndCurrent = await appStorage.loadAllRoutes()
      this.props.loadAllRoutes(routesAndCurrent.allRoutes, routesAndCurrent.currentRouteId)
    } catch (error) {
      console.warn('err:' + error)
    }
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

const mapStateToProps = state => ({
  // storeは巨大なJsonの塊なので、nameにjsonから取って来たデータを代入している。
  name: state.sample.name, 
  allRoutes: state.user.allRoutes,
  currentRoute: state.user.currentRoute,
  currentRouteId: state.user.currentRouteId,
  isModalVisible: state.user.isModalVisible
})

const mapDispatchToProps = (dispatch: any) => ({
  addNewRecord: () => dispatch(addNewRecord()),
  addPointName: (newPointName: string) => dispatch(addPointName(newPointName)),
  loadAllRoutes: (routes: Route[], currentRouteId: number) => dispatch(loadAllRoutes(routes, currentRouteId)),
  saveRoute: () => dispatch(saveRoute())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteEntry)

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = ReturnType<typeof mapDispatchToProps>
type RouteEntryProps = StateProps & DispatchProps
