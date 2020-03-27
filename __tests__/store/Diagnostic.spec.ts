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
import {LogLevels} from '@/core/utils/LogLevels'
import DiagnosticStore from '@/store/Diagnostic'

describe('store/Diagnostic', () => {
  describe('action "ADD_LOG" should', () => {
    test('mutate logs given debug level and message', () => {
      // prepare
      const commit = jest.fn()

      // act
      DiagnosticStore.actions.ADD_LOG({commit}, {
        level: LogLevels.DEBUG,
        message: 'debug message',
      })

      // assert
      expect(commit).toHaveBeenCalledTimes(1)
    })
  })

  describe('specialized actions should', () => {
    test('mutate logs with correct log level given message', () => {
    // prepare
      const commit = jest.fn()

      // act
      const message = 'info message'
      const time1 = DiagnosticStore.actions.ADD_INFO({commit}, message)
      const time2 = DiagnosticStore.actions.ADD_DEBUG({commit}, message)
      const time3 = DiagnosticStore.actions.ADD_WARNING({commit}, message)
      const time4 = DiagnosticStore.actions.ADD_ERROR({commit}, message)

      // assert
      expect(commit).toHaveBeenCalledTimes(4)
      expect(commit).toHaveBeenNthCalledWith(1, 'addLog', {level: LogLevels.INFO, message, time: time1})
      expect(commit).toHaveBeenNthCalledWith(2, 'addLog', {level: LogLevels.DEBUG, message, time: time2})
      expect(commit).toHaveBeenNthCalledWith(3, 'addLog', {level: LogLevels.WARNING, message, time: time3})
      expect(commit).toHaveBeenNthCalledWith(4, 'addLog', {level: LogLevels.ERROR, message, time: time4})
    })
  })
})
