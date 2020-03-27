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

const cipher1 = AESEncryptionService.encrypt('a', new Password('password'))
const cipher2 = AESEncryptionService.encrypt('a', new Password('password'))
const knownPass = new Password('password')
const knownValue = '987654321'
const knownCipher = '9c3afe1b658403d7522886cda510a3714c389ce697128ab8d3877bbbb53c2ecdY+QgfP/KHmUl+wk7rPwmEQ=='

describe('services/AESEncryptionService', () => {
  describe('encrypt() should', () => {
    test('generate distinct values always', () => {
      expect(cipher1 === cipher2).toBe(false)
    })
  })

  describe('decrypt() should', () => {
    test('return value given valid ciphertext and password', () => {
      const plain = AESEncryptionService.decrypt(knownCipher, knownPass)
      expect(plain.length).toBe(knownValue.length)
      expect(plain).toBe(knownValue)
    })

    test('return empty given invalid ciphertext', () => {
      const cipher = '+QgfP/KHmUl+wk7rPwmEQ==' // invalid ciphertext
      const plain = AESEncryptionService.decrypt(cipher, knownPass)
      expect(plain.length).toBe(0)
      expect(plain).toBe('')
    })

    test('return empty given invalid password', () => {
      const plain = AESEncryptionService.decrypt(knownCipher, new Password('password1')) // invalid password
      expect(plain.length).toBe(0)
      expect(plain).toBe('')
    })

    test('accept ciphertext given encrypt', () => {
      const data = [
        'encrypt',
        'this',
      ]

      data.map((word: string) => {
        const pw = new Password('1234567a')
        const cipher = AESEncryptionService.encrypt(word, pw)
        const plain = AESEncryptionService.decrypt(cipher, pw)
        expect(plain).toBe(word)
      })
    })
  })
})
