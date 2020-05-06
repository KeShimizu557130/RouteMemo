import * as React from 'react'
import { Text, View, TextInput, Button, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import Modal from "react-native-modal"
import { addPointName, addPointNameCancel } from '../thunk/RouteThunk'

/**
 * プロパティ定義
 */
export interface PointNameDialogProps {
  isModalVisible: boolean
}

export default (props: PointNameDialogProps) => {
  const [pointName, setPointName] = React.useState<string>('')
  const [pointMemo, setPointMemo] = React.useState<string>('')
  const dispatch = useDispatch()

  React.useEffect(() => {
    setPointName('')
    setPointMemo('')
  }, [props.isModalVisible])

  return (
    <Modal isVisible={props.isModalVisible}>
      <View style={styles.container}>
        <View>
          <Text>地点名</Text>
          <TextInput style={styles.pointNameInput}
            onChangeText={(text) => setPointName(text)} />
        </View>
        <View>
          <Text>メモ</Text>
          <TextInput style={styles.pointMemoInput}
            multiline
            onChangeText={(text) => setPointMemo(text)} />
        </View>
        <View style={styles.pointNameDialogButtons}>
          <Button title="OK"
            onPress={() => dispatch(addPointName(pointName, pointMemo))} />
          <Button title="Cancel"
            onPress={() => dispatch(addPointNameCancel())} />
        </View>
      </View>
    </Modal>
  )
}

/**
 * Define view styles.
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
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
  pointNameDialogButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 2
  }
})
