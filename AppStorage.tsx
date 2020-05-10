import { Drive } from './domains/Drive'
import { Route } from './domains/Route'
import Storage from 'react-native-storage'
import { AsyncStorage } from 'react-native'

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {}
})

export default class AppStorage {

  saveCurrentRoute = (drives: Drive[]) => {
    try {
      storage.save({
        key: 'currentDrives',
        data: drives
      })
    } catch (error) {
      // Error saving data
    }
  }

  saveAllRoutes = (routes: Route[], currentRouteId: number) => {
    try {
      storage.save({
        key: 'allRoutes',
        data: routes
      })
      storage.save({
        key: 'currentRouteId',
        data: currentRouteId
      })
    } catch (error) {
      // Error saving data
      console.warn('err:' + error)
    }
  }

  loadAllRoutes = async () => {
    let allRoutes: Route[]
    let currentRouteId: number
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

    return {
      allRoutes: allRoutes,
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
