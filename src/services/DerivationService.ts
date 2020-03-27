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
import {Store} from 'vuex'

// internal dependencies
import {AbstractService} from './AbstractService'
import {DerivationPathValidator} from '@/core/validation/validators'
import {WalletService} from '@/services/WalletService'

export enum DerivationPathLevels {
  Purpose = 1,
  CoinType = 2,
  Account = 3,
  Remote = 4, // BIP44=change
  Address = 5,
}

export class DerivationService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'derivation'

  /**
   * Vuex Store 
   * @var {Vuex.Store}
   */
  public $store: Store<any>

  /**
   * Construct a service instance around \a store
   * @param store
   */
  constructor(store?: Store<any>) {
    super()
    this.$store = store
  }

  /**
   * Validate derivation path
   * @param {string} path 
   * @return {boolean}
   */
  public isValidPath(path: string): boolean {
    return DerivationPathValidator.validate(path)
  }

  /**
   * Increment a derivation path level
   * @param {string} path 
   * @param {DerivationPathLevel} which 
   * @return {string}
   */
  public incrementPathLevel(
    path: string,
    which: DerivationPathLevels = DerivationPathLevels.Account,
    step: number = 1,
  ): string {

    // make sure derivation path is valid
    this.assertValidPath(path)

    // purpose and coin type cannot be changed
    this.assertCanModifyLevel(which)

    // read levels and increment 
    const index = which as number
    const parts = path.split('/')
    
    // calculate next index (increment)
    const next = (step <= 1 ? 1 : step) + parseInt(parts[index].replace(/'/, ''))

    // modify affected level only
    return parts.map((level, idx) => {
      if (idx !== index) {
        return level
      }
      return `${next}'`
    }).join('/')
  }

  /**
   * Returns the first missing consecutive account path in a path array
   * @param {string[]} paths
   * @returns {string}
   */
  public getNextAccountPath(paths: string[]): string {
    const defaultPath = WalletService.DEFAULT_WALLET_PATH

    // return the default path if no path in the array
    if (!paths.length) return defaultPath

    // return the default path if it is not in the array
    if (paths.indexOf(defaultPath) === -1) return defaultPath

    // get the sorted path indexes for the given derivation path level
    const pathsSortedByIndexes = paths
      .map(path => ({
        path,
        pathIndex: parseInt(path.split('/')[DerivationPathLevels.Account], 10),
      }))
      .sort((a, b) => a.pathIndex - b.pathIndex)

    // get the first non consecutive path index
    const firstCandidate = pathsSortedByIndexes
      // fill an array with indexes with no consecutive next index, and the last index
      .filter(({pathIndex}, i, self) => {
        // the last path is always a candidate
        if (i === self.length - 1) return true

        // next path is not consecutive, add it to candidates
        if (self[i + 1].pathIndex !== pathIndex + 1) return true

        // next path is consecutive, skip
        return false
      }).find(path => path) // find the first candidate
    
    // return path incremented from the first candidate
    return this.incrementPathLevel(firstCandidate.path, DerivationPathLevels.Account)
  }

  /**
   * Decrement a derivation path level
   * @param {string} path 
   * @param {DerivationPathLevel} which 
   * @return {string}
   */
  public decrementPathLevel(
    path: string,
    which: DerivationPathLevels = DerivationPathLevels.Account,
    step: number = 1,
  ): string {
    // make sure derivation path is valid
    this.assertValidPath(path)

    // purpose and coin type cannot be changed
    this.assertCanModifyLevel(which)

    // read levels and increment 
    const index = which as number
    const parts = path.split('/')

    // calculate next index (decrement)
    let next = parseInt(parts[index].replace(/'/, '')) - (step <= 1 ? 1 : step)
    if (next < 0) next = 0

    // modify affected level only
    return parts.map((level, idx) => {
      if (idx !== index) {
        return level
      }
      return `${next}'`
    }).join('/')
  }

  /**
   * Assert whether \a path is a valid derivation path
   * @param {string} path 
   * @return {void}
   * @throws {Error} On \a path with invalid derivation path
   */
  public assertValidPath(path: string): void {
    if (!this.isValidPath(path)) {
      const errorMessage = `Invalid derivation path: ${path}`
      this.$store.dispatch('diagnostic/ADD_ERROR', errorMessage)
      throw new Error(errorMessage)
    }
  }

  /**
   * Assert whether derivation path level can be modified
   * @param {DerivationPathLevels} which 
   * @return {void}
   * @throws {Error} On \a which with protected path level value
   */
  public assertCanModifyLevel(which: DerivationPathLevels): void {
    const protect = [
      DerivationPathLevels.Purpose,
      DerivationPathLevels.CoinType,
    ]
    if (undefined !== protect.find(type => which === type)) {
      const errorMessage = 'Cannot modify a derivation path\'s purpose and coin type levels.'
      this.$store.dispatch('diagnostic/ADD_ERROR', errorMessage)
      throw new Error(errorMessage)
    }
  }
}
