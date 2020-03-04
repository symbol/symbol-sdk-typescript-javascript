/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {Password} from 'symbol-sdk'
import {AESEncryptionService} from '@/services/AESEncryptionService'

describe('services/AESEncryptionService ==>', () => {
  describe('encrypt() should', () => {
    it('produce distinct values always', () => {
      const enc1 = AESEncryptionService.encrypt('a', new Password('password'))
      const enc2 = AESEncryptionService.encrypt('a', new Password('password'))
      const enc3 = AESEncryptionService.encrypt('a', new Password('password'))
      const enc4 = AESEncryptionService.encrypt('a', new Password('password'))

      expect(enc1 === enc2).toBe(false)
      expect(enc1 === enc3).toBe(false)
      expect(enc1 === enc4).toBe(false)
      expect(enc2 === enc3).toBe(false)
      expect(enc2 === enc4).toBe(false)
      expect(enc3 === enc4).toBe(false)
    })

    it('include iv and salt in ciphertext', () => {
      const cipher = AESEncryptionService.encrypt('a', new Password('password'))

      // decrypting should work with only ciphertext + password
      const plain = AESEncryptionService.decrypt(cipher, new Password('password'))
      expect(plain).toBe('a')
    })
  })

  describe('decrypt() should', () => {
    it('return value given valid ciphertext', () => {
      const expval = "987654321"
      const cipher = "9c3afe1b658403d7522886cda510a3714c389ce697128ab8d3877bbbb53c2ecdY+QgfP/KHmUl+wk7rPwmEQ=="
      const plain = AESEncryptionService.decrypt(cipher, new Password("password"))
      expect(plain.length).toBe(9)
      expect(plain).toBe(expval)
    })

    it('return empty given invalid ciphertext', () => {
      const cipher = "+QgfP/KHmUl+wk7rPwmEQ==" // invalid ciphertext
      const plain = AESEncryptionService.decrypt(cipher, new Password("password"))
      expect(plain.length).toBe(0)
      expect(plain).toBe('')
    })

    it('return empty given invalid password', () => {
      const cipher = "9c3afe1b658403d7522886cda510a3714c389ce697128ab8d3877bbbb53c2ecdY+QgfP/KHmUl+wk7rPwmEQ=="
      const plain = AESEncryptionService.decrypt(cipher, new Password("password1")) // invalid password
      expect(plain.length).toBe(0)
      expect(plain).toBe('')
    })

    it('accept ciphertext given encrypt', () => {
      const data = [
        'this', 'is', 'data', 'to', 'separately',
        'encrypt', 'and', 'decrypt', 'using', 'the',
        'AES', 'encryption', 'service'
      ]

      data.map((word: string) => {
        const pw = AESEncryptionService.generateRandomBytes(10)
        const cipher = AESEncryptionService.encrypt(word, new Password(pw))
        const plain = AESEncryptionService.decrypt(cipher, new Password(pw))
        expect(plain).toBe(word)
      })
    })
  })
})
