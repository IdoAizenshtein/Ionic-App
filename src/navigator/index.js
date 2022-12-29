import React, { PureComponent } from 'react'
import { Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { createDrawerNavigator, createStackNavigator } from 'react-navigation'
import SplashScreen from 'react-native-splash-screen'
import {
  ARCHIVES,
  BANK_ACCOUNTS,
  BANK_MATCH,
  BUDGET,
  CASH_FLOW,
  CHECKS,
  CREDIT_CARD,
  CYCLIC_TRANS,
  HELP,
  HOME,
  LOGIN,
  MAIN,
  MESSAGES,
  MUTAVIM,
  OVERVIEW,
  PACKAGES,
  RECOMMENDATION,
  SETTINGS,
  SIGNUP,
  SLIKA,
  UPLOADING_DOCUMENTS,
  GOT_ABSORBED,
  WAITING_ABSORBED,
} from '../constants/navigation'
import { indexNav } from '../screens'
import Drawer from '../components/Drawer/Drawer'
import HeaderLeft from '../components/Header/HeaderLeft'
import HeaderRight from '../components/Header/HeaderRight'
import HeaderTitle from '../components/Header/HeaderTitle'
import Recommendation from '../components/Recommendation/Recommendation'

const {
  BankAccountsScreen,
  BankMatchScreen,
  CashFlowScreen,
  ChecksScreen,
  CreditCardsScreen,
  CyclicTransScreen,
  HomeScreen,
  LoginScreen,
  MessagesScreen,
  OverviewScreen,
  SettingsScreen,
  SignupScreen,
  SlikaScreen,
  HelpScreen,
  MutavimScreen,
  PackagesScreen,
  BudgetScreen,
  UploadingDocumentsScreen,
  ArchivesScreen,
  WaitingAndGotAbsorbedScreen,
} = indexNav

/* eslint-disable-next-line */
export const AppNavigation = createStackNavigator(Object.assign({
  [LOGIN]: {
    screen: LoginScreen,
    navigationOptions: {
      header: null,
      drawerLockMode: 'locked-closed',
      gesturesEnabled: false,
    },
  },
  [OVERVIEW]: { screen: OverviewScreen },
  [HOME]: { screen: HomeScreen },
  [BANK_ACCOUNTS]: { screen: BankAccountsScreen },
  [CREDIT_CARD]: { screen: CreditCardsScreen },
  [SLIKA]: { screen: SlikaScreen },
  [CASH_FLOW]: { screen: CashFlowScreen },
  [MUTAVIM]: { screen: MutavimScreen },
  [CHECKS]: { screen: ChecksScreen },
  [CYCLIC_TRANS]: { screen: CyclicTransScreen },
  [BANK_MATCH]: { screen: BankMatchScreen },
  [SETTINGS]: { screen: SettingsScreen },
  [MESSAGES]: { screen: MessagesScreen },
  [RECOMMENDATION]: {
    screen: Recommendation,
    navigationOptions: props => {
      return {
        headerStyle: {
          backgroundColor: '#022258',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: null,
        headerRight: <HeaderRight isModal {...props} />,
        headerTitle: <HeaderTitle showTitle {...props} />,
      }
    },
  },
  [HELP]: { screen: HelpScreen },
  [UPLOADING_DOCUMENTS]: { screen: UploadingDocumentsScreen },
  [ARCHIVES]: { screen: ArchivesScreen },
  [GOT_ABSORBED]: { screen: WaitingAndGotAbsorbedScreen },
  [WAITING_ABSORBED]: { screen: WaitingAndGotAbsorbedScreen },
  [PACKAGES]: { screen: PackagesScreen },
  [BUDGET]: { screen: BudgetScreen },
  [SIGNUP]: {
    screen: SignupScreen,
    navigationOptions: {
      header: null,
      drawerLockMode: 'locked-closed',
      gesturesEnabled: false,
    },
  },
}), {
  backBehavior: 'initialRoute',
  initialRouteName: LOGIN,
  headerMode: 'screen',
  navigationOptions: props => {
    const openedBottomSheet = props.navigation.getParam('openedBottomSheet')
    return {
      headerStyle: {
        backgroundColor: openedBottomSheet ? '#000000cc' : '#ffffff',
        opacity: openedBottomSheet ? 0.2 : 1,
      },
      headerTintColor: '#fff',
      drawerLockMode: 'locked-closed',
      headerLeft: <HeaderLeft {...props} />,
      headerRight: <HeaderRight {...props} />,
      headerTitle: <HeaderTitle {...props} />,
    }
  },
})

AppNavigation.navigationOptions = ({ navigation }) => {
  const drawerLockMode = navigation.state.index > 0
    ? 'unlocked'
    : 'locked-closed'
  return { drawerLockMode }
}

@connect(state => ({
  isRtl: state.isRtl,
}))
export class AppDrawer extends PureComponent {
  get Drawer () {
    return createDrawerNavigator({
      [MAIN]: {
        screen: AppNavigation,
      },
    }, {
      backBehavior: 'initialRoute',
      drawerWidth: () => {
        const { width } = Dimensions.get('window')
        return width - 53
      },
      contentComponent: Drawer,
      drawerPosition: this.props.isRtl ? 'right' : 'left',
    })
  }

  componentDidMount () {
    SplashScreen.hide()
  }

  render () {
    const Drawer = this.Drawer

    return (
      <Drawer />
    )
  }
}