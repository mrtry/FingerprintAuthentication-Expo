import React from 'react'
import { Button, Paragraph, Dialog, Portal } from 'react-native-paper'

type Props = {
  isVisible: boolean;
  onDismiss: () => void;
}

export default (props: Props) => (
  <Portal>
    <Dialog visible={props.isVisible} onDismiss={props.onDismiss}>
      <Dialog.Title>Authorize</Dialog.Title>
      <Dialog.Content>
        <Paragraph>Touch fingerprint sensor.</Paragraph>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={props.onDismiss}>cancel</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
)
