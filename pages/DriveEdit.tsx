import * as React from 'react'
import { View, Text, TextInput, Button, TouchableHighlight, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { Drive } from '../domains/Drive'
import { updateDrive } from '../thunk/RouteThunk'
import { NavigationScreenProp } from 'react-navigation'
import DateTimePicker, { Event } from '@react-native-community/datetimepicker'
import { dateFormat } from '../util/dateFormat'

/**
 * ApplicationComponent
 */
export default ({ route, navigation }) => {
  const [drive, setDrive] = React.useState<Drive>(route.params.drive)
  const [isVisibleTimePicker, setTimePickerVisible] = React.useState<boolean>(false)
  const [editingTimeItem, setEditingTimeItem] = React.useState<string>('')    // 編集中の項目 到着時刻または出発時刻

  React.useEffect(() => {
    if (route.params?.drive) {
      setDrive({ ...route.params.drive })
    }
  }, [route.params?.drive])

  return (
    <View style={styles.container}>
      <DriveDataArea
        onPointNameChange={handlePointNameChange}
        onPointMemoChange={handlePointMemoChange}
        onTimeTap={handleOnTimeTap}
        pointName={drive.pointName}
        pointMemo={drive.pointMemo}
        arrivalTime={drive.arrivalTime}
        departureTime={drive.departureTime} />
      <ButtonArea navigation={navigation} originDrive={route.params.drive} editDrive={drive} />
      <ModalArea isVisible={isVisibleTimePicker} value={drive.arrivalTime} onTimePicked={handleOnTimePicked} />
    </View>
  )

  function handleOnTimeTap(item: string) {
    setEditingTimeItem(item)
    setTimePickerVisible(true)
  }

  function handleOnTimePicked(event: Event, selectedDate: Date) {
    setTimePickerVisible(false)
    if (typeof selectedDate !== 'undefined') {
      if (editingTimeItem == 'Arrival') {
        setDrive({ ...drive, arrivalTime: selectedDate.getTime() })
      } else if (editingTimeItem == 'Departure') {
        setDrive({ ...drive, departureTime: selectedDate.getTime() })
      }
    }
  }

  function handlePointNameChange(newPointName: string) {
    setDrive({ ...drive, pointName: newPointName })
  }

  function handlePointMemoChange(newPointMemo: string) {
    setDrive({ ...drive, pointMemo: newPointMemo })
  }
}

const ModalArea: React.FC<{ isVisible: boolean, value: number, onTimePicked: (Event, Date) => void }> = ({ isVisible, value, onTimePicked }) => {
  return (
    <View>
      {isVisible && (<DateTimePicker
        testID="dateTimePicker"
        value={(new Date(value))}
        mode={'time'}
        is24Hour={true}
        display='spinner'
        onChange={onTimePicked}
      />)}
    </View>
  )
}

/**
 * 地点情報表示・入力領域
 */
const DriveDataArea: React.FC<{ onPointNameChange: (string) => void, onPointMemoChange: (string) => void, onTimeTap: (string) => void, pointName: string, pointMemo: string, arrivalTime: number, departureTime: number }> = ({ onPointNameChange, onPointMemoChange, onTimeTap, pointName, pointMemo, arrivalTime, departureTime }) => {

  return (
    <View>
      <Text>地点名</Text>
      <TextInput style={styles.pointNameInput} value={pointName} onChangeText={(text) => onPointNameChange(text)} />
      <Text>地点メモ</Text>
      <TextInput style={styles.pointMemoInput} multiline value={pointMemo} onChangeText={(text) => onPointMemoChange(text)} />
      <TouchableHighlight onPress={() => onTimeTap('Arrival')}>
        <Text>到着時刻 {dateToString(arrivalTime)}</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => onTimeTap('Departure')}>
        <Text>出発時刻 {dateToString(departureTime)}</Text>
      </TouchableHighlight>
    </View>
  )

  function dateToString(date: number) {
    return ((typeof date === "undefined") ? "" : dateFormat.format(new Date(date), 'hh:mm'))
  }
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
