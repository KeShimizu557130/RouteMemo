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
    const newDrives = addNewRecordImpl(getState().route.currentRoute.drives)
    dispatch(setDrives(newDrives))
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
  }
}

/**
 * ログを追加します
 */
const addNewRecordImpl = (drives: Drive[]): Drive[] => {
  let newDrives
  if (drives.length === 0 || isAllAreaInputed(getLatestDrive(drives))) {
    newDrives = [...drives]
    newDrives.push(
      new DriveImpl(
        drives.length,
        undefined,
        Date.now(),
        undefined,
        DriveCondition.WAIT_FOR_POINT_NAME
      )
    )
  } else {
    newDrives = drives.map((drive, index) => {
      if (index !== drives.length - 1) return drive
      return moveNextInput(drive)
    })
  }
  return newDrives
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

export const createRoute = () => {
  return (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
    const state = getState().route
    let issaved = false
    const newRoutes = state.allRoutes.map(value => {
      if (value.id !== state.currentRouteId) return value
      issaved = true
      return state.currentRoute
    })
    if (!issaved) newRoutes.push(state.currentRoute)

    // currentRouteに新しいRouteを設定する
    const newCurrentRoute = RouteImpl.newRoute()
    newRoutes.push(newCurrentRoute)

    dispatch(setAllRoute(newRoutes))
    dispatch(setCurrentRoute(newCurrentRoute))
  }
}

export const loadAllRoutes = () => {
  return async (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
    try {
      const routesAndCurrent = await appStorage.loadAllRoutes()

      const newRoutes = routesAndCurrent.allRoutes
      let newCurrentRouteId = routesAndCurrent.currentRouteId
      // 現在のルートを読み込み
      let newCurrentRoute = newRoutes.find((value) => value.id === newCurrentRouteId)
      if (typeof newCurrentRoute === 'undefined') {
        // 現在のルートを新規生成
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
      dispatch(setAllRoute(newRoutes))
    } else {
      const newCurrentRoute = { ...state.currentRoute }
      newCurrentRoute.routeName = newRouteName
      dispatch(setAllRoute(newRoutes))
      dispatch(setCurrentRoute(newCurrentRoute))
    }
  }
}

/**
 * ルート名を変更します
 */
const renameRouteImpl = (routes: Route[], routeId: number, newRouteName: string): Route[] => {
  const newRoutes = routes.map(value => {
    if (value.id !== routeId) return value
    const newRoute = { ...value }
    newRoute.routeName = newRouteName
    return newRoute
  })
  return newRoutes
}

export const loadRoute = (route: Route) => {
  return (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
    const state = getState().route

    const newRoutes = state.allRoutes.map(value => {
      if (value.id !== state.currentRouteId) return value
      return state.currentRoute
    })

    // Actionで渡されたRouteをcurrentRouteとcurrentRouteIdに設定する
    if (route.id !== state.currentRouteId) {
      const newRoute = { ...route }
      dispatch(setAllRoute(newRoutes))
      dispatch(setCurrentRoute(newRoute))
    } else {
      dispatch(setAllRoute(newRoutes))
    }
  }
}

export const updateDrive = (newDrive: Drive) => {
  return (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
    const state = getState().route
    const newDrives = state.currentRoute.drives.map((drive) => {
      if (drive.id === newDrive.id) return newDrive
      return drive
    })
    dispatch(setDrives(newDrives))
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
