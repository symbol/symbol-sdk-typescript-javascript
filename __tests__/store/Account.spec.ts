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
import AccountStore from '@/store/Account'

describe('store/Account ==>', () => {
  describe('action "RESET_STATE" should', () => {
    test('mutate currentAccount and isAuthenticated', async () => {
      const commit = jest.fn()
      await AccountStore.actions.RESET_STATE({commit})
      expect(commit).toHaveBeenCalledTimes(2)
      expect(commit).toHaveBeenNthCalledWith(1, 'currentAccount', null)
      expect(commit).toHaveBeenNthCalledWith(2, 'setAuthenticated', false)
    })
  })

  describe('action \'LOG_OUT\' should', () => {
    test('dispatch action \'RESET_STATE\'', async () => {
      const dispatch = jest.fn()
      await AccountStore.actions.LOG_OUT({dispatch})
      expect(dispatch).toHaveBeenCalled()
      expect(dispatch).toHaveBeenCalledWith('RESET_STATE')
    })
  })
})
