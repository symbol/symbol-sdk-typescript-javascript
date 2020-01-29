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
import {Validator} from './Validator'

export class DerivationPathValidator extends Validator {
  /**
   * Execute the validator with \a value
   * @param {any} value 
   * @return {ValidationObject}
   */
  public validate(value: string): {valid: boolean|string} {
    if (value.match(/^m\/44'\/43'\/[0-9]+'\/[0-9]+'\/[0-9]+'/)) {
      return {valid: value}
    }

    return {valid: false}
  }
}
