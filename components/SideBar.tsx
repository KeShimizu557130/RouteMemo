import * as React from 'react'
import { NavigationScreenProp } from 'react-navigation'
import { Container, Text, Icon, List, ListItem, Left, Body } from 'native-base'

const routes = [['Entry', 'edit'], ['History', 'book'], ['Settings', 'cog']]

export interface SideBarProps {
  navigation: NavigationScreenProp<any, any>
}

export default (props: SideBarProps) => {
  return (
    <Container>
      <List
        dataArray={routes}
        renderRow={data => renderItem(data)}
        keyExtractor={(item, index) => item[0]}
      />
    </Container>
  )

  function renderItem(item) {
    return (
      <ListItem
        icon
        onPress={() => props.navigation.navigate(item[0])}>
        <Left>
          <Icon type='FontAwesome' name={item[1]}></Icon>
        </Left>
        <Body>
          <Text>{item[0]}</Text>
        </Body>
      </ListItem>
    )
  }
}
