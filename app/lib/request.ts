import { authorize } from 'react-native-app-auth';

import { Credential } from '../types/credential';
import { DidRecordRaw } from '../model';
// import { CredentialRecord, DidRecordRaw } from '../model';

import { createVerifiablePresentation } from './present';
// import { verifyCredential } from './validate';

export type CredentialRequestParams = {
  auth_type?: string;
  issuer: string;
  vc_request_url: string;
  challenge: string;
}

export async function requestCredential(credentialRequestParams: CredentialRequestParams, didRecord: DidRecordRaw): Promise<Credential> {
  const { 
    // auth_type,
    // issuer, 
    vc_request_url, 
    challenge,
  } = credentialRequestParams;

  console.log('Credential request params', credentialRequestParams);

  /**
   * Right now we auth against a mock Google service to simulate the credential
   * request flow, but for real credential requests, we'll need to generate the 
   * config from the `issuer` property in the `credentialRequest` param.
   */
  const config = {
    issuer: 'https://accounts.google.com',
    clientId: '64590692238-if1jf1fco72srsgjc1ged8tm8106fcpc.apps.googleusercontent.com',
    redirectUrl: 'com.googleusercontent.apps.64590692238-if1jf1fco72srsgjc1ged8tm8106fcpc:/oauth2redirect/google',
    scopes: ['openid', 'profile'],
  };

  const { accessToken } = await authorize(config).catch((err) => {
    console.error(err);
    throw Error('Unable to receive credential');
  });

  const requestBody = await createVerifiablePresentation([], didRecord, challenge);
  const request = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: requestBody,
  };

  console.log('Credential request url:', vc_request_url);
  console.log('Credential request:', request);

  // TODO: Remove this error and finish second half of request flow
  throw Error('DEV: Credential request was formed, but the rest of the flow isn\'t implemented.');

  /**
   * To finish the credential request flow, the wallet will post the request,
   * parse the response as a credential, and verify the credential.
   */

  // const response = await fetch(vc_request_url, request);

  // const credential = await CredentialRecord.rawFrom(response);
  // const verified = await verifyCredential(credential);

  // if (!verfied) {
  //   throw Error('Credential was received, but could not be verified');
  // }

  // return credential;
}