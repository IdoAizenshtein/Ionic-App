import React, { PureComponent } from 'react'
import { BackHandler, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import commonStyles from '../../styles/styles'
import Loader from '../../components/Loader/Loader'
import { goToBack } from '../../utils/func'

@connect(state => ({ user: state.user, currentCompanyId: state.currentCompanyId }))
@translate()
export default class HomeScreen extends PureComponent {
  componentDidMount () {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
  }

    handleBackPress = () => {
      goToBack(this.props.navigation)
      return true
    };

    render () {
      const { user } = this.props

      return (
        <View style={[commonStyles.container, commonStyles.centerContainer]}>
          <Text>{`Hi ${user.userName}`}</Text>
          <Loader />
        </View>
      )
    }
}