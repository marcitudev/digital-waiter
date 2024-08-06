import * as CryptoJS from 'crypto-js';
import environment from '../../environments/environment';
import { Encryption } from '../interfaces/encryption.interface';

const encryptData = (data: unknown): Encryption => {
  return {
    data:  CryptoJS.AES.encrypt(JSON.stringify(data), environment.encryptKey).toString()
  };
}

export default encryptData;
