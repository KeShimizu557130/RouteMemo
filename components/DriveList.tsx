import * as React from 'react'
import { Text, View, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { Drive } from '../domains/Drive'
import { dateFormat } from '../util/dateFormat'

export interface DeviceListProps {
  drive: Drive,
  navigation: NavigationScreenProp<any, any>
}

export default class DriveList extends React.Component<DeviceListProps, {}> {
  /**
   * Constructor
   */
  constructor(props: DeviceListProps) {
    super(props);
  }

  render() {
    return (
      <View style={styles.row}>
        <View style={styles.rowUpper}>
          <View style={styles.left}>
            <View style={styles.verticalLine}>
              <View style={styles.circle} />
            </View>
            <TouchableOpacity onPress={this.onPress}>
              <Text>{this.props.drive.pointName != undefined && this.props.drive.pointName}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.right}>
            <Text style={styles.time}>{this.dateToString(this.props.drive.arrivalTime)}着</Text>
            <Text style={styles.time}>{this.dateToString(this.props.drive.departureTime)}発</Text>
          </View>
        </View>

        <View style={styles.rowLower}>
          <View style={styles.verticalLine} />
          <Text style={styles.move}>↓</Text>
        </View>
      </View>
    );
  }

  onPress = () => {
    this.props.navigation.navigate('Edit', { drive: this.props.drive })
  }

  dateToString = (date: number) => {
    return ((typeof date === "undefined") ? "" : dateFormat.format(new Date(date), 'hh:mm'))
  }
}


const styles = StyleSheet.create({
  row: {
    height: 60,
    backgroundColor: '#ecf0f1',
  },

  rowUpper: {
    flex: 1,
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
  },

  rowLower: {
    flexDirection: 'row',
  },

  left: {
    flex: 4,
    flexDirection: 'row',
    backgroundColor: 'lightgrey',
    alignItems: 'center',
  },

  right: {
    flex: 1,
    backgroundColor: 'lightblue',
    height: 30,
    alignItems: 'center',
    textAlign: 'left',
  },

  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'deeppink',
    backgroundColor: 'white',
    marginRight: 10,
  },

  time: {
    fontSize: 8,
    height: 12,
  },

  verticalLine: {
    width: 10,
    height: 30,
    borderColor: 'gray',
    borderRightWidth: 5,
    marginRight: 10,
    justifyContent: 'center',
  },

  move: {
    fontSize: 14,
  },
});
