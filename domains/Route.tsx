import { Drive } from './Drive'
import { dateFormat } from '../util/dateFormat'

/**
 * ルートクラス
 * IDは「Date.now()」を設定する
 */
export interface Route {
  id: number
  drives: Drive[]
  routeName?: string
  timestamp?: number
}

export class RouteImpl implements Route {
  id: number
  drives: Drive[]
  routeName?: string
  timestamp?: number

  /**
   * コンストラクタ
   */
  constructor(id: number, routeName: string = '') {
    this.id = id
    this.drives = []
    this.routeName = routeName
  }

  static newRoute(): Route {
    const now = new Date()
    const newCurrentRoute = new RouteImpl(
      now.getTime(),
      dateFormat.format(now, 'yyyy/MM/dd hh:mm') + 'のルート'
    )
    return newCurrentRoute as Route
  }
}
