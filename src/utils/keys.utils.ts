import { PrivateKey } from '@steempro/steem-tx-js';

export const getPublicKeyFromPrivateKeyString = (privateKeyS: string) => {
  try {
    const privateKey = PrivateKey.fromString(privateKeyS);
    const publicKey = privateKey.createPublic();
    return publicKey.toString();
  } catch (e) {
    return null;
  }
};
