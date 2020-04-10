import { Action, Dispatch } from 'redux';
import { AppStateInterface } from '../store/store';
import { changeName } from '../actions/SampleActions';

/**
 * サンプル処理
 */
export const doSomething = (name: string) => {
    return (dispatch: Dispatch<Action>, getState: AppStateInterface) => {
        console.log("***doSomething***");
        //ビジネスロジック実装する
        dispatch(changeName(name));
    }
}