import React from 'react';
import { View } from 'react-native';
import { Header, Text, Button } from 'react-native-elements';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { theme, mixins } from '../../styles';
import styles from './AddScreen.styles';
import { AddScreenProps } from './AddScreen.d';
import { navigationRef } from '../../../App';

export default function AddScreen({ navigation }: AddScreenProps): JSX.Element {
  function goToImport() {
    if (navigationRef.isReady()) {
      navigationRef.navigate('SettingsNavigation', {
        screen: 'Restore',
        initial: false,
      });
    }
  }

  return (
    <>
      <Header
        centerComponent={{ text: 'Add Credential', style: mixins.headerTitle}}
        containerStyle={mixins.headerContainer}
      />
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          To add credentials, follow an approved link from an issuer (most often a
          University) or use the options below.
        </Text>
        <Button
          title="Scan QR code"
          buttonStyle={mixins.buttonIcon}
          containerStyle={mixins.buttonIconContainer}
          titleStyle={mixins.buttonIconTitle}
          iconRight
          onPress={() => navigation.navigate('QRScreen')}
          icon={
            <MaterialIcons
              name="qr-code-scanner"
              size={theme.iconSize}
              color={theme.color.iconInactive}
            />
          }
        />
        <Button
          title="Restore from a file"
          buttonStyle={mixins.buttonIcon}
          containerStyle={mixins.buttonIconContainer}
          titleStyle={mixins.buttonIconTitle}
          iconRight
          onPress={goToImport}
          icon={
            <MaterialCommunityIcons
              name="file-upload"
              size={theme.iconSize}
              color={theme.color.iconInactive}
            />
          }
        />
      </View>
    </>
  );
}
