import React from 'react';
import { View, Text } from 'react-native';
import dynamicStyleSheet from './CredentialCard.styles';
import type { CredentialCardProps } from './CredentialCard.d';
import { useDynamicStyles } from '../../hooks';


export default function UniversityDegreeCredentialCard({ rawCredentialRecord }: CredentialCardProps) : JSX.Element {
  const { styles } = useDynamicStyles(dynamicStyleSheet);
  const { credential } = rawCredentialRecord;
  const { credentialSubject } = credential;

  return (
    <View style={styles.credentialContainer}>
      <View style={styles.dataContainer}>
        <Text style={styles.header} accessibilityRole="header">University degree</Text>
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.dataLabel}>Degree title</Text>
        <Text style={styles.dataValue}>{credentialSubject.degree?.name ?? ''}</Text>
      </View>
    </View>
  );
}
