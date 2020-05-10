import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AppSettingsReducerInterface {
  exportMailAddress: string
  defaultFirstPointName: string
}

/**
 * stateの初期値
 */
const initialState: AppSettingsReducerInterface = {
  exportMailAddress: 'sample@gmail.com',
  defaultFirstPointName: ''
}

const settingsModule = createSlice({
  name: 'settings',
  initialState: initialState,
  reducers: {
    setSettingValue: (state: AppSettingsReducerInterface, action: PayloadAction<{ key: string, value: string }>) => {
      switch (action.payload.key) {
        case 'exportMailAddress': state.exportMailAddress = action.payload.value; break;
        case 'defaultFirstPointName': state.defaultFirstPointName = action.payload.value; break;
      }
    }
  }
})

export const { setSettingValue } = settingsModule.actions

export default settingsModule

