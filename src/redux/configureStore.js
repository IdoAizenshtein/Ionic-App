import { applyMiddleware, createStore } from 'redux'
import { persistCombineReducers, persistStore } from 'redux-persist'
import logger from 'redux-logger'
// import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'remote-redux-devtools'
import appReducer from './reducers'
import asyncActionsMiddleware from './middleware/asyncActions'
import AsyncStorage from '@react-native-community/async-storage'

const storageConfig = {
  timeout: 0,
  key: 'biziboxRootState',
  storage: AsyncStorage,
  whitelist: ['isRtl', 'token', 'showPopAlertCheck', 'showPopAlertCash', 'rememberMe', 'taryePopupTimes', 'showPopAlertCreateTrans', 'mutavimPopupTimes'],
}

const reducer = persistCombineReducers(storageConfig, appReducer)

export const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(
      thunk,
      asyncActionsMiddleware,
      logger,
    ),
  ),
)

export const persistor = persistStore(store)