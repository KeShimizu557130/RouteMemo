import { Action, Dispatch } from 'redux'
import { AppStateInterface } from '../store/store'
import AppStorage from '../AppStorage'
import { setSettingValue } from '../reducers/AppSettingsReducer'

const appStorage = new AppStorage()

export const saveSetting = (key: string, value: string) => {
  return (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
    // ストレージに保存
    appStorage.saveSettings(key, value)
    // Redux Storeに保存
    dispatch(setSettingValue({ key: key, value: value }))
  }
}

export const loadAllSettings = () => {
  return async (dispatch: Dispatch<Action>, getState: () => AppStateInterface) => {
    let key = 'exportMailAddress'
    try {
      // ストレージに保存
      const value = await appStorage.loadSettings(key)
      // Redux Storeに保存
      if (value !== '') dispatch(setSettingValue({ key: key, value: value }))
    } catch (error) {
      console.warn('err:' + error)
    }

    key = 'defaultFirstPointName'
    try {
      const value = await appStorage.loadSettings(key)
      if (value !== '') dispatch(setSettingValue({ key: key, value: value }))
    } catch (error) {
      console.warn('err:' + error)
    }
  }
}