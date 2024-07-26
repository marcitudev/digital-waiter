import * as CryptoJS from 'crypto-js';
import environment from '../../environments/environment';

const encryptData = (data: unknown): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), environment.encryptKey).toString();
}

export default encryptData;
