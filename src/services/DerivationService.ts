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
import {DerivationPathValidator} from '@/core/validators/DerivationPathValidator'

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
  constructor(store: Store<any>) {
    super(store)
  }

  /**
   * Validate derivation path
   * @param {string} path 
   * @return {boolean}
   */
  public isValidPath(path: string): boolean {
    return new DerivationPathValidator().validate(path).valid === path
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
    if (! this.isValidPath(path)) {
      throw new Error('Invalid derivation path in DerivationService: ' + path)
    }

    // purpose and coin type cannot be changed
    const protect = [
      DerivationPathLevels.Purpose,
      DerivationPathLevels.CoinType
    ]
    if (undefined !== protect.find(type => which === type)) {
      throw new Error('Cannot modify a derivation path\'s purpose and coin type levels.')
    }

    // read levels and increment 
    const index = (which as number) - 1
    const parts = path.split('/')
    
    // calculate next index (increment)
    const next = (step <= 1 ? 1 : step) + parseInt(parts[index].replace(/'/, ''))

    // modify affected level only
    return parts.map((level, idx) => {
      if (idx !== index) {
        return level
      }
      return '' + next + '\''
    }).join('/')
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
    if (! this.isValidPath(path)) {
      throw new Error('Invalid derivation path in DerivationService: ' + path)
    }

    // purpose and coin type cannot be changed
    this.assertCanModifyLevel(which)

    // read levels and increment 
    const index = (which as number) - 1
    const parts = path.split('/')

    // calculate next index (decrement)
    let next = parseInt(parts[index].replace(/'/, '')) - (step <= 1 ? 1 : step)
    if (next < 0) next = 0

    // modify affected level only
    return parts.map((level, idx) => {
      if (idx !== index) {
        return level
      }
      return '' + next + '\''
    }).join('/')
  }

  /**
   * Assert whether derivation path level can be modified
   * @param {DerivationPathLevels} which 
   * @return {void}
   * @throws {Error} On \a which with protected path level value
   */
  protected assertCanModifyLevel(which: DerivationPathLevels): void {
    const protect = [
      DerivationPathLevels.Purpose,
      DerivationPathLevels.CoinType
    ]
    if (undefined !== protect.find(type => which === type)) {
      throw new Error('Cannot modify a derivation path\'s purpose and coin type levels.')
    }
  }
}
