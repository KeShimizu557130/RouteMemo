export enum DriveCondition {
  WAIT_FOR_ARRIVAL,
  WAIT_FOR_POINT_NAME,
  WAIT_FOR_POINT_NAME_CANCELED
}

export interface Drive {
  id: number
  pointName?: string
  arrivalTime?: number
  departureTime?: number
  mode: DriveCondition
  pointMemo?: string
}

export class DriveImpl implements Drive {
  id: number
  pointName?: string
  arrivalTime?: number
  departureTime?: number
  mode: DriveCondition
  pointMemo: string

  /**
   * コンストラクタ
   */
  constructor(
    id: number,
    pointName?: string,
    arrivalTime?: number,
    departureTime?: number,
    mode?: DriveCondition
  ) {
    this.id = id
    this.pointName = pointName
    this.arrivalTime = arrivalTime
    this.departureTime = departureTime
    this.mode = mode
    this.pointMemo = ''
  }
}
