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
import TemporaryStore from '@/store/Temporary'
import { Password } from 'symbol-sdk'

describe('store/Account', () => {
  describe('action "RESET_STATE" should', () => {
    test('mutate password and mnemonic', () => {
      // prepare
      const commit = jest.fn()

      // act
      TemporaryStore.actions.RESET_STATE({commit})

      // assert
      expect(commit).toHaveBeenCalledTimes(2)
      expect(commit).toHaveBeenNthCalledWith(1, 'setPassword', null)
      expect(commit).toHaveBeenNthCalledWith(2, 'setMnemonic', null)
    })
  })

  describe('action "SET_PASSWORD" should', () => {
    test('mutate password', () => {
      // prepare
      const commit = jest.fn()

      // act
      TemporaryStore.actions.SET_PASSWORD({commit}, '1234567a')

      // assert
      expect(commit).toHaveBeenCalledTimes(1)
      expect(commit).toHaveBeenNthCalledWith(1, 'setPassword', new Password('1234567a'))
    })

    test('throw password error if less than 8 characters', () => {
      // prepare
      const commit = jest.fn()

      // act + assert
      expect(() => TemporaryStore.actions.SET_PASSWORD({commit}, '1234567')).toThrowError()
    })
  })
})
