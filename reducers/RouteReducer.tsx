import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Drive } from '../domains/Drive'
import { Route, RouteImpl } from '../domains/Route'
import { dateFormat } from '../util/dateFormat'

export interface RouteReducerInterface {
  allRoutes: Route[]
  currentRoute: Route
  currentRouteId: number
  isRouteHistoryPopupMenuVisible: boolean
  isRouteNameEntryDialogVisible: boolean
}


/**
 * 新規ルート生成
 */
const createNewRoute = (): Route => {
  const now = new Date()
  const newCurrentRoute = new RouteImpl(
    now.getTime(),
    dateFormat.format(now, 'yyyy/MM/dd hh:mm') + 'のルート'
  )
  return newCurrentRoute
}

/**
 * stateの初期値
 */
const initialState: RouteReducerInterface = setUpState()
function setUpState(): RouteReducerInterface {
  const newCurrentRoute = createNewRoute()
  const newRoutes = []
  newRoutes.push(newCurrentRoute)
  return {
    allRoutes: newRoutes,
    currentRoute: newCurrentRoute,
    currentRouteId: newCurrentRoute.id,
    isRouteHistoryPopupMenuVisible: false,
    isRouteNameEntryDialogVisible: false
  }
}

const routeModule = createSlice({
  name: 'route',
  initialState: initialState,
  reducers: {
    // currentRouteに新しいdrivesを設定する
    setDrives: (state: RouteReducerInterface, action: PayloadAction<Drive[]>) => {
      const newCurretRoute = {
        ...state.currentRoute,
        drives: action.payload
      }
      state.currentRoute = newCurretRoute
    },
    setAllRoute: (state: RouteReducerInterface, action: PayloadAction<Route[]>) => {
      state.allRoutes = action.payload
    },
    setCurrentRoute: (state: RouteReducerInterface, action: PayloadAction<Route>) => {
      state.currentRoute = action.payload
      state.currentRouteId = action.payload.id
    },
    // ルート履歴画面ポップアップメニュー表示切り替え
    setRouteHistoryPopupmenuVisible: (state: RouteReducerInterface, action: PayloadAction<boolean>) => {
      state.isRouteHistoryPopupMenuVisible = action.payload
    },
    // ルート名入力ダイアログ表示
    setRouteNameEntryDialogVisible: (state: RouteReducerInterface, action: PayloadAction<boolean>) => {
      state.isRouteNameEntryDialogVisible = action.payload
    },
    // ルート削除（未実装）
    deleteRoute: (state: RouteReducerInterface, action) => {
    }
  }
})



export const { setDrives, setAllRoute, setCurrentRoute,
  setRouteHistoryPopupmenuVisible, setRouteNameEntryDialogVisible } = routeModule.actions

export default routeModule

