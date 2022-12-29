import { Alert, Platform } from 'react-native'
import { messaging, notifications } from 'react-native-firebase'
import { LocaleConfig } from 'react-native-calendars'
import {
  changePasswordApi,
  messagesCountApi,
  otpTokenApi,
  resetPasswordApi,
  searchkeyApi,
  signupCreateApi,
  tokenApi,
  updatePushNotificationData,
  userApi,
} from '../../api'
import {
  CHANGE_PASSWORD,
  GET_MESSAGES_COUNT,
  GET_SEARCHKEY,
  GET_USER,
  LOGIN,
  LOGOUT,
  OTP_LOGIN,
  RESET_PASSWORD,
  SEND_PUSH_NOTIFICATION_TOKEN,
  SET_PUSH_NOTIFICATION_TOKEN,
  SIGNUP_CREATE,
} from '../constants/auth'
import { setLangDirection } from './lang'
import i18n from '../../locales/i18n'
import { getLang, isRtl } from '../../utils/func'
import AppTimezone from '../../utils/appTimezone'
/* eslint-disable-next-line */
import DeviceInfo from 'react-native-device-info'
import { IS_IOS } from '../../constants/common'

let tokenRefreshListener = () => {
}

export function login ({ username, password, rememberMe }) {
  const body = {
    body: {
      username,
      password,
      rememberMe,
      /* eslint-disable-next-line */
            'systemName': DeviceInfo.getSystemName(),
      /* eslint-disable-next-line */
            'systemVersion': DeviceInfo.getSystemVersion(),
      /* eslint-disable-next-line */
            'version': DeviceInfo.getVersion(),
      /* eslint-disable-next-line */
            'brand': DeviceInfo.getBrand(),
      /* eslint-disable-next-line */
            'model': DeviceInfo.getModel(),
      /* eslint-disable-next-line */
            'timezone': DeviceInfo.getTimezone(),
    },
  }
  return dispatch => {
    return dispatch({
      type: LOGIN.START,
      async: tokenApi.post(body),
    })
  }
}

export function otpLogin (code) {
  return dispatch => {
    return dispatch({
      type: OTP_LOGIN.START,
      async: otpTokenApi.post({ query: { code } }),
    })
  }
}

export function resetPassword (username) {
  return dispatch => {
    return dispatch({
      type: RESET_PASSWORD.START,
      async: resetPasswordApi.post({ query: { username } }),
    })
  }
}

export function changePassword (newPassword, oldPassword) {
  return dispatch => {
    return dispatch({
      type: CHANGE_PASSWORD.START,
      async: changePasswordApi.post({ body: { newPassword, oldPassword } }),
    })
  }
}

export function getUser () {
  return dispatch => {
    return dispatch({
      type: GET_USER.START,
      async: userApi.get()
        .then(user => {
          AppTimezone.setZone = (user.zone) ? user.zone : 'Asia/Jerusalem'
          const lang = getLang(user.language)
          i18n.changeLanguage(lang)
          LocaleConfig.defaultLocale = lang
          dispatch(setLangDirection(isRtl(user.language)))
          return user
        }),
    })
  }
}

export function getSearchkey () {
  return dispatch => {
    return dispatch({
      type: GET_SEARCHKEY.START,
      async: searchkeyApi.post({ body: {} })
        .then(searchkey => {
          return searchkey
        }),
    })
  }
}

export function logout () {
  return dispatch => {
    // messaging().deleteToken()
    tokenRefreshListener()
    dispatch({ type: LOGOUT })
  }
}

export function getMessagesCount (companyId) {
  return dispatch => {
    return dispatch({
      type: GET_MESSAGES_COUNT.START,
      async: messagesCountApi.post({ body: { uuid: companyId } }),
    })
  }
}

export function fcmTokenRegister () {
  return dispatch => {
    return dispatch({
      type: SET_PUSH_NOTIFICATION_TOKEN.START,
      async: messaging().hasPermission()
        .then(isEnabled => {
          if (!isEnabled) return messaging().requestPermission()
        })
        .then(() => messaging().getToken())
        .then(fcmToken => {
          tokenRefreshListener = messaging().onTokenRefresh(fcmToken => {
            console.log('---fcmToken---- tokenRefreshListener', fcmToken)
            return dispatch(sendFcmToken(fcmToken))
          })

          if (!IS_IOS) {
            const channel = new notifications.Android.Channel(
              'main',
              'Bizibox Channel',
              notifications.Android.Importance.Max,
            )
              .setDescription('Bizibox notification channel')

            notifications().android.createChannel(channel)
          }

          console.log('---fcmToken----', fcmToken)
          // this.createNotificationListeners()
          return dispatch(sendFcmToken(fcmToken))
        }),
    })
  }
}

export function sendFcmToken (pushToken) {
  // console.log('---sendFcmToken----', JSON.stringify({ osdesc: Platform.OS, pushToken } ))

  return dispatch => {
    return dispatch({
      type: SEND_PUSH_NOTIFICATION_TOKEN.START,
      async: updatePushNotificationData.post({ body: { osdesc: Platform.OS, pushToken } }),
    })
  }
}

export function signupCreate (obj) {
  return dispatch => {
    return dispatch({
      type: SIGNUP_CREATE.START,
      async: signupCreateApi.post(obj),
    })
  }
}

export function showAlert (title, body) {
  Alert.alert(
    title, body,
    [
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ],
    { cancelable: false },
  )
}