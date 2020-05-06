import * as React from 'react'
import { FlatList } from 'react-native'
import { ListItem } from 'react-native-elements'
import Modal from "react-native-modal"

export interface ListMenuItem {
  menuTitle: string
  onMenuPress: () => void
  onMenuHide: () => void
}

/**
 * プロパティ定義
 */
export interface RouteHistoryListMenuProps {
  menuItems: ListMenuItem[]
  isModalVisible: boolean
}

let handleOnModalHide: () => void

export default (props: RouteHistoryListMenuProps) => {
  return (
    <Modal isVisible={props.isModalVisible} onModalHide={handleOnModalHide}>
      <FlatList
        data={props.menuItems}
        renderItem={value => renderList(value.item)}
        keyExtractor={(value, index) => index.toString()} />
    </Modal>
  )

  function renderList(item: ListMenuItem) {
    return (
      <ListItem title={item.menuTitle} onPress={() => handleOnPress(item)} />
    )
  }

  function handleOnPress(item: ListMenuItem) {
    handleOnModalHide = item.onMenuHide
    item.onMenuPress()
  }
}
