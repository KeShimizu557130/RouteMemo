import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Drive } from '../domains/Drive'
import { Route, RouteImpl } from '../domains/Route'

export interface RouteReducerInterface {
  allRoutes: Route[]
  currentRoute: Route
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
    currentRoute: newCurrentRoute
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
    },
    // ルート削除（未実装）
    deleteRoute: (state: RouteReducerInterface, action) => {
    }
  }
})

export const { setDrives, setAllRoute, setCurrentRoute } = routeModule.actions

export default routeModule

