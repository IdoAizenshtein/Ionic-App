/**
 * @format
 */
import 'intl'
import 'intl/locale-data/jsonp/en'
import 'intl/locale-data/jsonp/he'
import { AppRegistry, I18nManager } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import GlobalFont from 'react-native-global-font'

if (!__DEV__) {
  console = {}
  console.log = () => null
  console.warn = () => null
  console.error = () => null
}

GlobalFont.applyGlobal('Assistant-Regular')
I18nManager.forceRTL(false)
I18nManager.allowRTL(false)
console.disableYellowBox = true
AppRegistry.registerComponent(appName, () => App)