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
import {getAdapter} from '@MOCKS/Database'
import {AESEncryptionService} from '@/services/AESEncryptionService'
import {Password} from 'symbol-sdk'

describe('database/BaseStorageAdapter ==>', () => {
  describe('getSessionId() should', () => {
    test('auto-generate session id given no value', () => {
      const adapter = getAdapter()
      const sessionId = adapter.getSessionId()
      expect(sessionId).toBeDefined()
      expect(sessionId.length).toBe(64)
    })

    test('read stored session id given storage', () => {
      const adapter = getAdapter({sessionId: '123456789'})
      const sessionId = adapter.getSessionId()
      expect(sessionId).toBe('123456789')
    })
  })

  describe('getSaltForSession() should', () => {
    test('auto-generate salt given no value', () => {
      const adapter = getAdapter()
      const salt = adapter.getSaltForSession()
      expect(salt).toBeDefined()
      expect(salt.length).toBe(64)
    })

    test('encrypt access salt given session id', () => {
      const adapter = getAdapter({
        sessionId: 'password',
      })

      const salt = adapter.getSaltForSession()
      const encrypted = adapter.storage.getItem('accessSalt')
      const decrypted = AESEncryptionService.decrypt(encrypted, new Password('password'))
      expect(decrypted.length).toBe(64)
      expect(decrypted).toBe(salt)
    })

    test('read encrypted salt given storage', () => {
      const adapter = getAdapter({
        sessionId: 'password',
        accessSalt: '9c3afe1b658403d7522886cda510a3714c389ce697128ab8d3877bbbb53c2ecdY+QgfP/KHmUl+wk7rPwmEQ==',
      })

      const salt = adapter.getSaltForSession()
      expect(salt).toBe('987654321')
    })
  })
})
