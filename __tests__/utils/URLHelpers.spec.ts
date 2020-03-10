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
import {URLHelpers} from '@/core/utils/URLHelpers'

describe('utils/URLHelpers', () => {
  describe('formatUrl() should', () => {
    test('return correctly shaped object', () => {
      // act
      const payload = URLHelpers.formatUrl('http://localhost:3000')

      // assert
      expect(payload).toBeDefined()
      expect(payload.protocol).toBeDefined()
      expect(payload.hostname).toBeDefined()
      expect(payload.port).toBeDefined()
      expect(payload.url).toBeDefined()
    })
  })

  describe('httpToWsUrl() should', () => {
    test('should replace http by ws protocol', () => {
      // act
      const wsEndpoint = URLHelpers.httpToWsUrl('http://localhost:3000')
      const wssEndpoint = URLHelpers.httpToWsUrl('https://localhost:3000')

      // assert
      expect(wsEndpoint).toBeDefined()
      expect(wssEndpoint).toBeDefined()
      expect(wsEndpoint).toBe('ws://localhost:3000')
      expect(wssEndpoint).toBe('wss://localhost:3000')
    })
  })

  describe('completeUrlWithHostAndProtocol() should', () => {
    test('add protocol and port given hostname only', () => {
      // act
      const url = URLHelpers.completeUrlWithHostAndProtocol('localhost')

      // assert
      expect(url).toBeDefined()
      expect(url).toBe('http://localhost:3000')
    })

    test('add port given protocol and hostname', () => {
      // act
      const url = URLHelpers.completeUrlWithHostAndProtocol('http://localhost')

      // assert
      expect(url).toBeDefined()
      expect(url).toBe('http://localhost:3000')
    })

    test('add protocol given hostname and port', () => {
      // act
      const url = URLHelpers.completeUrlWithHostAndProtocol('localhost:3000')

      // assert
      expect(url).toBeDefined()
      expect(url).toBe('http://localhost:3000')
    })
  })
})
