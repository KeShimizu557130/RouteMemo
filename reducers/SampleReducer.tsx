import { createReducer } from '@reduxjs/toolkit';

/**
 * Reducerの型定義
 */
export interface SampleReducerInterface {
    name: string
}

/**
 * 初期値
 */
const initialState: SampleReducerInterface = {
    name: "hoge"
}

export default createReducer(initialState, {
  CHANGE_NAME: (state, action) => {
    console.log("***CHANGE_NAME***");
    return {
        name: action.payload
    }
  }
})

