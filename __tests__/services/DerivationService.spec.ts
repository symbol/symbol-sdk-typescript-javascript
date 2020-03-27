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
import {DerivationService, DerivationPathLevels} from '@/services/DerivationService'
import {WalletService} from '@/services/WalletService'
const {DEFAULT_WALLET_PATH} = WalletService

// Standard account paths
const standardPaths = {
  // the path number one is the DEFAULT_WALLET_PATH
  2: 'm/44\'/4343\'/1\'/0\'/0\'',
  3: 'm/44\'/4343\'/2\'/0\'/0\'',
  4: 'm/44\'/4343\'/3\'/0\'/0\'',
  5: 'm/44\'/4343\'/4\'/0\'/0\'',
  6: 'm/44\'/4343\'/5\'/0\'/0\'',
  7: 'm/44\'/4343\'/6\'/0\'/0\'',
  8: 'm/44\'/4343\'/7\'/0\'/0\'',
  9: 'm/44\'/4343\'/8\'/0\'/0\'',
  10: 'm/44\'/4343\'/9\'/0\'/0\'',
}

describe('services/DerivationService ==>', () => {
  describe('incrementPathLevel() should', () => {
    test('increase standard paths as expected', () => {
      expect(
        [...Array(9).keys()].map(index => new DerivationService().incrementPathLevel(
          DEFAULT_WALLET_PATH, DerivationPathLevels.Account, index + 1,
        ))).toEqual(Object.values(standardPaths))
    })
  })

  describe('decrementPathLevel() should', () => {
    test('decrease standard paths as expected', () => {
      expect(
        [...Array(9).keys()].map(index => new DerivationService().decrementPathLevel(
          standardPaths[10], DerivationPathLevels.Account, index + 1,
        ))).toEqual([ DEFAULT_WALLET_PATH, ...Object.values(standardPaths).slice(0,8) ].reverse())
    })
  })

  describe('getNextAccountPath() should', () => {
    test('return default path when provided an empty array', () => {
      expect(new DerivationService().getNextAccountPath([])).toBe(DEFAULT_WALLET_PATH)
    })

    test('return the first missing consecutive path when it is the default one', () => {
      const paths = [ standardPaths[2], standardPaths[3] ]
      expect(new DerivationService().getNextAccountPath(paths)).toBe(DEFAULT_WALLET_PATH)
    })

    test('return the first missing consecutive path when it is the second one', () => {
      const paths = [ standardPaths[3], standardPaths[5], DEFAULT_WALLET_PATH ]
      expect(new DerivationService().getNextAccountPath(paths)).toBe(standardPaths[2])
    })

    test('return the first missing consecutive path when it is in the middle', () => {
      const paths = [ standardPaths[2], DEFAULT_WALLET_PATH, standardPaths[4] ]
      expect(new DerivationService().getNextAccountPath(paths)).toBe(standardPaths[3])
    })

    test('return the next path when all paths are consecutive', () => {
      const paths = [ standardPaths[2], standardPaths[3], DEFAULT_WALLET_PATH ]
      expect(new DerivationService().getNextAccountPath(paths)).toBe(standardPaths[4])
    })
  })
})
