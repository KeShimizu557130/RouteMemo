import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Drive } from '../domains/Drive'
import { Route, RouteImpl } from '../domains/Route'

export interface RouteReducerInterface {
  allRoutes: Route[]          // 全ルート
  currentDrives: Drive[]      // 現在入力中のルート詳細
  currentRouteId: number      // 現在入力中のルートのid
}

/**
 * stateの初期値
 */
const initialState: RouteReducerInterface = setUpState()
function setUpState(): RouteReducerInterface {
  const newCurrentRoute = RouteImpl.newRoute()
  const newRoutes = []
  newRoutes.push(newCurrentRoute)
  return {
    allRoutes: newRoutes,
    currentDrives: newCurrentRoute.drives,
    currentRouteId: newCurrentRoute.id
  }
}

const routeModule = createSlice({
  name: 'route',
  initialState: initialState,
  reducers: {
    // currentRouteに新しいdrivesを設定する
    setCurrentDrives: (state: RouteReducerInterface, action: PayloadAction<Drive[]>) => {
      state.currentDrives = action.payload
    },
    setAllRoute: (state: RouteReducerInterface, action: PayloadAction<Route[]>) => {
      state.allRoutes = action.payload
    },
    setCurrentRouteId: (state: RouteReducerInterface, action: PayloadAction<number>) => {
      state.currentRouteId = action.payload
    },
    // ルート削除（未実装）
    deleteRoute: (state: RouteReducerInterface, action) => {
    }
  }
})

export const { setCurrentDrives, setAllRoute, setCurrentRouteId } = routeModule.actions

export default routeModule

