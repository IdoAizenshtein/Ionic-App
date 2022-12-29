import React, { Fragment, PureComponent } from 'react'
import {
  ActionSheetIOS,
  Animated,
  AppState,
  Image,
  Linking,
  Modal,
  Picker,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import { DrawerActions, SafeAreaView } from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import CustomIcon from 'src/components/Icons/Fontello'
import { CheckBox, Divider } from 'react-native-elements'
import DropdownPanel from './DropdownPanel'
import { translate } from 'react-i18next'
import { combineStyles as cs, goTo, sp } from 'src/utils/func'
import {
  ARCHIVES,
  BANK_ACCOUNTS,
  BANK_MATCH,
  BUDGET,
  CASH_FLOW,
  CHECKS,
  CREDIT_CARD,
  CYCLIC_TRANS,
  GOT_ABSORBED,
  HELP,
  LOGIN,
  MUTAVIM,
  OVERVIEW,
  PACKAGES,
  SETTINGS,
  SIGNUP,
  SLIKA,
  UPLOADING_DOCUMENTS,
  WAITING_ABSORBED,
} from 'src/constants/navigation'
import { getCompanies, selectCompany } from 'src/redux/actions/company'
import { logout } from 'src/redux/actions/auth'
import styles from './DrawerStyles'
import commonStyles from 'src/styles/styles'
import { colors, fonts } from 'src/styles/vars'
import { IS_IOS, USER_SCREENS } from 'src/constants/common'
import { getAccounts } from '../../redux/actions/account'
// import VersionCheck from 'react-native-version-check'
/* eslint-disable-next-line */
import DeviceInfo from 'react-native-device-info'
import { ALERTS_TRIAL, COMPANY_INFO, IS_LIGHT } from '../../constants/config'
import {
  activateUserApi,
  approveUpgradeApi,
  createApiTokenApi,
  getVersionApi,
  hideTaryaPopupApi,
  oneAccountPopUpApi,
  usersActivityApi,
} from '../../api'
import { messaging, notifications } from 'react-native-firebase'
import Toast from 'react-native-toast-native'
import AppTimezone from '../../utils/appTimezone'
import { setMutavimScreenBottomSheetTimes, setTaryePopupTimes } from '../../redux/actions/user'
import { BANK_ACCOUNTS_TAB, CREDIT_CARDS_TAB, PAYMENTS_TO_BIZIBOX_TAB } from '../../constants/settings'
import BottomSheetBudgetNav from '../BottomSheetMutavim/BottomSheetBudgetNav'
import AsyncStorage from '@react-native-community/async-storage'

/* eslint-disable-next-line */
export const BUNDLE_ID = DeviceInfo.getBundleId()
/* eslint-disable-next-line */
export const VERSION = DeviceInfo.getVersion()

export const IS_DEV = BUNDLE_ID.endsWith('dev')

@connect(state => ({
  token: state.token,
  user: state.user,
  isRtl: state.isRtl,
  companies: state.companies,
  currentCompanyId: state.currentCompanyId,
  taryePopupTimes: state.taryePopupTimes,
  mutavimPopupTimes: state.mutavimPopupTimes,
}))
@translate()
export default class Drawer extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      changeCompany: false,
      companiesList: [],
      alertState: false,
      currentOpenMenuIndex: 0,
      openAccListAndroid: false,
      appState: AppState.currentState,
      appStateBgTime: null,
      companyIdSelected: null,
      dontShowAgain: false,
      fadeAnimBiziboxTrialExpired: new Animated.Value(1),
      showLastRowPopup: false,
      showtrialBlocked: false,
      badgetPopup: false,
      showOneAccount: null,
    }
  }

  get menu () {
    const { t, user } = this.props
    const isAccountant = user.accountant
    if (!IS_LIGHT.light) {
      return (IS_DEV)
        ? (!isAccountant
          ? [
            {
              title: t('mainMenu:overview'),
              icon: 'desktop',
              name: OVERVIEW,
            },
            {
              title: t('mainMenu:financialManagement'),
              icon: 'graph-up',
              children: [
                {
                  title: t('mainMenu:bankAccount'),
                  name: BANK_ACCOUNTS,
                },
                {
                  title: t('mainMenu:creditCard'),
                  name: CREDIT_CARD,
                },
                {
                  title: t('mainMenu:checks'),
                  name: CHECKS,
                },
                {
                  title: t('mainMenu:slika'),
                  name: SLIKA,
                },
                {
                  title: t('mainMenu:mutavim'),
                  name: MUTAVIM,
                },
              ],
            },
            {
              title: t('mainMenu:cashFlow'),
              icon: 'cash',
              children: [
                {
                  title: t('mainMenu:daily'),
                  name: CASH_FLOW,
                },
                {
                  title: t('mainMenu:bankMatch'),
                  name: BANK_MATCH,
                },
                {
                  title: t('mainMenu:cyclicTrans'),
                  name: CYCLIC_TRANS,
                },
              ],
            },
            {
              title: t('mainMenu:budget'),
              icon: 'bag',
              name: BUDGET,
              notActive: COMPANY_INFO.budgetPopUpType && (COMPANY_INFO.budgetPopUpType === 2 || COMPANY_INFO.budgetPopUpType === 3),
            },
            {
              title: t('common:recommendation'),
              icon: 'RECOMMENDATION',
              name: 'RECOMMENDATION',
            },
            {
              title: t('mainMenu:help'),
              icon: 'HELP',
              name: HELP,
            },
            {
              title: t('common:settings'),
              icon: 'gear',
              name: SETTINGS,
            },
          ] : [
            {
              title: t('mainMenu:overview'),
              icon: 'desktop',
              name: OVERVIEW,
            },
            {
              title: t('mainMenu:financialManagement'),
              icon: 'graph-up',
              children: [
                {
                  title: t('mainMenu:bankAccount'),
                  name: BANK_ACCOUNTS,
                },
                {
                  title: t('mainMenu:creditCard'),
                  name: CREDIT_CARD,
                },
                {
                  title: t('mainMenu:checks'),
                  name: CHECKS,
                },
                {
                  title: t('mainMenu:slika'),
                  name: SLIKA,
                },
                {
                  title: t('mainMenu:mutavim'),
                  name: MUTAVIM,
                },
              ],
            },
            {
              title: t('mainMenu:cashFlow'),
              icon: 'cash',
              children: [
                {
                  title: t('mainMenu:daily'),
                  name: CASH_FLOW,
                },
                {
                  title: t('mainMenu:bankMatch'),
                  name: BANK_MATCH,
                },
                {
                  title: t('mainMenu:cyclicTrans'),
                  name: CYCLIC_TRANS,
                },
              ],
            },
            {
              title: t('mainMenu:budget'),
              icon: 'bag',
              name: BUDGET,
              notActive: COMPANY_INFO.budgetPopUpType && (COMPANY_INFO.budgetPopUpType === 2 || COMPANY_INFO.budgetPopUpType === 3),
            },
            {
              title: t('common:recommendation'),
              icon: 'RECOMMENDATION',
              name: 'RECOMMENDATION',
            },
            {
              title: t('mainMenu:documentManagement'),
              icon: 'uploading-documents',
              children: [
                {
                  title: t('mainMenu:uploadingDocuments'),
                  name: UPLOADING_DOCUMENTS,
                },
                {
                  title: t('mainMenu:archives'),
                  name: ARCHIVES,
                },
                {
                  title: t('mainMenu:GOT_ABSORBED'),
                  name: GOT_ABSORBED,
                },
                {
                  title: t('mainMenu:WAITING_ABSORBED'),
                  name: WAITING_ABSORBED,
                },
              ],
            },
            {
              title: t('mainMenu:help'),
              icon: 'HELP',
              name: HELP,
            },
            {
              title: t('common:settings'),
              icon: 'gear',
              name: SETTINGS,
            },
          ])
        : (!isAccountant
          ? [
            {
              title: t('mainMenu:overview'),
              icon: 'desktop',
              name: OVERVIEW,
            },
            {
              title: t('mainMenu:financialManagement'),
              icon: 'graph-up',
              children: [
                {
                  title: t('mainMenu:bankAccount'),
                  name: BANK_ACCOUNTS,
                },
                {
                  title: t('mainMenu:creditCard'),
                  name: CREDIT_CARD,
                },
                {
                  title: t('mainMenu:checks'),
                  name: CHECKS,
                },
                {
                  title: t('mainMenu:slika'),
                  name: SLIKA,
                },
                {
                  title: t('mainMenu:mutavim'),
                  name: MUTAVIM,
                },
              ],
            },
            {
              title: t('mainMenu:cashFlow'),
              icon: 'cash',
              children: [
                {
                  title: t('mainMenu:daily'),
                  name: CASH_FLOW,
                },
                {
                  title: t('mainMenu:bankMatch'),
                  name: BANK_MATCH,
                },
                {
                  title: t('mainMenu:cyclicTrans'),
                  name: CYCLIC_TRANS,
                },
              ],
            },
            {
              title: t('mainMenu:budget'),
              icon: 'bag',
              name: BUDGET,
              notActive: COMPANY_INFO.budgetPopUpType && (COMPANY_INFO.budgetPopUpType === 2 || COMPANY_INFO.budgetPopUpType === 3),
            },
            {
              title: t('common:recommendation'),
              icon: 'RECOMMENDATION',
              name: 'RECOMMENDATION',
            },
            {
              title: t('mainMenu:help'),
              icon: 'HELP',
              name: HELP,
            },
            {
              title: t('common:settings'),
              icon: 'gear',
              name: SETTINGS,
            },
          ]
          : [
            {
              title: t('mainMenu:overview'),
              icon: 'desktop',
              name: OVERVIEW,
            },
            {
              title: t('mainMenu:financialManagement'),
              icon: 'graph-up',
              children: [
                {
                  title: t('mainMenu:bankAccount'),
                  name: BANK_ACCOUNTS,
                },
                {
                  title: t('mainMenu:creditCard'),
                  name: CREDIT_CARD,
                },
                {
                  title: t('mainMenu:checks'),
                  name: CHECKS,
                },
                {
                  title: t('mainMenu:slika'),
                  name: SLIKA,
                },
                {
                  title: t('mainMenu:mutavim'),
                  name: MUTAVIM,
                },
              ],
            },
            {
              title: t('mainMenu:cashFlow'),
              icon: 'cash',
              children: [
                {
                  title: t('mainMenu:daily'),
                  name: CASH_FLOW,
                },
                {
                  title: t('mainMenu:bankMatch'),
                  name: BANK_MATCH,
                },
                {
                  title: t('mainMenu:cyclicTrans'),
                  name: CYCLIC_TRANS,
                },
              ],
            },
            {
              title: t('mainMenu:budget'),
              icon: 'bag',
              name: BUDGET,
              notActive: COMPANY_INFO.budgetPopUpType && (COMPANY_INFO.budgetPopUpType === 2 || COMPANY_INFO.budgetPopUpType === 3),
            },
            {
              title: t('common:recommendation'),
              icon: 'RECOMMENDATION',
              name: 'RECOMMENDATION',
            },
            {
              title: t('mainMenu:documentManagement'),
              icon: 'uploading-documents',
              children: [
                {
                  title: t('mainMenu:uploadingDocuments'),
                  name: UPLOADING_DOCUMENTS,
                },
                {
                  title: t('mainMenu:archives'),
                  name: ARCHIVES,
                },
                {
                  title: t('mainMenu:GOT_ABSORBED'),
                  name: GOT_ABSORBED,
                },
                {
                  title: t('mainMenu:WAITING_ABSORBED'),
                  name: WAITING_ABSORBED,
                },
              ],
            },
            {
              title: t('mainMenu:help'),
              icon: 'HELP',
              name: HELP,
            },
            {
              title: t('common:settings'),
              icon: 'gear',
              name: SETTINGS,
            },
          ])
    } else {
      return (!isAccountant
        ? [
          {
            title: t('mainMenu:overview'),
            icon: 'desktop',
            name: OVERVIEW,
          },
          {
            icon: 'graph-up',
            title: t('mainMenu:bankAccount'),
            name: BANK_ACCOUNTS,
          },
          {
            icon: 'credit-card-charge',
            title: t('mainMenu:creditCard'),
            name: CREDIT_CARD,
          },
          {
            icon: 'check',
            title: t('mainMenu:checks'),
            name: CHECKS,
          },
          {
            icon: 'enter-card-alt',
            title: t('mainMenu:slika'),
            name: SLIKA,
          },
          {
            icon: 'mutavimMenu',
            title: t('mainMenu:mutavim'),
            name: MUTAVIM,
          },
          {
            title: t('mainMenu:budget'),
            icon: 'bag',
            name: BUDGET,
            notActive: COMPANY_INFO.budgetPopUpType && (COMPANY_INFO.budgetPopUpType === 2 || COMPANY_INFO.budgetPopUpType === 3),
          },
          {
            title: t('mainMenu:cashFlow'),
            icon: 'cash',
            name: PACKAGES,
            notActive: true,
          },
          {
            title: t('common:recommendation'),
            icon: 'RECOMMENDATION',
            name: PACKAGES,
            notActive: true,
          },
          {
            title: t('mainMenu:help'),
            icon: 'HELP',
            name: HELP,
          },
          {
            title: t('common:settings'),
            icon: 'gear',
            name: SETTINGS,
          },
        ]
        : [
          {
            title: t('mainMenu:overview'),
            icon: 'desktop',
            name: OVERVIEW,
          },
          {
            icon: 'graph-up',
            title: t('mainMenu:bankAccount'),
            name: BANK_ACCOUNTS,
          },
          {
            icon: 'credit-card-charge',
            title: t('mainMenu:creditCard'),
            name: CREDIT_CARD,
          },
          {
            icon: 'check',
            title: t('mainMenu:checks'),
            name: CHECKS,
          },
          {
            icon: 'enter-card-alt',
            title: t('mainMenu:slika'),
            name: SLIKA,
          },
          {
            icon: 'mutavimMenu',
            title: t('mainMenu:mutavim'),
            name: MUTAVIM,
          },
          {
            title: t('mainMenu:budget'),
            icon: 'bag',
            name: BUDGET,
            notActive: COMPANY_INFO.budgetPopUpType && (COMPANY_INFO.budgetPopUpType === 2 || COMPANY_INFO.budgetPopUpType === 3),
          },
          {
            title: t('mainMenu:cashFlow'),
            icon: 'cash',
            name: PACKAGES,
            notActive: true,
          },
          {
            title: t('common:recommendation'),
            icon: 'RECOMMENDATION',
            name: PACKAGES,
            notActive: true,
          },
          {
            title: t('mainMenu:documentManagement'),
            icon: 'uploading-documents',
            children: [
              {
                title: t('mainMenu:uploadingDocuments'),
                name: UPLOADING_DOCUMENTS,
              },
              {
                title: t('mainMenu:archives'),
                name: ARCHIVES,
              },
              {
                title: t('mainMenu:GOT_ABSORBED'),
                name: GOT_ABSORBED,
              },
              {
                title: t('mainMenu:WAITING_ABSORBED'),
                name: WAITING_ABSORBED,
              },
            ],
          },
          {
            title: t('mainMenu:help'),
            icon: 'HELP',
            name: HELP,
          },
          {
            title: t('common:settings'),
            icon: 'gear',
            name: SETTINGS,
          },
        ])
    }
  }

  get currentCompany () {
    const { companies, currentCompanyId, navigation } = this.props
    if (!companies || !companies.length) return {}
    const currentCompany = companies.find(c => c.companyId === currentCompanyId) || {}
    const routeName = navigation.state.routeName || navigation.state.routes[0].routes[0].routeName
    if (routeName !== SIGNUP) {
      if (currentCompany) {
        COMPANY_INFO.budgetExpiredDays = currentCompany.budgetExpiredDays
        COMPANY_INFO.budgetPopUpType = currentCompany.budgetPopUpType
        COMPANY_INFO.biziboxTrialExpired = currentCompany.biziboxTrialExpired !== undefined && currentCompany.biziboxTrialExpired !== null ? currentCompany.biziboxTrialExpired : false
        COMPANY_INFO.trialBlocked = !!currentCompany.trialBlocked
        COMPANY_INFO.biziboxDowngradeDate = currentCompany.biziboxDowngradeDate !== null
        COMPANY_INFO.oneAccount = currentCompany.oneAccount
      } else {
        COMPANY_INFO.budgetExpiredDays = false
        COMPANY_INFO.budgetPopUpType = false
        COMPANY_INFO.biziboxDowngradeDate = false
        COMPANY_INFO.biziboxTrialExpired = false
        COMPANY_INFO.trialBlocked = false
        COMPANY_INFO.oneAccount = null
      }

      if (currentCompany && currentCompany.biziboxType && currentCompany.biziboxType === 'regular') {
        IS_LIGHT.light = true
      } else {
        IS_LIGHT.light = false
      }
    }

    return currentCompany
  }

  handleChangeCompany = (companyId, moveToMessages) => {
    const { dispatch, navigation } = this.props
    this.setState({
      currentOpenMenuIndex: null,
      changeCompany: true,
      showOneAccount: null,
    })
    AsyncStorage.removeItem('closeSlideBudget')
    dispatch(selectCompany(companyId))
      .then(() => {
        this.setState({
          changeCompany: false,
        })
        if (moveToMessages === true) {
          goTo(navigation, 'MESSAGES')
        } else {
          goTo(navigation, OVERVIEW, {
            timeoutAcc: true,
          })
        }
        return dispatch(getAccounts())
      })
      .then(() => {
        navigation.dispatch(DrawerActions.closeDrawer())
      })
  }

  handleChangeCompanyIOS = (buttonIndex) => {
    const { companies } = this.props
    if (buttonIndex === 0) return

    this.handleChangeCompany(companies[buttonIndex - 1].companyId)
  }

  handleLogout = () => {
    const { dispatch, navigation } = this.props
    navigation.dispatch(DrawerActions.closeDrawer())
    dispatch(logout())
  }

  handleLinkPress = (screenName, idx) => {
    if (!screenName) return
    goTo(this.props.navigation, screenName)
    if (idx !== undefined) {
      this.handleToggleMenu(idx)()
    }
    this.props.navigation.dispatch(DrawerActions.closeDrawer())
  }

  handleToggleMenu = (index) => () => {
    const { currentOpenMenuIndex } = this.state
    this.setState({ currentOpenMenuIndex: currentOpenMenuIndex === index ? null : index })
  }

  handleCloseDrawer = () => this.props.navigation.dispatch(DrawerActions.closeDrawer())

  handleOpenIOSActionSheet = () => {
    const { companies } = this.props
    if (!IS_IOS) return

    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', ...companies.map(c => c.companyName)],
      cancelButtonIndex: 0,
    }, this.handleChangeCompanyIOS)
  }

  componentWillReceiveProps (nextProps) {
    const { navigation, token, user, companies } = this.props

    if (COMPANY_INFO.trialBlockedPopup) {
      this.setState({
        showtrialBlocked: true,
        showLastRowPopup: false,
      })
    }
    if (COMPANY_INFO.badgetPopup) {
      this.setState({
        badgetPopup: true,
      })
    }
    if (COMPANY_INFO.oneAccount !== undefined && COMPANY_INFO.oneAccount !== null && this.state.showOneAccount === null) {
      this.setState({
        showOneAccount: true,
      })
    }
    if (nextProps.companies.length && navigation.state && navigation.state.routes && navigation.state.routes.length && navigation.state.routes[0].routes && navigation.state.routes[0].routes.length && navigation.state.routes[0].routes[0].params) {
      const params = navigation.state.routes[0].routes[0].params.openTarya
      const params2 = nextProps.navigation.state.routes[0].routes[0].params.openTarya
      if (params !== params2 && params2 !== undefined) {
        const companiesList = nextProps.companies.filter((company) => {
          const isAdmin = company.privs.some((item) => item === 'COMPANYSUPERADMIN' || item === 'COMPANYADMIN')
          if (isAdmin) {
            return company
          }
        })
        if (companiesList.length) {
          this.setState({
            companiesList,
          })
        }
      }
    }

    if (token && !nextProps.token) {
      goTo(navigation, LOGIN)
    }

    if (this.props.token && nextProps.token && (this.props.currentCompanyId !== nextProps.currentCompanyId)) {
      ALERTS_TRIAL.showAlert = true
      ALERTS_TRIAL.showPopUp = true

      if (nextProps.companies && nextProps.companies.length) {
        const currentCompany = nextProps.companies.find(c => c.companyId === nextProps.currentCompanyId) || {}
        if (currentCompany && currentCompany.popupAlert) {
          ALERTS_TRIAL.showAlertPopupCompany = currentCompany.popupAlert
        }
      }
    }

    if (nextProps.user && Object.getOwnPropertyNames(nextProps.user).length && (nextProps.user !== user) && this.props.token && nextProps.token && nextProps.mutavimPopupTimes < 3) {
      ALERTS_TRIAL.showMutavimSheet = true
      nextProps.dispatch(setMutavimScreenBottomSheetTimes(nextProps.mutavimPopupTimes + 1))
    }

    if (nextProps.user && Object.getOwnPropertyNames(nextProps.user).length && nextProps.companies.length && (nextProps.user !== user || nextProps.companies !== companies)) {
      if (nextProps.user.taryePopup === true) {
        if (nextProps.taryePopupTimes < 3) {
          nextProps.dispatch(setTaryePopupTimes(nextProps.taryePopupTimes + 1))
          const companiesList = nextProps.companies.filter((company) => {
            const isAdmin = company.privs.some((item) => item === 'COMPANYSUPERADMIN' || item === 'COMPANYADMIN')
            if (isAdmin) {
              return company
            }
          })
          if (companiesList.length) {
            this.setState({
              companiesList,
            })
          }
        } else {
          this.setState({
            companiesList: [],
          })
          hideTaryaPopupApi.post({
            body: {
              'vanish': false,
            },
          })
        }
      } else {
        this.setState({
          companiesList: [],
        })
      }
    }
  }

  _handleAppStateChange = (nextAppState) => {
    console.log('shouldHandleBackground.current', USER_SCREENS.shouldHandleBackground)
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active' &&
      USER_SCREENS.shouldHandleBackground
    ) {
      this.alertPresent = false
      this.getAppstoreAppVersionFun()
    }

    if (nextAppState === 'active' || nextAppState === 'background') {
      ALERTS_TRIAL.showAlertActivated = true
      ALERTS_TRIAL.showMutavimSheet = true
    }
    if (this.props.token && nextAppState === 'active') {
      if (this.currentCompany && this.currentCompany.popupAlert) {
        ALERTS_TRIAL.showAlertPopupCompany = this.currentCompany.popupAlert
      }
      usersActivityApi.post({
        body: {
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
      })
      if (this.props.mutavimPopupTimes < 3) {
        ALERTS_TRIAL.showMutavimSheet = true
        this.props.dispatch(setMutavimScreenBottomSheetTimes(this.props.mutavimPopupTimes + 1))
      }
      if (this.props.user && Object.getOwnPropertyNames(this.props.user).length && this.props.companies.length) {
        if (this.props.user.taryePopup === true) {
          if (this.props.taryePopupTimes < 3) {
            this.props.dispatch(setTaryePopupTimes(this.props.taryePopupTimes + 1))
            const companiesList = this.props.companies.filter((company) => {
              const isAdmin = company.privs.some((item) => item === 'COMPANYSUPERADMIN' || item === 'COMPANYADMIN')
              if (isAdmin) {
                return company
              }
            })
            if (companiesList.length) {
              this.setState({
                companiesList,
              })
            }
          } else {
            this.setState({
              companiesList: [],
            })
            hideTaryaPopupApi.post({
              body: {
                'vanish': false,
              },
            })
          }
        } else {
          this.setState({
            companiesList: [],
          })
        }
      }
    }

    this.setState({ appState: nextAppState })

    if (nextAppState === 'active') {
      // //console.log('-----------   active')
      // //console.log(AppTimezone.moment().diff(this.state.appStateBgTime, 'minutes'))
      if (AppTimezone.moment().diff(this.state.appStateBgTime, 'minutes') >= 15) {
        this.setState({ isReady: true })
        const routeName = this.props.navigation.state.routeName || this.props.navigation.state.routes[0].routes[0].routeName
        goTo(this.props.navigation, routeName)
      }
    }
    if (nextAppState === 'background') {
      // //console.log('-----------   background')
      this.setState({ appStateBgTime: AppTimezone.moment().valueOf() })
      // //console.log(this.state.appStateBgTime)
    }
  }

  componentWillUnmount () {
    Linking.removeEventListener('url', this.handleOpenURL)
    AppState.removeEventListener('change', this._handleAppStateChange)
    this.messageListener()
    this.notificationListener()
    this.notificationOpenedListener()
    this.notificationDisplayedListener()
  }

  isNewerVersion (oldVer, newVer) {
    const oldParts = oldVer.split('.')
    const newParts = newVer.split('.')
    for (let i = 0; i < newParts.length; i++) {
      const a = parseInt(newParts[i]) || 0
      const b = parseInt(oldParts[i]) || 0
      if (a > b) return true
      if (a < b) return false
    }
    return false
  }

  getAppstoreAppVersionFun () {
    if (this.props.token && !this.alertPresent && !this.state.alertState) {
      this.alertPresent = true
      getVersionApi.get()
        .then(latestVersion => {
          if (this.props.user.changePasswordRequired !== 1 && this.props.user.changePasswordRequired !== true && this.isNewerVersion(VERSION, latestVersion[IS_IOS ? 'buIosVerNum' : 'buAndroidVerNum'])) {
            this.setState({ alertState: true })
          }
          // console.log('latestVersion------', latestVersion)
        })
    }
  }

  openURL = () => {
    this.alertPresent = false
    if (IS_IOS) {
      Linking.openURL(`https://itunes.apple.com/us/app/bizibox-ui/id1448852782?l=iw&ls=1&mt=8`)
    } else {
      Linking.openURL(`https://play.google.com/store/apps/details?id=com.biziboxapp`)
    }
  }

  closeModalDownload = () => {
    this.setState({ alertState: false })
  }

  handleCloseCompaniesList = () => {
    if (this.state.dontShowAgain) {
      hideTaryaPopupApi.post({
        body: {
          'vanish': true,
        },
      })
    }
    setTimeout(() => {
      this.setState({
        companiesList: [],
        companyIdSelected: null,
      })
    }, 50)
  }

  componentDidMount () {
    ALERTS_TRIAL.showAlertPopupCompany = false
    ALERTS_TRIAL.showAlertActivated = true
    this.getAppstoreAppVersionFun()
    USER_SCREENS.shouldHandleBackground = true
    Linking.addEventListener('url', this.handleOpenURL)
    AppState.addEventListener('change', this._handleAppStateChange)
    messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          this.createNotificationListeners()
        }
      })
    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          this.navigate(url)
        }
      })
      .catch((e) => {

      })
  }

  createNotificationListeners () {
    const { navigation } = this.props
    this.notificationDisplayedListener = notifications().onNotificationDisplayed((notification) => {
      const { data } = notification
      // showAlert(body, JSON.stringify(data))
      if (data && data.messageId) {
        setTimeout(() => {
          goTo(navigation, 'MESSAGES', {
            messageId: data.messageId,
          })
        }, 4000)
      }
      if (data && data.companyId) {
        setTimeout(() => {
          this.handleChangeCompany(data.companyId, true)
        }, 4000)
      }
    })
    /*
            * Triggered when a particular notification has been received in foreground
            * */
    this.notificationListener = notifications().onNotification((notification) => {
      const { data } = notification
      // showAlert(body, JSON.stringify(data))
      if (data && data.messageId) {
        setTimeout(() => {
          goTo(navigation, 'MESSAGES', {
            messageId: data.messageId,
          })
        }, 4000)
      }
      if (data && data.companyId) {
        setTimeout(() => {
          this.handleChangeCompany(data.companyId, true)
        }, 4000)
      }
    })

    /*
            * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
            * */
    this.notificationOpenedListener = notifications().onNotificationOpened((notificationOpen) => {
      // console.log('--notificationOpen---', notificationOpen)
      // const action = notificationOpen.action
      const { data } = notificationOpen.notification
      // showAlert(body, JSON.stringify(data))
      if (data && data.messageId) {
        setTimeout(() => {
          goTo(navigation, 'MESSAGES', {
            messageId: data.messageId,
          })
        }, 4000)
      }
      if (data && data.companyId) {
        setTimeout(() => {
          this.handleChangeCompany(data.companyId, true)
        }, 4000)
      }
    })

    /*
            * Triggered for data only payload in foreground
            * */
    this.messageListener = messaging().onMessage((message) => {
      // process data message
      // console.log('---message---', JSON.stringify(message))
    })

    notifications().getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          // App was opened by a notification
          // Get the action triggered by the notification being opened
          //   const action = notificationOpen.action
          // Get information about the notification that was opened
          const { data } = notificationOpen.notification
          // showAlert(body, JSON.stringify(data))
          if (data && data.messageId) {
            setTimeout(() => {
              goTo(navigation, 'MESSAGES', {
                messageId: data.messageId,
              })
            }, 4000)
          }
          if (data && data.companyId) {
            setTimeout(() => {
              this.handleChangeCompany(data.companyId, true)
            }, 4000)
          }
        }
      })
  }

  navigate = (url) => {
    const navigation = this.props.navigation
    let route = url.replace(/.*?:\/\//g, '')
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        setTimeout(() => {
          if (route.includes('activation')) {
            const uuid = route.split('uuid=')[1]
            if (uuid) {
              activateUserApi.post({
                body: {
                  'uuid': uuid,
                },
              }).then(() => {
                Toast.show('המייל אומת בהצלחה!', Toast.SHORT, Toast.TOP, {
                  backgroundColor: colors.green15,
                  width: 400,
                  height: 50,
                  fontSize: sp(14),
                  lineHeight: 50,
                  textAlign: 'center',
                  color: '#ffffff',
                  borderRadius: 15,
                  yOffset: 0,
                  lines: 4,
                })
                // console.log('המייל אומת בהצלחה!')
              })
                .catch(() => {
                  Toast.show('המייל לא אומת!', Toast.SHORT, Toast.TOP, {
                    backgroundColor: colors.red7,
                    width: 400,
                    height: 50,
                    fontSize: sp(14),
                    lineHeight: 50,
                    textAlign: 'center',
                    color: '#ffffff',
                    borderRadius: 15,
                    yOffset: 0,
                    lines: 4,
                  })
                  // console.log('המייל לא אומת!')
                })
            }
          }
          if (route.includes('biziboxType')) {
            const biziboxType = route.split('biziboxType=')[1]
            if (biziboxType) {
              IS_LIGHT.light = biziboxType === 'regular'
              if (!IS_IOS) {
                goTo(navigation, SIGNUP)
              }
            }
          } else if (route.includes('financialManagement/bankAccount/details')) {
            goTo(navigation, 'BANK_ACCOUNTS')
          } else if (route.includes('cash-flow/daily/aggregate') || route.includes('cash-flow/daily/details/aggregate')) {
            goTo(navigation, 'CASH_FLOW', {
              moveToAggregate: true,
            })
          } else if (route.includes('cash-flow/daily/details')) {
            goTo(navigation, 'CASH_FLOW')
          } else if (route.includes('settings/bankAccounts')) {
            goTo(navigation, 'SETTINGS', {
              paramsLinkAddCard: {
                addCard: BANK_ACCOUNTS_TAB,
              },
            })
          } else if (route.includes('settings/creditCard')) {
            goTo(navigation, 'SETTINGS', {
              paramsLinkAddCard: {
                addCard: CREDIT_CARDS_TAB,
              },
            })
          }
        }, 2000)
        // console.log(route)
      }
    })
  }

  handleOpenURL = (event) => {
    this.navigate(event.url)
  }

  handleToggleStatus = (i) => () => {
    this.setState({
      companyIdSelected: i,
    })
  }
  dontShowAgain = () => {
    this.setState({
      dontShowAgain: !this.state.dontShowAgain,
    })
  }

  createApiToken = () => {
    if (this.state.companyIdSelected !== null) {
      createApiTokenApi.post({
        body: {
          'companyAccountIds': null,
          'companyId': this.state.companyIdSelected,
          'targetUserId': '16f8acbf-c11d-045b-e053-650aa8c09c49',
        },
      })
        .then(res => {
          try {
            Linking.canOpenURL(res)
              .then(s => {
                if (s) Linking.openURL(res)
              })
          } catch (e) {
          }
          hideTaryaPopupApi.post({
            body: {
              'vanish': this.state.dontShowAgain,
            },
          })
          setTimeout(() => {
            this.setState({
              companiesList: [],
              companyIdSelected: null,
            })
          }, 50)
        })
        .catch((e) => {
        })
    }
  }
  animatedTimeBiziboxTrialExpired = () => {
    COMPANY_INFO.trialBlockedPopup = false
    this.setState({
      showLastRowPopup: false,
      showtrialBlocked: false,
    })
  }
  closeBadgetPopup = () => {
    COMPANY_INFO.badgetPopup = false
    this.setState({
      badgetPopup: false,
    })
  }

  approveUpgrade = () => {
    const { currentCompanyId, dispatch } = this.props
    const thisCompany = (!this.props.companies || !this.props.companies.length) ? {} : (this.props.companies.find(c => c.companyId === currentCompanyId) ? this.props.companies.find(c => c.companyId === currentCompanyId) : {})
    const showLastRowPopup = thisCompany.billingAccountId !== '00000000-0000-0000-0000-000000000000'
    if (this.state.showtrialBlocked && COMPANY_INFO.trialBlockedPopup && thisCompany.billingAccountId === '00000000-0000-0000-0000-000000000000') {
      this.animatedTimeBiziboxTrialExpired()
      goTo(this.props.navigation, 'SETTINGS', {
        paramsLinkAddCard: {
          addCard: PAYMENTS_TO_BIZIBOX_TAB,
        },
      })
    } else {
      this.setState({
        showLastRowPopup: true,
      })
      approveUpgradeApi.post({
        body: {
          uuid: currentCompanyId,
        },
      })
        .then(() => {
          if (showLastRowPopup) {
            Promise.all([
              dispatch(getCompanies()),
            ])
              .then(() => dispatch(selectCompany(currentCompanyId)))
              .then(() => dispatch(getAccounts()))
              .then(() => {
                this.animatedTimeBiziboxTrialExpired()
                const thisComp = (!this.props.companies || !this.props.companies.length) ? {} : (this.props.companies.find(c => c.companyId === this.props.currentCompanyId) ? this.props.companies.find(c => c.companyId === this.props.currentCompanyId) : {})
                const billingAccountId = thisComp.billingAccountId === '00000000-0000-0000-0000-000000000000'
                if (billingAccountId) {
                  goTo(this.props.navigation, 'SETTINGS', {
                    paramsLinkAddCard: {
                      addCard: PAYMENTS_TO_BIZIBOX_TAB,
                    },
                  })
                }
              })
              .catch(() => {

              })
          } else {
            this.animatedTimeBiziboxTrialExpired()
          }
        })
        .catch(() => {
        })
    }
  }

  animatedTimeOneAccount = () => {
    COMPANY_INFO.oneAccount = null
    this.setState({
      showOneAccount: false,
    })

    oneAccountPopUpApi.post({
      body: {
        'uuid': this.props.currentCompanyId,
      },
    })
  }

  render () {
    const { currentOpenMenuIndex, alertState, companiesList, companyIdSelected, dontShowAgain, showLastRowPopup, showtrialBlocked, changeCompany, badgetPopup, showOneAccount } = this.state
    const { isRtl, token, user, companies, currentCompanyId, t, navigation } = this.props
    if (!token) return null

    const currentCompany = this.currentCompany
    const menu = this.menu

    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={{ position: 'absolute', bottom: 0 }}
          source={require('BiziboxUI/assets/menu-bg.png')}
        />

        <StatusBar barStyle={(IS_IOS) ? 'dark-content' : 'light-content'} />

        <TouchableOpacity
          style={cs(isRtl, styles.closeDrawer, styles.closeDrawerRtl)}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={this.handleCloseDrawer}
        >
          <CustomIcon name='times' size={14} color={colors.blue5} />
        </TouchableOpacity>

        <View style={styles.headerWrapper}>
          {(companies.length > 0) ? (
            <View style={styles.pickerWrapper}>
              {(companies.length === 1) && (
                <View style={cs(isRtl, styles.pickerTitleWrapper, styles.pickerTitleWrapperRtl)}>
                  <Text style={styles.pickerTitle}>{currentCompany.companyName}</Text>
                </View>
              )}
              {(companies.length > 1) && (
                <TouchableOpacity
                  onPress={this.handleOpenIOSActionSheet}
                  style={cs(isRtl, styles.pickerTitleWrapper, styles.pickerTitleWrapperRtl)}
                >
                  <Text style={styles.pickerTitle}>{currentCompany.companyName}</Text>
                  <Icon name='chevron-down' size={22} color={colors.blue3} />
                </TouchableOpacity>
              )}
              {!IS_IOS && (
                <Picker
                  selectedValue={currentCompanyId}
                  style={styles.picker}
                  onValueChange={this.handleChangeCompany}
                >
                  {companies.map(c => <Picker.Item key={c.companyId} label={c.companyName}
                    value={c.companyId} />)}
                </Picker>
              )}
            </View>
          ) : null}
        </View>

        <ScrollView>
          {menu.map((item, i) => (
            <DropdownPanel
              changeCompany={changeCompany}
              navigation={navigation}
              key={item.title}
              isRtl={isRtl}
              index={i}
              isOpen={i === currentOpenMenuIndex}
              isFirst={i === 0}
              isLast={i >= menu.length - 1}
              title={item.title}
              icon={item.icon}
              notActive={!!((item.notActive !== undefined && item.notActive === true))}
              items={item.children}
              name={item.name}
              onMenuToggle={this.handleToggleMenu(i)}
              onLinkPress={this.handleLinkPress}
            />
          ))}
        </ScrollView>

        <View style={cs(isRtl, styles.footerWrapper, styles.footerWrapperRtl)}>
          <Divider style={cs(isRtl, styles.divider, styles.dividerRtl)} />

          <View style={cs(isRtl, styles.footerInner, styles.footerInnerRtl)}>
            <View style={cs(isRtl, styles.footerMenuWrapper, styles.footerMenuWrapperRtl)}>
              <TouchableOpacity
                style={cs(isRtl, [styles.menuItemWrapper, styles.footerMenuItem], commonStyles.rowReverse)}
                onPress={this.handleLogout}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <CustomIcon name='power-off' size={18} color={colors.blue3} />
                <Text style={cs(isRtl, styles.logoutBtnText, styles.logoutBtnTextRtl)}>
                  {t('common:label:logout')}
                </Text>
              </TouchableOpacity>

              <Text style={cs(isRtl, styles.userName, styles.userNameRtl)}>{user.userName}</Text>
            </View>

            {/* <Image style={styles.avatar} source={require('BiziboxUI/assets/avatar.png')} /> */}
          </View>
        </View>

        {(companiesList && companiesList.length > 0) && (
          <Modal
            animationType='slide'
            transparent
            visible
            onRequestClose={() => {
              // //console.log('Modal has been closed.')
            }}>
            <View style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 999999,
              height: '100%',
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-end',
              alignContent: 'center',
            }}>

              <TouchableOpacity style={{
                backgroundColor: 'black',
                opacity: 0.7,
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 999999,
                height: '100%',
                width: '100%',
              }} onPress={this.handleCloseCompaniesList} />

              <View style={{
                width: '100%',
                zIndex: 9999999,
                backgroundColor: 'white',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                height: 450,
                position: 'absolute',
                right: 0,
                bottom: 0,
                left: 0,
              }}>
                <View style={{}}>
                  <Text style={{
                    color: '#022258',
                    fontSize: sp(22.5),
                    fontFamily: fonts.bold,
                    textAlign: 'center',
                    marginBottom: 15,
                    marginTop: 22.5,
                  }}>
                    {'במיוחד בשבילכם'}
                  </Text>
                  <Text style={{
                    color: '#022258',
                    fontSize: sp(17),
                    fontFamily: fonts.semiBold,
                    textAlign: 'center',
                    marginBottom: 15,
                  }}>
                    {'האם אתם מעוניינים לקבל מסגרת אשראי חוץ בנקאית?'}
                  </Text>
                  <Text style={{
                    marginRight: 20,
                    color: '#022258',
                    fontSize: sp(16),
                    fontFamily: fonts.regular,
                    textAlign: 'right',
                  }}>
                    {'בחרו את החברה עבורה תרצו לקבל מסגרת'}
                  </Text>
                </View>
                <View style={{
                  height: 160,
                }}>
                  <ScrollView
                    keyboardShouldPersistTaps='always'
                    style={{
                      flex: 1,
                      position: 'relative',
                    }}
                    contentContainerStyle={{
                      marginHorizontal: 15,
                      marginTop: 10,
                    }}
                  >
                    {companiesList.length > 0 && companiesList.map((f, i) => {
                      return (
                        <View key={i.toString()}
                          style={{
                            height: 32,
                            width: '100%',
                          }}>

                          <CheckBox
                            containerStyle={{
                              backgroundColor: 'transparent',
                              // left: 0,
                              margin: 0,
                              padding: 0,
                              borderWidth: 0,
                              lineHeight: 22,
                              height: 22,
                              // right: 0,
                              // width: '100%',
                              // alignSelf: 'center',
                              // alignItems: 'center',
                              // alignContent: 'center',
                              // justifyContent: 'center',
                            }}
                            textStyle={{
                              fontSize: sp(16),
                              lineHeight: 22,
                              color: '#022258',
                              fontWeight: 'normal',
                              textAlign: 'right',
                              fontFamily: fonts.regular,
                              // right: 0,
                              // left: 0,
                              // justifyContent: 'space-between',
                              // width: '87%',
                              margin: 0,
                              padding: 0,
                            }}
                            size={22}
                            right
                            checkedColor='#022258'
                            uncheckedColor='#022258'
                            title={f.companyName}
                            iconRight
                            checked={companyIdSelected === f.companyId}
                            iconType='material-community'
                            checkedIcon='radiobox-marked'
                            uncheckedIcon='radiobox-blank'
                            onPress={this.handleToggleStatus(f.companyId)}
                          />
                        </View>
                      )
                    })}
                  </ScrollView>
                </View>
                <TouchableOpacity
                  style={{
                    marginBottom: 20,
                    marginTop: 15,
                  }}
                  onPress={this.createApiToken}
                  activeOpacity={(companyIdSelected !== null) ? 0.2 : 1}>
                  <View style={{
                    height: 32.5,
                    width: 215,
                    opacity: companyIdSelected === null ? 0.6 : 1,
                    backgroundColor: '#022258',
                    borderRadius: 5,
                    flexDirection: 'row-reverse',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                  }}>
                    <Text style={{
                      color: '#ffffff',
                      fontSize: sp(17),
                      fontFamily: fonts.semiBold,
                      textAlign: 'center',
                    }}>
                      לפרטים נוספים
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    marginRight: 25,
                  }}
                  onPress={this.dontShowAgain}>
                  <View style={{
                    flexDirection: 'row-reverse',
                    alignSelf: 'flex-end',
                    justifyContent: 'center',
                  }}>
                    <CustomIcon name={'ok'} size={16}
                      color={!dontShowAgain ? '#dddddd' : '#0addc1'} />
                    <View style={{
                      paddingHorizontal: 2,
                    }} />
                    <Text style={{
                      color: '#022258',
                      fontSize: sp(14),
                      lineHeight: 20,
                      fontFamily: fonts.regular,
                      textAlign: 'right',
                    }}>
                      אל תציג שוב
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={{
                  marginHorizontal: 15,
                  marginVertical: 10,
                }}>
                  <View style={{
                    flexDirection: 'row-reverse',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                  }}>
                    <View>
                      <Text style={{
                        color: '#022258',
                        fontSize: sp(9.5),
                        lineHeight: 14,
                        fontFamily: fonts.semiBold,
                      }}>{' bizibox'}</Text>
                    </View>
                    <View>
                      <Text style={{
                        color: '#022258',
                        fontSize: sp(9.5),
                        lineHeight: 14,
                        fontFamily: fonts.semiBold,
                      }}>
                        אינה מערכת למתן אשראי, תיוך באשראי, השוואת עלויות פיננסיות או שירותי
                        יעוץ פיננסי,
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text style={{
                      color: '#022258',
                      fontSize: sp(9.5),
                      lineHeight: 14,
                      fontFamily: fonts.semiBold,
                      textAlign: 'center',
                    }}>
                      ולא עוסקת בתחומים אלה. ל-bizibox אין כל שיקול דעת בנושא העמדת אשראי או
                      פתרונות
                      פיננסים אחרים, והעמדת אשראי, ככל שתיעשה, תיעשה לפי שיקול דעתו של נותן האשראי
                      בלבד.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        )}

        {alertState && (
          <Modal
            animationType='slide'
            transparent={false}
            visible={alertState}
            onRequestClose={() => {
              // //console.log('Modal has been closed.')
            }}>
            <SafeAreaView style={{
              flex: 1,
              marginTop: 0,
              paddingTop: 0,
              position: 'relative',
              backgroundColor: '#ffffff',
            }}>
              <View style={{
                width: '100%',
                height: '100%',
                marginTop: 0,
                marginBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                flex: 1,
                zIndex: 2,
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                alignSelf: 'center',
              }}>
                <Image
                  style={{
                    width: 204,
                    height: 230,
                  }}
                  resizeMode='contain'
                  source={require('BiziboxUI/assets/downloan.png')}
                />
                <Text style={{
                  color: '#022258',
                  fontSize: sp(25),
                  fontFamily: fonts.bold,
                  marginTop: 31,
                  marginBottom: 10,
                }}>חדשות טובות!</Text>

                <View style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                }}>
                  <Text style={{
                    color: '#022258',
                    fontSize: sp(21.5),
                    fontFamily: fonts.regular,
                    marginLeft: 5,
                  }}>
                    קיימת גרסה חדשה יותר של
                  </Text>

                  <Image
                    style={{
                      width: 80.5,
                      height: 19.5,
                    }}
                    resizeMode='contain'
                    source={require('BiziboxUI/assets/logoForDownload.png')}
                  />
                </View>
                <Text style={{
                  color: '#022258',
                  fontSize: sp(21.5),
                  fontFamily: fonts.regular,
                }}>מלאה בשיפורים ועדכונים.</Text>

                <TouchableOpacity
                  style={[{
                    marginTop: 67,
                    height: 64,
                    backgroundColor: '#022052',
                    borderRadius: 32,
                    width: 245,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    borderWidth: 3,
                    borderColor: '#ffffff',
                  }]}
                  onPress={this.openURL}>
                  <Text style={{
                    color: colors.white,
                    fontFamily: fonts.bold,
                    fontSize: sp(24),
                    textAlign: 'center',
                  }}>{'לחצו לעדכון'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[{
                    marginTop: 10,
                  }]}
                  onPress={this.closeModalDownload}>
                  <Text style={{
                    textAlign: 'center',
                    fontSize: sp(17),
                    fontFamily: fonts.regular,
                    color: '#007ebf',
                    textDecorationLine: 'underline',
                    textDecorationStyle: 'solid',
                    textDecorationColor: '#007ebf',
                  }}>{'הזכר לי מאוחר יותר'}</Text>
                </TouchableOpacity>
              </View>
              <Image
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  left: 0,
                  width: '100%',
                  height: 381.5,
                  zIndex: 1,
                }}
                resizeMode='cover'
                source={require('BiziboxUI/assets/bgModalDownloadVer.png')}
              />
            </SafeAreaView>
          </Modal>
        )}

        {showtrialBlocked && COMPANY_INFO.trialBlockedPopup && (
          <Modal
            animationType='fade'
            transparent
            visible={COMPANY_INFO.trialBlockedPopup}>
            <Animated.View style={{
              opacity: 1,
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
              top: 0,
              zIndex: 9,
              elevation: 9,
              height: '100%',
              width: '100%',
              flexDirection: 'row',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'flex-start',
              alignContent: 'center',
            }}>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  left: 0,
                  top: 0,
                  zIndex: 9,
                  height: '100%',
                  width: '100%',
                  backgroundColor: '#cccccc',
                  opacity: 0.7,
                }}
                onPress={this.animatedTimeBiziboxTrialExpired} />

              <View style={{
                marginTop: 130,
                width: 715 / 2,
                height: 276 / 2,
                backgroundColor: '#ffffff',
                borderRadius: 5,
                zIndex: 10,
                shadowColor: '#a0a0a0',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 4,
                elevation: 33,
                paddingHorizontal: 0,
                paddingVertical: 0,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
                {showLastRowPopup && (
                  <View style={{
                    borderWidth: 1,
                    borderColor: '#f3ca35',
                    marginHorizontal: 5,
                    marginVertical: 5,
                    flex: 1,
                    width: '97%',
                    borderRadius: 5,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                    <TouchableOpacity
                      style={{
                        height: 20,
                        marginBottom: 5,
                        marginTop: 5,
                        alignSelf: 'flex-start',
                        marginLeft: 10,
                      }}
                      onPress={this.animatedTimeBiziboxTrialExpired}>
                      <Icon
                        name='close'
                        type='material-community'
                        size={25}
                        color={'#022258'}
                      />
                    </TouchableOpacity>
                    <Image style={{
                      width: 73 / 2,
                      height: 74 / 2,
                      alignSelf: 'center',
                      marginBottom: 5,
                    }} source={require('BiziboxUI/assets/logoB.png')} />
                    <Text
                      style={{
                        marginTop: 0,
                        color: '#022258',
                        fontSize: sp(17),
                        lineHeight: 24,
                        fontFamily: fonts.semiBold,
                      }}>{'אנחנו שמחים שבחרת להצטרף ל- bizibox לעסקים'}</Text>

                    <Text
                      style={{
                        color: '#022258',
                        fontSize: sp(17),
                        lineHeight: 24,
                        fontFamily: fonts.regular,
                      }}>{'אנו תמיד כאן לשרותך'}</Text>
                  </View>
                )}
                {!showLastRowPopup && (
                  <Fragment>
                    <TouchableOpacity
                      style={{
                        height: 20,
                        marginBottom: 10,
                        marginTop: 5,
                        alignSelf: 'flex-start',
                        marginLeft: 10,
                      }}
                      onPress={this.animatedTimeBiziboxTrialExpired}>
                      <Icon
                        name='close'
                        type='material-community'
                        size={25}
                        color={'#022258'}
                      />
                    </TouchableOpacity>
                    <View style={{
                      width: '100%',
                      flexDirection: 'row-reverse',
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      alignContent: 'center',
                      alignSelf: 'center',
                      height: 34,
                      backgroundColor: '#dde7f1',
                    }}>
                      <Text
                        style={{
                          color: '#022258',
                          fontSize: sp(16),
                          lineHeight: 34,
                          fontFamily: fonts.semiBold,
                        }}>{'למעבר ל- bizibox לעסקים - נא לאשר את התשלום'}</Text>
                    </View>

                    <TouchableOpacity
                      onPress={this.approveUpgrade}
                      style={{
                        marginTop: 20,
                        marginBottom: 7,
                        width: 397 / 2,
                        height: 69 / 2,
                        backgroundColor: '#022258',
                        alignSelf: 'center',
                        alignItems: 'center',
                        alignContent: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        borderRadius: 6,
                      }}>
                      <Text style={{
                        color: '#ffffff',
                        fontFamily: fonts.semiBold,
                        fontSize: sp(18.5),
                        textAlign: 'center',
                      }}>{'אישור תשלום'}</Text>
                    </TouchableOpacity>
                  </Fragment>
                )}
              </View>
            </Animated.View>
          </Modal>
        )}

        {badgetPopup && COMPANY_INFO.badgetPopup && (
          <BottomSheetBudgetNav navigation={navigation} company={this.currentCompany}
            close={this.closeBadgetPopup} />
        )}

        {showOneAccount && COMPANY_INFO.oneAccount !== null && (
          <Modal
            animationType='fade'
            transparent
            visible={COMPANY_INFO.oneAccount !== null}>
            <Animated.View style={{
              opacity: 1,
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
              top: 0,
              zIndex: 9,
              elevation: 9,
              height: '100%',
              width: '100%',
              flexDirection: 'row',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'flex-start',
              alignContent: 'center',
            }}>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  left: 0,
                  top: 0,
                  zIndex: 9,
                  height: '100%',
                  width: '100%',
                  backgroundColor: '#cccccc',
                  opacity: 0.7,
                }} />

              <View style={{
                marginTop: 130,
                width: 715 / 2,
                height: 276 / 2,
                backgroundColor: '#ffffff',
                borderRadius: 5,
                zIndex: 10,
                shadowColor: '#a0a0a0',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 4,
                elevation: 33,
                paddingHorizontal: 0,
                paddingVertical: 0,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
                <View style={{
                  borderWidth: 1,
                  borderColor: '#f3ca35',
                  marginHorizontal: 5,
                  marginVertical: 5,
                  flex: 1,
                  width: '97%',
                  borderRadius: 5,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                  <TouchableOpacity
                    style={{
                      height: 20,
                      marginBottom: 5,
                      marginTop: 5,
                      alignSelf: 'flex-start',
                      marginLeft: 10,
                    }}
                    onPress={this.animatedTimeOneAccount}>
                    <Icon
                      name='close'
                      type='material-community'
                      size={25}
                      color={'#022258'}
                    />
                  </TouchableOpacity>
                  <Image style={{
                    width: 73 / 2,
                    height: 74 / 2,
                    alignSelf: 'center',
                    marginBottom: 5,
                  }} source={require('BiziboxUI/assets/logoB.png')} />

                  {COMPANY_INFO.oneAccount === false && (
                    <Fragment>
                      <Text
                        style={{
                          marginTop: 0,
                          color: '#022258',
                          fontSize: sp(17),
                          lineHeight: 24,
                          fontFamily: fonts.semiBold,
                        }}>{'אנחנו שמחים שבחרתם לצרף את חשבונותיכם'}</Text>

                      <Text
                        style={{
                          color: '#022258',
                          fontSize: sp(17),
                          lineHeight: 24,
                          fontFamily: fonts.regular,
                        }}>{'התשלום עבור יותר מחשבון בנק אחד הוא 49 ₪'}</Text>
                    </Fragment>
                  )}

                  {COMPANY_INFO.oneAccount === true && (
                    <Fragment>
                      <Text
                        style={{
                          marginTop: 0,
                          color: '#022258',
                          fontSize: sp(17),
                          lineHeight: 24,
                          fontFamily: fonts.semiBold,
                        }}>{'אחד או יותר מחשבונות הבנק שלך הוסרו בהצלחה'}</Text>

                      <Text
                        style={{
                          color: '#022258',
                          fontSize: sp(17),
                          lineHeight: 24,
                          fontFamily: fonts.regular,
                        }}>{'התשלום חשבון בנק אחד הוא 19 ₪'}</Text>
                    </Fragment>
                  )}
                </View>
              </View>
            </Animated.View>
          </Modal>
        )}
      </SafeAreaView>
    )
  }
}