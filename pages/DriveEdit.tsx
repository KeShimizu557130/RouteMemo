import * as React from 'react'
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { Drive } from '../domains/Drive'
import { updateDrive } from '../thunk/RouteThunk'
import { NavigationScreenProp } from 'react-navigation'

/**
 * ApplicationComponent
 */
export default ({ route, navigation }) => {
  const [drive, setDrive] = React.useState<Drive>(route.params.drive)

  React.useEffect(() => {
    if (route.params?.drive) {
      const newDrive = { ...route.params.drive }
      setDrive(newDrive)
    }
  }, [route.params?.drive])

  return (
    <View style={styles.container}>
      <DriveDataArea
        onPointNameChange={handlePointNameChange}
        onPointMemoChange={handlePointMemoChange}
        pointName={drive.pointName}
        pointMemo={drive.pointMemo} />
      <ButtonArea navigation={navigation} originDrive={route.params.drive} editDrive={drive} />
    </View>
  )

  function handlePointNameChange(newPointName: string) {
    const newDrive = { ...drive }
    newDrive.pointName = newPointName
    setDrive(newDrive)
  }

  function handlePointMemoChange(newPointMemo: string) {
    const newDrive = { ...drive }
    newDrive.pointMemo = newPointMemo
    setDrive(newDrive)
  }
}

/**
 * ルート表示領域
 */
const DriveDataArea: React.FC<{ onPointNameChange: (string) => void, onPointMemoChange: (string) => void, pointName: string, pointMemo: string }> = ({ onPointNameChange, onPointMemoChange, pointName, pointMemo }) => {
  return (
    <View>
      <Text>地点名</Text>
      <TextInput style={styles.pointNameInput} value={pointName} onChangeText={(text) => onPointNameChange(text)} />
      <Text>地点メモ</Text>
      <TextInput style={styles.pointMemoInput} multiline value={pointMemo} onChangeText={(text) => onPointMemoChange(text)} />
    </View>
  )
}

/**
 * ボタン表示領域
 */
const ButtonArea: React.FC<{ navigation: NavigationScreenProp<any, any>, originDrive: Drive, editDrive: Drive }> = ({ navigation, originDrive, editDrive }) => {
  const dispatch = useDispatch()

  return (
    <View>
      <Button title="OK" onPress={handleRecordBtnClick} />
      <Button title="Cancel" onPress={handleStoreBtnClick} />
    </View>
  )

  /**
   * OKボタン押下時の処理
   */
  function handleRecordBtnClick() {
    // const newDrive = { ...originDrive }
    // newDrive.pointName = editDrive.pointName
    const newDrive = { ...editDrive }
    newDrive.id = originDrive.id
    dispatch(updateDrive(newDrive))
    navigation.navigate('Entry')
  }

  /**
   * Cancelボタン押下時の処理
   */
  function handleStoreBtnClick() {
    navigation.navigate('Entry')
  }
}

/**
 * Define view styles.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pointNameInput: {
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 2
  },
  pointMemoInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 2
  },
})
