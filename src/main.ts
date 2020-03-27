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
import Router from 'vue-router'
import VueRx from 'vue-rx'
import moment from 'vue-moment'
import iView from 'view-design'
import locale from 'view-design/dist/locale/en-US'
import 'view-design/dist/styles/iview.css'

// internal dependencies
import {UIBootstrapper} from '@/app/UIBootstrapper'
import {AppStore} from '@/app/AppStore'
import i18n from '@/language/index.ts'
import router from '@/router/AppRouter'
import VueNumber from 'vue-number-animation'
import {VeeValidateSetup} from '@/core/validation/VeeValidateSetup'
// @ts-ignore
import App from '@/app/App.vue'

/// region UI plugins
Vue.use(iView, {locale})
Vue.use(moment as any)
Vue.use(Router)
Vue.use(VueRx)
Vue.use(VueNumber)
VeeValidateSetup.initialize()
/// end-region UI plugins

const app = new Vue({
  router,
  store: AppStore,
  i18n,
  created: function () {
    // This will execute following processes:
    // - configure $Notice
    // - configure Electron
    // - configure Vue directives
    UIBootstrapper.configure(this)
  },
  render: h => h(App),
})

app.$mount('#app')
export default app
