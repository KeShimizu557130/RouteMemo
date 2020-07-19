import { Drive } from './domains/Drive'
import { Route } from './domains/Route'
import Storage from 'react-native-storage'
import { AsyncStorage } from 'react-native'

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
  sync: {}
})

/**
 * Storage保存読込を行うクラス。
 * キー: allRoutes, currentDrives, currentRouteId
 */
export default class AppStorage {

  saveCurrentDrives = (drives: Drive[]) => {
    try {
      storage.save({
        key: 'currentDrives',
        data: drives
      })
    } catch (error) {
      // Error saving data
    }
  }

  saveCurrentRouteId = (currentRouteId: number) => {
    try {
      storage.save({
        key: 'currentRouteId',
        data: currentRouteId
      })
    } catch (error) {
      // Error saving data
      console.warn('err:' + error)
    }
  }

  saveAllRoutes = (routes: Route[], currentDrives: Drive[], currentRouteId: number) => {
    try {
      storage.save({
        key: 'allRoutes',
        data: routes
      })
      if (typeof currentDrives !== 'undefined') {
        storage.save({
          key: 'currentDrives',
          data: currentDrives
        })
      }
      if (typeof currentRouteId !== 'undefined') {
        storage.save({
          key: 'currentRouteId',
          data: currentRouteId
        })
      }
    } catch (error) {
      // Error saving data
      console.warn('err:' + error)
    }
  }

  loadAllRoutes = async () => {
    let allRoutes: Route[]
    let currentRouteId: number
    let drives: Drive[]

    try {
      allRoutes = await storage.load({ key: 'allRoutes' })
    } catch (error) {
      switch (error.name) {
        case 'NotFoundError':
          break
        default:
          console.warn('err:' + error)
          break
      }
      allRoutes = []
    }

    try {
      currentRouteId = await storage.load({ key: 'currentRouteId' })
    } catch (error) {
      switch (error.name) {
        case 'NotFoundError':
          break
        default:
          console.warn('err:' + error)
          break
      }
      currentRouteId = -1
    }

    try {
      drives = await storage.load({ key: 'currentDrives' })
    } catch (error) {
      switch (error.name) {
        case 'NotFoundError':
          break
        default:
          console.warn('err:' + error)
          break
      }
      drives = []
    }

    // currentDrivesをマージ
    const allRoutes_merge = allRoutes.map(value => {
      if (value.id !== currentRouteId) return value
      const newRoute = {...value}
      newRoute.drives = drives
      return newRoute
    })

    return {
      allRoutes: allRoutes_merge,
      currentRouteId: currentRouteId
    }
  }

  saveSettings = (key: string, value: string) => {
    try {
      storage.save({
        key: 'settings.' + key,
        data: value
      })
    } catch (error) {
      // Error saving data
      console.warn('err:' + error)
    }
  }

  loadSettings = async (key: string) => {
    try {
      const value: string = await storage.load({ key: 'settings.' + key })
      return value
    } catch (error) {
      switch (error.name) {
        case 'NotFoundError':
          return ''
        default:
          console.warn('err:' + error)
          break
      }
    }
  }
}
