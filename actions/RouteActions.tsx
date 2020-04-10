

// actions.js
// actionはreduxの機能でなく、オブジェクトを作るための純粋なjsの関数です。
export const addNewRecord = () => ({
    type: 'ADD_NEW_RECORD',
})
  
  export const addPointName = (newPointName: string) => ({
    type: 'ADD_POINT_NAME',
    pointName: newPointName
  })
  import { Route, RouteImpl } from '../domains/Route';
  
  
  export const loadAllRoutes = (routes: Route[], currentRouteId: number) => ({
    type: 'LOAD_ALL_ROUTES',
    routes: routes,
    currentRouteId: currentRouteId
  })
  
  export const loadRoute = (route: Route) => ({
    type: 'LOAD_ROUTE',
    route: route
  })
  
  export const saveRoute = () => ({
    type: 'SAVE_ROUTE'
  })
  
  export const createRoute = () => ({
    type: 'CREATE_ROUTE'
  })
  
  export const renameRoute = (routeId: number, newRouteName: string) => ({
    type: 'RENAME_ROUTE',
    routeId: routeId,
    newRouteName: newRouteName
  })
  
  export const setRouteHistoryPopupMenuVisible = (visible: boolean) => ({
    type: 'SET_ROUTE_HISTORY_POPUPMENU_VISIBLE',
    visible: visible
  })
  
  export const deleteRoute = () => ({
    type: 'DELETE_ROUTE'
  })
  
  export const setRouteNameEntryDialogVisible = (visible: boolean) => ({
    type: 'SET_ROUTE_NAME_ENTRY_DIALOG_VISIBLE',
    visible: visible
  })