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
import AppInfoStore from '@/store/AppInfo'

describe('store/AppInfo', () => {
  describe('action "SET_TIME_ZONE" should', () => {
    test('mutate timezone', () => {
      // prepare
      const commit = jest.fn()

      // act
      AppInfoStore.actions.SET_TIME_ZONE({commit}, 123)

      // assert
      expect(commit).toHaveBeenCalledTimes(1)
      expect(commit).toHaveBeenNthCalledWith(1, 'timezone', 123)
    })
  })

  describe('action "SET_UI_DISABLED" should', () => {
    test('mutate toggleControlsDisabled', () => {
      // prepare
      const commit = jest.fn()

      // act
      AppInfoStore.actions.SET_UI_DISABLED({commit}, {isDisabled: true, message: ''})

      // assert
      expect(commit).toHaveBeenCalledTimes(1)
      expect(commit).toHaveBeenNthCalledWith(1, 'toggleControlsDisabled', {disable: true, message: ''})
    })
  })
})
