import * as React from 'react';
import { View, Button, StyleSheet, FlatList } from 'react-native';

import {Drive, DriveCondition} from './domains/Drive';
import DriveList, {DeviceListProps} from './components/DriveList';
import PointNameDialog, { PointNameDialogState } from './components/PointNameDialog';
import DriveHistory from './domains/DriveHistory';

/**
 * State定義
 */
interface AppState {
  drives: DriveHistory;
  isModalVisible: boolean;
}

/**
 * ApplicationComponent
 */
export default class App extends React.Component<{}, AppState> {

  /**
   * Constructor
   */
  constructor(props: {}) {
    super(props);
    this.state = {
      drives: new DriveHistory(),
      isModalVisible: false
    } as AppState;
  }
 
  /**
   * render main view.
   */
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.drives.getDriveList()}
          renderItem={value => this.renderList(value.item)}
          keyExtractor={value => `${value.id}`}
        />
        <View>
          <Button
            title="Record"
            onPress={this.handleRecordBtnClick}
          />
        </View>
        <PointNameDialog isModalVisible={this.state.isModalVisible} 
                         onDialogDismiss={this.handleDialogDismiss} />
      </View>
    );
  }

  /**
   * render drive process list
   */
  renderList = (item: Drive) => {
    //Optional型のアンラップはもう少し丁寧にやる
    return (
      <DriveList
        pointName={item.pointName!}
        arrivalTime={item.arrivalTime!}
        departureTime={item.departureTime!}
      />
    );
  };

  /**
   * Recordボタン押下時の処理
   */
  handleRecordBtnClick = () => {
    this.state.drives.addNewRecord();
    const latestDrive = this.state.drives.getLatestDrive();
    this.setState({
      ...this.state,
      isModalVisible: latestDrive.mode === DriveCondition.WAIT_FOR_POINT_NAME
    });
  }

  /**
   * モーダルダイアログで発生したイベントハンドリング
   */
  handleDialogDismiss = (value: PointNameDialogState) => {
    if (value !== undefined) {
      this.state.drives.addPointName(value.pointName); 
    }
    this.setState({
      ...this.state,
      isModalVisible: false
    });   
  }
}

/**
 * Define view styles.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
