import * as React from 'react'
import { Text, View, TextInput, Button, StyleSheet } from 'react-native'
import Modal from "react-native-modal"

/**
 * プロパティ定義
 */
export interface RouteNameDialogProps {
  onDialogOK: (routeName) => void,
  onDialogCancel: () => void,
  isModalVisible: boolean
}

export default (props: RouteNameDialogProps) => {
  const [routeName, setRouteName] = React.useState<string>('')

  return (
    <Modal isVisible={props.isModalVisible}>
      <View style={styles.container}>
        <View>
          <Text>ルート名</Text>
          <TextInput style={styles.pointNameInput}
            onChangeText={(text) => setRouteName(text)} />
        </View>
        <View style={styles.pointNameDialogButtons}>
          <Button title="OK"
            onPress={() => props.onDialogOK(routeName)} />
          <Button title="Cancel"
            onPress={() => props.onDialogCancel()} />
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
