import * as React from 'react'
import { Text, View, TextInput, Button, StyleSheet } from 'react-native'
import Modal from "react-native-modal"

/**
 * プロパティ定義
 */
export interface RouteNameDialogProps {
  isModalVisible: boolean,
  defaultRouteName: string,
  onDialogOK: (routeName) => void,
  onDialogCancel: () => void
}

export default (props: RouteNameDialogProps) => {
  const [routeName, setRouteName] = React.useState<string>('')

  React.useEffect(() => {
    setRouteName(props.defaultRouteName)
  }, [props.isModalVisible])

  return (
    <Modal isVisible={props.isModalVisible}>
      <View style={styles.container}>
        <View>
          <Text>ルート名</Text>
          <TextInput
            value={routeName}
            style={styles.pointNameInput}
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
