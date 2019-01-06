import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Provider as PaperProvider, Button } from 'react-native-paper'
import FingerprintDialog from './FingerprintDialog'
import { LocalAuthentication } from 'expo'

enum AuthorizedState {
  AUTHORIZED = 'authorized',
  FAILED = 'failed',
  NONE = 'none',
}

type State = {
  visible: boolean;
  compatible: boolean;
  fingerprints: boolean;
  authorizedState: AuthorizedState;
}

export default class App extends React.Component<any, State> {
  state = {
    visible: false,
    compatible: false,
    fingerprints: false,
    authorizedState: AuthorizedState.NONE,
  }

  componentDidMount() {
    this.checkDeviceForHardware()
    this.checkForFingerprints()
  }

  checkDeviceForHardware = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync()
    this.setState({ compatible })
  }

  checkForFingerprints = async () => {
    const fingerprints = await LocalAuthentication.isEnrolledAsync()
    this.setState({ fingerprints })
  }

  render() {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <Text>AuthorizedState: {this.state.authorizedState}</Text>
          <Button
            onPress={this.doAuthorize}
            disable={!(this.state.compatible && this.state.fingerprints)}
          >
            Do Fingerprint Auth
          </Button>
          <FingerprintDialog
            isVisible={this.state.visible}
            onDismiss={this.finishAuthorize}
          />
        </View>
      </PaperProvider>
    )
  }

  doAuthorize = () => {
    this.setState({ visible: true }, async () => {
      const result = await LocalAuthentication.authenticateAsync()
      const status = result.success
        ? AuthorizedState.AUTHORIZED
        : AuthorizedState.FAILED
      this.setState({ authorizedState: status }, () => this.finishAuthorize())
    })
  }

  finishAuthorize = () =>
    this.setState({ visible: false }, () =>
      LocalAuthentication.cancelAuthenticate(),
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
