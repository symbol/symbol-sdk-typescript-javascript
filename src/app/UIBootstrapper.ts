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
import Vue from 'vue'
import {Electron} from '@/core/utils/Electron'

export class UIBootstrapper {
  /**
   * Bootstrap a Vue app instance
   * @param {Vue} app 
   * @return {Vue}
   */
  public static configure(app: Vue): Vue {
    /// region electron fixes
    Electron.htmlRem()
    /// end-region electron fixes

    /// region vue directives
    Vue.directive('focus', {
      inserted: function (el) {
        el.focus()
      },
    })
    Vue.directive('click-focus', {
      inserted: function (el) {
        el.addEventListener('click',function(){
          el.querySelector('input').focus()
        })
      },
    })
    /// end-region vue directives

    return app
  }
}
