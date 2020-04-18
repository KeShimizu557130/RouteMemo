import { Action, Dispatch } from 'redux';
import { AppStateInterface } from '../store/store';
import AppStorage from '../AppStorage'

const appStorage = new AppStorage()

/**
 * サンプル処理
 */
export const saveRoute = () => {
    return (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
        const newRoutes = getState().route.allRoutes.map(value => {
            if (value.id !== getState().route.currentRouteId) return value
            return { ...getState().route.currentRoute }
        })
        if (newRoutes.length === 0) newRoutes.push(getState().route.currentRoute)
        appStorage.saveAllRoutes(newRoutes, getState().route.currentRouteId)
    }
}