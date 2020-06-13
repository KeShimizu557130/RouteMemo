import { Action, Dispatch } from 'redux'
import { AppStateInterface } from '../store/store'
import { Drive, DriveImpl, DriveCondition } from '../domains/Drive'
import AppStorage from '../AppStorage'
import { setDrives, setAllRoute, setCurrentRoute } from '../reducers/RouteReducer'
import { Route, RouteImpl } from '../domains/Route'
import * as MailComposer from 'expo-mail-composer'
import * as FileSystem from 'expo-file-system'
import { dateFormat } from '../util/dateFormat'

const appStorage = new AppStorage()

/**
 * サンプル処理
 */
export const saveAllRoutes = () => {
  return (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
    const state = getState().route
    const newRoutes = state.allRoutes.map(value => {
      if (value.id !== state.currentRouteId) return value
      return { ...state.currentRoute }
    })
    if (newRoutes.length === 0) newRoutes.push(state.currentRoute)
    appStorage.saveAllRoutes(newRoutes, state.currentRouteId)
  }
}

export const addNewRecord = () => {
  return (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
    const newDrives: Drive[] = addNewRecordImpl(getState().route.currentRoute.drives)
    dispatch(setDrives(newDrives))
    appStorage.saveCurrentDrives(newDrives)
  }
}

export const addPointName = (pointName: string, pointMemo: string) => {
  return (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
    const state = getState().route
    const newDrives = state.currentRoute.drives.map((drive, index) => {
      if (index !== state.currentRoute.drives.length - 1) return drive
      const newDrive = { ...drive }
      newDrive.pointName = pointName
      newDrive.pointMemo = pointMemo
      newDrive.mode = DriveCondition.WAIT_FOR_ARRIVAL
      return newDrive
    })
    dispatch(setDrives(newDrives))
    appStorage.saveCurrentDrives(newDrives)
  }
}

/**
 * 地点名入力ダイアログでキャンセル押下された場合
 */
export const addPointNameCancel = () => {
  return (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
    const state = getState().route

    const newDrives = state.currentRoute.drives.map((drive, index) => {
      if (index !== state.currentRoute.drives.length - 1) return drive
      const newDrive = { ...drive }
      newDrive.mode = DriveCondition.WAIT_FOR_POINT_NAME_CANCELED
      return newDrive
    })
    dispatch(setDrives(newDrives))
    appStorage.saveCurrentDrives(newDrives)
  }
}

/**
 * ログを追加します
 */
const addNewRecordImpl = (drives: Drive[]): Drive[] => {
  let newDrives: Drive[] = []
  if (drives.length === 0) {
    const newDrive = new DriveImpl(
        drives.length,
        undefined,
        0,
        undefined,
        DriveCondition.WAIT_FOR_POINT_NAME
      )
    newDrives.push(newDrive)
  } else if (isAllAreaInputed(getLatestDrive(drives))) {
    newDrives = [...drives]
    const newDrive = new DriveImpl(
        drives.length,
        undefined,
        Date.now(),
        undefined,
        DriveCondition.WAIT_FOR_POINT_NAME
      )
    newDrives.push(newDrive)
    if (newDrives.length > 1) {
      // 移動時間設定
      const previousDrive = {...newDrives[newDrives.length - 2]}
      previousDrive.driveTime = calcDriveTime(newDrive, previousDrive)
      newDrives[newDrives.length - 2] = previousDrive
    }
  } else {
    newDrives = drives.map((drive, index) => {
      if (index !== drives.length - 1) return drive
      return moveNextInput(drive)
    })
  }
  return newDrives
}

const calcDriveTime = (drive: Drive, prevDrive: Drive): number => {
  return drive.arrivalTime - prevDrive.departureTime - 9 * 3600 * 1000
}

const moveNextInput = (drive: Drive): Drive => {
  const newDrive = { ...drive }
  if (newDrive.arrivalTime === undefined) {
    // このコードを通ることはないはず
    newDrive.arrivalTime = Date.now()
  } else if (newDrive.pointName === undefined) {
    newDrive.mode = DriveCondition.WAIT_FOR_POINT_NAME
  } else if (newDrive.departureTime === undefined) {
    newDrive.departureTime = Date.now()
    newDrive.mode = DriveCondition.WAIT_FOR_ARRIVAL
  }
  return newDrive
}

const isAllAreaInputed = (drive: Drive): boolean => {
  if (
    drive.arrivalTime !== undefined &&
    drive.pointName !== undefined &&
    drive.departureTime !== undefined
  ) {
    return true
  }
  return false
}

/**
 * 一番新しい運転履歴を取得します
 */
const getLatestDrive = (drives: Drive[]): Drive => {
  return drives[drives.length - 1]
}

/**
 * 時刻ログを削除します。
 * 地点名は削除しません。
 */
export const backRecord = () => {
  return (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
    const drives = getState().route.currentRoute.drives
    const newDrives = drives.map((drive, index) => {
      if (index !== drives.length - 1) return drive
      return moveInputBack(drive)
    })
    if (getLatestDrive(newDrives).arrivalTime === undefined) {
      // 到着時刻undefinedのときは、最後の要素を削除
      newDrives.pop()
    }
    dispatch(setDrives(newDrives))
    appStorage.saveCurrentDrives(newDrives)
  }
}

const moveInputBack = (drive: Drive): Drive => {
  const newDrive = { ...drive }
  if (newDrive.departureTime !== undefined) {
    newDrive.departureTime = undefined
  } else if (newDrive.pointName !== undefined) {
    // 地点名入力済み、到着時刻未入力の場合は何もしない
  } else if (newDrive.arrivalTime !== undefined) {
    newDrive.arrivalTime = undefined
  }
  return newDrive
}

export const createRoute = () => {
  return (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
    const state = getState().route
    // currentRouteを一旦allRoutesに保存する
    // currentRouteIdがallRoutesに存在しない場合は、削除済みとかで無効なIDなので何もしない
    const newRoutes = state.allRoutes.map(value => {
      if (value.id !== state.currentRouteId) return value
      return state.currentRoute
    })

    // currentRouteに新しいRouteを設定する
    const newCurrentRoute = RouteImpl.newRoute()
    newRoutes.push(newCurrentRoute)
    newRoutes.sort((a, b) => b.id - a.id)

    dispatch(setAllRoute(newRoutes))
    dispatch(setCurrentRoute(newCurrentRoute))
    appStorage.saveAllRoutes(newRoutes, newCurrentRoute.id)
  }
}

/**
 * ストレージからallRoutesと現在のルートを読み込み、Redux Storeに保存します
 */
export const loadAllRoutes = () => {
  return async (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
    try {
      const routesAndCurrent = await appStorage.loadAllRoutes()

      const newRoutes = routesAndCurrent.allRoutes
      let newCurrentRouteId = routesAndCurrent.currentRouteId
      // 現在のルートを読み込み
      let newCurrentRoute = newRoutes.find((value) => value.id === newCurrentRouteId)
      if (typeof newCurrentRoute === 'undefined') {
        // ストレージにcurrentRouteIdが未記録、または記録されていても無効な値だった場合、現在のルートを新規生成
        newCurrentRoute = RouteImpl.newRoute()
        newCurrentRouteId = newCurrentRoute.id
        newRoutes.push(newCurrentRoute)
      }

      dispatch(setAllRoute(newRoutes))
      dispatch(setCurrentRoute(newCurrentRoute))
    } catch (error) {
      console.warn('err:' + error)
    }
  }
}

export const renameRoute = (routeId: number, newRouteName: string) => {
  return (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
    const state = getState().route
    const newRoutes = renameRouteImpl(state.allRoutes, routeId, newRouteName)
    if (state.currentRouteId !== routeId) {
      // 変更するルートが現在のルートではない場合、allRoutesのみ更新
      dispatch(setAllRoute(newRoutes))
      appStorage.saveAllRoutes(newRoutes, state.currentRouteId)
    } else {
      // 変更するルートが現在のルートの場合、allRoutesとcurrentRouteを更新
      const newCurrentRoute = { ...state.currentRoute }
      newCurrentRoute.routeName = newRouteName
      dispatch(setAllRoute(newRoutes))
      dispatch(setCurrentRoute(newCurrentRoute))
      appStorage.saveAllRoutes(newRoutes, newCurrentRoute.id)
    }
  }
}

/**
 * routes中のrouteIdで示すルートのルート名を変更します
 */
const renameRouteImpl = (routes: Route[], routeId: number, newRouteName: string): Route[] => {
  const newRoutes: Route[] = routes.map(value => {
    if (value.id !== routeId) return value
    const newRoute: Route = { ...value }
    newRoute.routeName = newRouteName
    return newRoute
  })
  return newRoutes
}

/**
 * ルートを削除します
 * @param routeId 削除対象のルートID
 */
export const deleteRoute = (routeId: number) => {
  return (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
    const newRoutes: Route[] = getState().route.allRoutes.filter(value => value.id !== routeId)
    dispatch(setAllRoute(newRoutes))
    // currentRouteIdが削除されたルートの値だったとしても、気にしない。
    // ストレージから読み込む際など、currentRouteIdを使うタイミングで無効な値であっても対応できる処理を行うため。
    appStorage.saveAllRoutes(newRoutes, getState().route.currentRouteId)
  }
}

export const mergeCurrentRouteToAllRoute = () => {
  return (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
    const state = getState().route

    // 現在のルートをallRoutesに保存
    const newRoutes = state.allRoutes.map(val => {
      if (val.id !== state.currentRouteId) return val
      return state.currentRoute
    })
    dispatch(setAllRoute(newRoutes))
    appStorage.saveAllRoutes(newRoutes, state.currentRouteId)
  }
} 

export const loadRoute = (route: Route) => {
  return (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
    const state = getState().route

    // currentRouteがallRoutesに反映されていない場合、引数のrouteには古いルートが入っている
    // なので引数routeをそのまま現在のルートに上書きはせず、allRoutes中のrouteIdに対応するルートを現在のルートにする
    // →この処理は RouteHistory.useFocusEffect に移動

    // 引数routeのidに対応するルートをcurrentRouteに設定する
    const newRoute = { ...state.allRoutes.find(val => val.id === route.id) }
    
    dispatch(setCurrentRoute(newRoute))
    appStorage.saveCurrentRouteId(newRoute.id)
  }
}

export const updateDrive = (newDrive: Drive) => {
  return (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
    const currentDrives = getState().route.currentRoute.drives
    let updateIndex
    const newDrives = currentDrives.map((drive, index) => {
      if (drive.id === newDrive.id) {
        updateIndex = index
        // 移動時間(後)更新
        if (currentDrives.length > updateIndex + 1) {
          const nextDrive = {...currentDrives[updateIndex + 1]}
          newDrive.driveTime = calcDriveTime(nextDrive, newDrive)
        }
        return newDrive
      }
      return drive
    })
    // 移動時間(前)更新
    if (updateIndex > 0) {
      const prevDrive = {...currentDrives[updateIndex - 1]}
      prevDrive.driveTime = calcDriveTime(newDrive, prevDrive)
      newDrives[updateIndex - 1] = prevDrive
    }
    dispatch(setDrives(newDrives))
    appStorage.saveCurrentDrives(newDrives)
  }
}

export const openMail = (selectedRouteId: number) => {
  return (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
    const route = getState().route.currentRoute
    const csv = convertToCSV(route.drives)

    const uri = FileSystem.cacheDirectory + 'routeexport.csv'
    FileSystem.writeAsStringAsync(uri, csv)
    const status = MailComposer.composeAsync({
      recipients: [getState().settings.exportMailAddress],
      subject: "RouteMemoエクスポート",
      body: "ルート名称：" + route.routeName,
      attachments: [uri]
    })
    // console.log('status:' + status)
  }
}

const convertToCSV = (objArray: Drive[]): string => {
  const fields = ['date', 'arrivalTime', 'pointName', 'departureTime', 'pointMemo']
  let csv = fields.map(f => '"' + f + '"').join(', ') + '\r\n'

  for (const obj of objArray) {
    let line = ''
    const exportDrive = convertDriveForExport(obj)
    for (const field of fields) {
      line += '"' + exportDrive[field] + '", '
    }
    csv += line.slice(0, -2) + '\r\n'
  }
  return csv
}

const convertDriveForExport = (drive: Drive): object => {
  return {
    date: dateToDateString(drive.arrivalTime),
    arrivalTime: dateToTimeString(drive.arrivalTime),
    pointName: drive.pointName,
    departureTime: dateToTimeString(drive.departureTime),
    pointMemo: drive.pointMemo
  }

  function dateToTimeString(date: number) {
    return ((typeof date === 'undefined') ? '' : dateFormat.format(new Date(date), 'hh:mm:ss'))
  }
  function dateToDateString(date: number) {
    return ((typeof date === 'undefined') ? '' : dateFormat.format(new Date(date), 'yyyy/MM/dd'))
  }
}
