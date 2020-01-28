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
// internal dependencies
import {IDataFormatter} from './IDataFormatter'
import {DatabaseModel} from '../DatabaseModel'

export abstract class AbstractFormatter
  implements IDataFormatter {
  /**
   * Validate format of \a data and throw exception
   * if not valid.
   * @param {string} data 
   * @return {boolean}
   * @throws {Error} On invalid JSON \a data
   */
  public assertFormat<ModelImpl extends DatabaseModel>(data: string): boolean {
    if (this.validate<ModelImpl>(data) === true) {
      return true
    }

    throw new Error('Expected JSON format for data but got: ' + data);
  }

  /// region abstract methods
  /**
   * Format an \a entity
   * @param {ModelImpl} entity
   * @return {string}
   */
  public abstract format<ModelImpl extends DatabaseModel>(entities: Map<string, ModelImpl>): string

  /**
   * Parse formatted \a data to entities
   * @param {string} data
   * @return {Map<string, ModelImpl>}
   */
  public abstract parse<ModelImpl extends DatabaseModel>(data: string): Map<string, ModelImpl>

  /**
   * Validate format of \a data
   * @param {string} data 
   * @return {boolean}
   */
  public abstract validate<ModelImpl extends DatabaseModel>(data: string): boolean
  /// end-region abstract methods
}
