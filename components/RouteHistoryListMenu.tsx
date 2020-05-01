import * as React from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import Modal from "react-native-modal";

export interface ListMenuItem {
  menuTitle: string
  onMenuPress: () => void
}

/**
 * プロパティ定義
 */
export interface RouteHistoryListMenuProps {
  menuItems: ListMenuItem[]
  isModalVisible: boolean
  onMenuHide: () => void
}

/**
 * State定義
 */
export interface RouteHistoryListMenuState {
  menuItems: ListMenuItem[]
}


/**
 * ルート履歴画面でロングタップした時に表示されるポップアップメニュー
 */
export default class RouteHistoryListMenu extends React.Component<RouteHistoryListMenuProps, RouteHistoryListMenuState> {

  /**
   * コンストラクタ
   * @param props 
   */
  constructor(props: RouteHistoryListMenuProps) {
    super(props)
    this.state = {
      menuItems: props.menuItems
    }
  }

  render() {
    return (
      <Modal isVisible={this.props.isModalVisible} onModalHide={this.props.onMenuHide}>
        <FlatList
          data={this.props.menuItems}
          renderItem={value => this.renderList(value.item)}
          keyExtractor={(value, index) => index.toString()} />
      </Modal>
    )
  }

  renderList = (item: ListMenuItem) => {
    return (
      <ListItem title={item.menuTitle} onPress={() => { item.onMenuPress() }} />
    )
  }
}


// /**
//  * ルート履歴画面でロングタップした時に表示されるポップアップメニュー
//  */
// export default class RouteHistoryListMenu extends React.Component<RouteHistoryListMenuProps, RouteHistoryListMenuState> {

//   /**
//    * コンストラクタ
//    * @param props 
//    */
//   constructor(props: RouteHistoryListMenuProps) {
//     super(props)
//     this.state = {
//       menuItems: props.menuItems
//     }
//   }

//   render() {
//     return (
//       <Modal isVisible={this.props.isModalVisible}>
//         <FlatList
//           data={this.props.menuItems}
//           renderItem={value => this.renderList(value.item)}
//           keyExtractor={(value, index) => index.toString()} />
//       </Modal>
//     )
//   }

//   renderList = (item: ListMenuItem) => {
//     return (
//       <ListItem title={item.menuTitle} onPress={() => { item.onMenuPress() }} />
//     )
//   }
// }
