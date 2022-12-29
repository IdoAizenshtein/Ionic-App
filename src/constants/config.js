/* eslint-disable-next-line */
import DeviceInfo from 'react-native-device-info'

/* eslint-disable-next-line */
export const BUNDLE_ID = DeviceInfo.getBundleId()
export const IS_DEV = BUNDLE_ID.endsWith('dev')

export const HOSTS = {
  devApp: 'http://172.25.101.41:8080',
  dev: 'http://172.25.101.21:8080',
  prod: 'https://bsecure.bizibox.biz',
  qa: 'https://qa-adm1.bizibox.biz',
}

export const HOST = IS_DEV ? HOSTS.dev : HOSTS.prod
export const BASE_URL = `${HOST}/rest/api/v1`
export const VERIFICATION_SMS_NUMBER = '0382'

export const ALERTS_TRIAL = {
  showAlert: false,
  showPopUp: false,
  showAlertActivated: false,
  showMutavimSheet: false,
  showAlertPopupCompany: false,
  alertTokens: false,
}

export const IS_LIGHT = {
  light: null,
}

export const COMPANY_INFO = {
  biziboxDowngradeDate: false,
  biziboxTrialExpired: false,
  trialBlocked: false,
  trialBlockedPopup: false,
  budgetPopUpType: false,
  budgetExpiredDays: false,
  badgetPopup: false,
  oneAccount: null,
}