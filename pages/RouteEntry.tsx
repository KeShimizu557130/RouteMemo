import * as React from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Drive, DriveCondition } from '../domains/Drive'
import { Route } from '../domains/Route'
import DriveList from '../components/DriveList'
import PointNameDialog from '../components/PointNameDialog'
import { AppStateInterface } from '../store/store'
import { addNewRecord, backRecord, createRoute, exportToMail, mergeCurrentRouteToAllRoute } from '../thunk/RouteThunk'
import { Icon } from 'react-native-elements'
import { Container, Header, View, Button, Text, Icon as NbIcon, Fab } from 'native-base'

/**
 * ApplicationComponent
 */
export default (props) => {
  return (
    <Container>
      <View style={styles.container}>
        <RouteArea navigation={props.navigation} />
        <ButtonArea />
        <ModalArea />
      </View>
    </Container>
  )
}

/**
 * ルート表示領域
 */
const RouteArea = (props) => {
  const currentDrives = useSelector<AppStateInterface>(state => state.route.currentDrives)

  return (
    <FlatList<Drive>
      data={currentDrives}
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
  const [isFabOpen, setFabOpen] = React.useState<boolean>(false)
  const allRoutes: Route[] = useSelector<AppStateInterface>(state => state.route.allRoutes)
  const currentRouteId: number = useSelector<AppStateInterface>(state => state.route.currentRouteId)
  const dispatch = useDispatch()

  return (
    <View>
      <Icon
        name='circle-edit-outline'
        type='material-community'
        color='#f50'
        reverse
        size={52}
        containerStyle={styles.recordButton}
        onPress={() => dispatch(addNewRecord())} />
      
      <Fab
        active={isFabOpen}
        direction="up"
        containerStyle={{ }}
        style={{ backgroundColor: '#5067FF' }}
        position="bottomLeft"
        onPress={() => setFabOpen(!isFabOpen)}>
        <NbIcon name="bars" type="AntDesign" />
        <Button style={{ backgroundColor: '#34A34F' }}>
          <NbIcon name="book-remove" type="MaterialCommunityIcons" />
        </Button>
        <Button style={{ backgroundColor: '#3B5998' }} onPress={() => dispatch(createRoute()) }>
          <NbIcon name="book-plus" type="MaterialCommunityIcons" />
        </Button>
        <Button style={{ backgroundColor: '#DD5144' }} onPress={handleExportRoute}>
          <NbIcon name="email" type="MaterialCommunityIcons" />
        </Button>
        <Button style={{ backgroundColor: '#DD5144' }} onPress={() => dispatch(backRecord()) }>
          <NbIcon name="undo-variant" type="MaterialCommunityIcons" />
        </Button>
      </Fab>
        
    </View>
  )

  function handleExportRoute() {
    dispatch(mergeCurrentRouteToAllRoute())
    dispatch(exportToMail(currentRouteId))
  }

  /**
   * デバッグ用
   */
  function dumpStore() {
    console.log('allRoutes:' + JSON.stringify(allRoutes))
    console.log('currentRoute:' + JSON.stringify(currentRouteId))
  }
}

/**
 * モーダル表示領域
 */
const ModalArea = () => {
  const currentDrives = useSelector<AppStateInterface>(state => state.route.currentDrives)
  const defaultPointName = useSelector<AppStateInterface>(state => state.settings.defaultFirstPointName)

  return (
    <PointNameDialog isModalVisible={isModalVisible()} defaultPointName={getDefaultPointName()} />
  )

  function getDefaultPointName(): string {
    if (currentDrives.length === 1) return defaultPointName
    else return ''
  }

  function isModalVisible(): boolean {
    if (currentDrives.length === 0) return false
    const latestDrive = currentDrives[currentDrives.length - 1]
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
