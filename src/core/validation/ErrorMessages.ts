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
import { configure } from 'vee-validate'
import i18n from '@/language'

export class ErrorMessages {  
  /**
   * Loads error messages
   * @static
   */
  public static load() {
    return new ErrorMessages().loadStandardValidationRulesMessages()
  }

  /**
   * Maps translation messages passed to i18n
   * to the validation rules shipped with vee-validate
   * @private
   */
  private loadStandardValidationRulesMessages() {
    configure({
      // @ts-ignore
      defaultMessage: (_, values) => i18n.t(`validation.${values._rule_}`, values),
    })
  }
}
