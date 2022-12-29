import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import { Text, View } from 'react-native'
import { sp } from 'src/utils/func'
import { IS_IOS } from '../../../../constants/common'
/* eslint-disable-next-line */
import DeviceInfo from 'react-native-device-info'
import VersionCheck from 'react-native-version-check'
import { colors, fonts } from '../../../../styles/vars'
/* eslint-disable-next-line */
export const BUNDLE_ID = DeviceInfo.getBundleId();
export const IS_DEV = BUNDLE_ID.endsWith('dev')
/* eslint-disable-next-line */
export const VERSION = DeviceInfo.getVersion();
@translate()
export default class GeneralTab extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      latestVersion: null,
    }
  }

  componentDidMount () {
    if (!IS_DEV) {
      VersionCheck.getLatestVersion()
        .then(latestVersion => {
          this.setState({ latestVersion: latestVersion })
        })
    }
  }

  render () {
    const { latestVersion } = this.state
    return (
      <View>
        <Text style={{
          textAlign: 'center',
          color: colors.blue32,
          fontSize: sp(18),
          fontFamily: fonts.regular,
          paddingBottom: 15,
        }}>{'מספר גרסה נוכחית:'} {VERSION}</Text>
        {latestVersion && (
          <Text style={{
            textAlign: 'center',
            color: colors.blue32,
            fontSize: sp(18),
            fontFamily: fonts.regular,
          }}>{'מספר גרסת '} {IS_IOS ? 'AppStore' : 'GooglePlay'} {':'} {latestVersion}</Text>
        )}
      </View>
    )
  }
}