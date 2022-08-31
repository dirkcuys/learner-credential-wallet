import Share from 'react-native-share';
import * as RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { wallet as transmuteWallet, passwordToKey } from '../lib/uw/index.ts';
import crypto from "isomorphic-webcrypto";

//import { X25519KeyPair } from "@transmute/x25519-key-pair";

import { db } from '../model';

export async function exportWallet(): Promise<void> {
  const fileName = 'Wallet Backup';
  const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}.json`;
  const wallet = await db.export();

  /**
   * On Android, RNFS doesn't truncate the file before writing, 
   * so we have to check if it already exists.
   */

  if (await RNFS.exists(filePath)) {
    await RNFS.unlink(filePath);
  }

  const walletString = JSON.stringify(wallet, null, 2);
  await RNFS.writeFile(filePath, walletString, 'utf8');

  Share.open({
    title: fileName,
    url: `file://${filePath}`,
    type: 'text/plain',
    subject: fileName,
    message: Platform.OS === 'ios' ? undefined : walletString,
  });
}

function isNodejs() {
  return (
    typeof process === "object" &&
    typeof process.versions === "object" &&
    typeof process.versions.node !== "undefined"
  );
}

async function f(){

  //const crypto = new Crypto();

  const extractable = true;

  const publicKey = new Uint8Array([
        117, 150, 176, 172, 213, 188, 140,
        209,  46,  14,   0, 188, 180,  95,
         66, 183, 120, 214, 155, 149,  56,
        127, 129, 181, 192, 165, 179, 148,
         42, 226, 248,  12
  ]);

  const cek = await crypto.subtle.generateKey(
    {name: 'AES-GCM', length: 256},
    true,
    ['encrypt']
  );
  console.log('cek ', cek);

  const kek = await crypto.subtle.importKey(
    'raw', publicKey, {name: 'AES-KW', length: 256},
    true,
    ['wrapKey', 'unwrapKey']
  );
  console.log('kek ', kek);

  const wrappedKey = await crypto.subtle.wrapKey(
    'raw', cek, kek, kek.algorithm
  );
  console.log('wrapKey iii', wrappedKey);
}

async function testAesGCMKW(){
  //const crypto = new Crypto();
  const extractable = true;
  const publicKey = new Uint8Array([
        117, 150, 176, 172, 213, 188, 140,
        209,  46,  14,   0, 188, 180,  95,
         66, 183, 120, 214, 155, 149,  56,
        127, 129, 181, 192, 165, 179, 148,
         42, 226, 248,  12
  ]);
  const iv = new Uint8Array([1,2,3,4,5,6,7,8,9,10,11,12]);
  
  const cek = await crypto.subtle.generateKey(
    {name: 'AES-GCM', length: 256},
    true,
    ['encrypt']
  );
  console.log('cek ', cek);
  
  const kek = await crypto.subtle.importKey(
    'raw',
    publicKey,
    {name: 'AES-GCM', length: 256},
    true,
    ['encrypt', 'decrypt'],
  );
  console.log('kek ', kek);
  
  const wrappedKey = await crypto.subtle.wrapKey(
    'raw', cek, kek, {...kek.algorithm, iv}
  );
  console.log('wrappedKey', new Uint8Array(wrappedKey));
}


export async function exportWalletEncrypted(passphrase): Provise<void> {

  await testAesGCMKW();
  return;

  await f();
  return;

  const walletData = await db.export();
  console.log(walletData);

  /*
  const cipher = new Cipher(); // set correct encryption here

  const passwordDerivedKey = 'TODO';

  const kp = await X25519KeyPair.generate({
    secureRandom: () => passwordDerivedKey
  });

  const keyResolver = async () => publicKey;
  const jweDoc = await cipher.encryptObject({obj, recipients, keyResolver});
  */

  let encryptedWallet = null;
  transmuteWallet.add(walletData);
  try {
    encryptedWallet = await transmuteWallet.export('passphrase');
  } catch (error) {
    console.log(error);
  }

  console.log('------------------------');
  console.log(encryptedWallet);
  console.log('------------------------');
  
  return;

  const walletString = JSON.stringify(encryptedWallet, null, 2);

  const fileName = 'Wallet Backup';
  const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}.json`;
  await RNFS.writeFile(filePath, walletString, 'utf8');

  Share.open({
    title: fileName,
    url: `file://${filePath}`,
    type: 'text/plain',
    subject: fileName,
    message: Platform.OS === 'ios' ? undefined : walletString,
  });
}
