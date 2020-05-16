import * as React from 'react'
import { TextInput, StyleSheet } from 'react-native'
import { useSelector, useDispatch, useCallback } from 'react-redux'
import { NavigationScreenProp } from 'react-navigation'
import { Container, Header, Content, Button, List, ListItem, Left, Body, Right, Icon, Text } from 'native-base'
import { AppStateInterface } from '../store/store'
import { saveSetting } from '../thunk/SettingsThunk'
import Prompt from '../components/Prompt'

interface AppSettingsProps {
  navigation: NavigationScreenProp<any, any>
}

/**
 * ApplicationComponent
 */
export default (props: AppSettingsProps) => {
  const settings = useSelector<AppStateInterface>(state => state.settings)
  const [isVisible, setVisible] = React.useState<boolean>(false)
  const [promptVal, setPromptVal] = React.useState<string>('')
  const [promptItem, setPromptItem] = React.useState<string>('')
  const dispatch = useDispatch()

  return (
    <Container>
      <Content>
        <ListItem icon onPress={() => handleOnListItemPress('exportMailAddress')}>
          <Left>
            <Button style={{ backgroundColor: "#007AFF" }}>
              <Icon active name="wifi" />
            </Button>
          </Left>
          <Body>
            <Text>エクスポート用メールアドレス</Text>
          </Body>
          <Right>
            <Text>{settings.exportMailAddress}</Text>
          </Right>
        </ListItem>
        <ListItem icon onPress={() => handleOnListItemPress('defaultFirstPointName')}>
          <Left>
            <Button style={{ backgroundColor: "#007AFF" }}>
              <Icon active name="bluetooth" />
            </Button>
          </Left>
          <Body>
            <Text>最初の地点名</Text>
          </Body>
          <Right>
            <Text>{settings.defaultFirstPointName}</Text>
          </Right>
        </ListItem>
      </Content>
      <Prompt
        title="Say something"
        inputPlaceholder="Enter Some Text"
        isVisible={isVisible}
        onChangeText={(text) => setPromptVal(text)}
        onCancel={() => setVisible(false)}
        onSubmit={handleOnPromptSubmit}
        onBackButtonPress={() => setVisible(false)}
      />
    </Container>
  )

  function handleOnPromptSubmit() {
    setVisible(false)
    dispatch(saveSetting(promptItem, promptVal))
  }

  function handleOnListItemPress(item: string) {
    setPromptItem(item)
    setPromptVal('')
    setVisible(true)
  }
}

/**
 * Define view styles.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
})