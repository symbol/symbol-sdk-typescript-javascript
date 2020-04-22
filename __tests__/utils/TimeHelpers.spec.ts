/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import {TimeHelpers} from '@/core/utils/TimeHelpers'

describe('utils/TimeHelpers', () => {
  describe('durationStringToSeconds', () => {
    test('returns how many seconds there is in a duration string', () => {
      // assert
      expect(TimeHelpers.durationStringToSeconds('1m')).toBe(60)
      expect(TimeHelpers.durationStringToSeconds('2m')).toBe(60 * 2)
      expect(TimeHelpers.durationStringToSeconds('1s')).toBe(1)
      expect(TimeHelpers.durationStringToSeconds('50s')).toBe(50)
      expect(TimeHelpers.durationStringToSeconds('1h')).toBe(60 * 60)
      expect(TimeHelpers.durationStringToSeconds('2h')).toBe(60 * 60 * 2)
      expect(TimeHelpers.durationStringToSeconds('1d')).toBe(24 * 60 * 60)
      expect(TimeHelpers.durationStringToSeconds('2d')).toBe(24 * 60 * 60 * 2)
      expect(TimeHelpers.durationStringToSeconds('20ms')).toBe(0)
      expect(TimeHelpers.durationStringToSeconds('2010ms')).toBe(2)
      expect(TimeHelpers.durationStringToSeconds('2d 2h 10m 50s 20ms')).toBe(24 * 60 * 60 * 2 + 60 * 60 * 2 + 60 * 10 + 50)
    })
  })

  describe('durationStringToMilliseconds', () => {
    test('returns how many milliseconds there is in a duration string', () => {
      // assert
      expect(TimeHelpers.durationStringToMilliseconds('1m')).toBe(1000 * 60)
      expect(TimeHelpers.durationStringToMilliseconds('2m')).toBe(1000 * 60 * 2)
      expect(TimeHelpers.durationStringToMilliseconds('1s')).toBe(1000)
      expect(TimeHelpers.durationStringToMilliseconds('50s')).toBe(1000 * 50)
      expect(TimeHelpers.durationStringToMilliseconds('1h')).toBe(1000 * 60 * 60)
      expect(TimeHelpers.durationStringToMilliseconds('2h')).toBe(1000 * 60 * 60 * 2)
      expect(TimeHelpers.durationStringToMilliseconds('1d')).toBe(1000 * 24 * 60 * 60)
      expect(TimeHelpers.durationStringToMilliseconds('2d')).toBe(1000 * 24 * 60 * 60 * 2)
      expect(TimeHelpers.durationStringToMilliseconds('20ms')).toBe(20)
      expect(TimeHelpers.durationStringToMilliseconds('2010ms')).toBe(2010)
      expect(TimeHelpers.durationStringToMilliseconds('2d 2h 10m 50s 20ms')).toBe(1000 * (24 * 60 * 60 * 2 + 60 * 60 * 2 + 60 * 10 + 50) + 20)
    })
  })


})
