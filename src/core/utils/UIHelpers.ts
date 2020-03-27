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
import {AppStore} from '@/app/AppStore'
import i18n from '@/language'

export class UIHelpers {
  /**
   * Helper method to copy text to clipboard
   * @param {string} text 
   * @return {boolean}
   */
  public static copyToClipboard(text: string): boolean {
    try {
      // create ghost element
      const input = document.createElement('input')
      input.setAttribute('readonly', 'readonly')
      input.setAttribute('value', text)
      document.body.appendChild(input)

      // use DOM commands
      input.select()
      document.execCommand('copy')

      // notify
      AppStore.dispatch('notification/ADD_SUCCESS', i18n.t('successful_copy'))

      // flush
      document.body.removeChild(input)
      return true
    }
    catch(e) {
      return false
    }
  }
}
