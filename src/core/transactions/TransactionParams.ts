/**
 * 
 * Copyright 2020 Grégory Saive for NEM (https://nem.io)
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
export abstract class TransactionParams {

  /**
   * The parameters values 
   * @var {Map<string, any>}
   */
  protected readonly values: Map<string, any>

  /**
   * Create a transaction parameters instance
   *
   * @param {string[]} fields
   */
  constructor(
    /**
     * The parameters fields list
     * @var {string[]}
     */
    public readonly fields: string[],) {
      if (! fields.length || undefined === fields.find(f => f === 'maxFee')) {
        fields.push('maxFee')
      }

      this.values = new Map<string, any>()
  }

  /**
   * Setter for parameter values
   * @param {string} field 
   * @param {any} value 
   */
  public setParam(field: string, value: any): TransactionParams {
    // - only set pre-defined fields
    if (undefined !== this.fields.find(f => field === f)) {
      this.values.set(field, value)
      return this
    }
  }

  /**
   * Getter for parameters values
   * @param {string} field 
   * @return {any}
   */
  public getParam(field: string): any {
    return this.values.get(field) || undefined
  }
}
