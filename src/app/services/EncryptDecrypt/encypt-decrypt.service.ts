import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as CryptoTS from 'crypto-ts';

@Injectable({
  providedIn: 'root'
})
export class EncyptDecryptService {
  tokenFromUI: string = "SadakSinghSherGill";
  constructor() {
  }
  encryptUsingAES256(data: any) {
     // Encrypt
     const ciphertext = CryptoTS.AES.encrypt(data,this.tokenFromUI);
     return ciphertext.toString();
  }
  decryptUsingAES256(data: any) {
    if(data!==null){
      const bytes  = CryptoTS.AES.decrypt(data,this.tokenFromUI);
      const plaintext = bytes.toString(CryptoTS.enc.Utf8);
      return plaintext;
    }else{
      return data;
    }

  }
}
