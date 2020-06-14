import * as React from 'react'
import { View, Button, StyleSheet, FlatList } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Drive, DriveCondition } from '../domains/Drive'
import { Route } from '../domains/Route'
import DriveList from '../components/DriveList'
import PointNameDialog from '../components/PointNameDialog'
import { AppStateInterface } from '../store/store'
import { addNewRecord, backRecord, createRoute, exportToMail, mergeCurrentRouteToAllRoute } from '../thunk/RouteThunk'
import { FAB, Portal } from 'react-native-paper'

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
  const [isMenuOpen, setMenuOpen] = React.useState<boolean>(false)
  const allRoutes: Route[] = useSelector<AppStateInterface>(state => state.route.allRoutes)
  const currentRoute: Route = useSelector<AppStateInterface>(state => state.route.currentRoute)
  const dispatch = useDispatch()

  return (
    <View>
      <FAB
        style={styles.recordButton}
        icon="circle-edit-outline"
        onPress={() => dispatch(addNewRecord())}
      />
      <Portal>
        <FAB.Group
          style={styles.menuButton}
          open={isMenuOpen}
          icon={'menu'}
          actions={[
            { icon: 'book-remove', label: 'DeleteRoute', onPress: () => console.log('Pressed email') },
            { icon: 'book-plus', label: 'NewRoute', onPress: () => dispatch(createRoute()) },
            { icon: 'email', label: 'ExportRoute', onPress: handleExportRoute },
            { icon: 'undo-variant', label: 'Back', onPress: () => dispatch(backRecord()) },
          ]}
          onStateChange={({ open }) => setMenuOpen(open)}
          visible={true}
          onPress={() => {}}
        />
      </Portal>
    </View>
  )

  function handleExportRoute() {
    dispatch(mergeCurrentRouteToAllRoute())
    dispatch(exportToMail(currentRoute.id))
  }

  /**
   * デバッグ用
   */
  function dumpStore() {
    console.log('allRoutes:' + JSON.stringify(allRoutes))
    console.log('currentRoute:' + JSON.stringify(currentRoute))
  }
}

/**
 * モーダル表示領域
 */
const ModalArea = () => {
  return (
    <PointNameDialog isModalVisible={isModalVisible()} defaultPointName={getDefaultPointName()} />
  )

  function getDefaultPointName(): string {
    const currentRoute = useSelector<AppStateInterface>(state => state.route.currentRoute)
    const defaultPointName = useSelector<AppStateInterface>(state => state.settings.defaultFirstPointName)
    if (currentRoute.drives.length === 1) return defaultPointName
    else return ''
  }

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
  },
  recordButton: {
    position: 'absolute',
    margin: 16,
    right: 10,
    bottom: 10,
  },
  menuButton: {
    position: 'absolute',
    paddingBottom: 90,
    paddingRight: 10
  },
})
