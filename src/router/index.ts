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
import Router from 'vue-router'

// internal dependencies
import routers from '@/router/routers.ts'
import {AccountsRepository} from '@/repositories/AccountsRepository'

// create router instance
const router = new Router({
  mode: 'hash',
  routes: routers,
})

/// region Navigation Guards
router.beforeEach((to, from, next) => {
  const repository = new AccountsRepository()
  const hasAccounts = repository.map().size > 0

  const skipRedirect: string[] = [
    'login.createAccount',
    'login.importStrategy',
  ]
  if (!hasAccounts && !skipRedirect.includes(to.name)) {
    return next({name: 'login.createAccount'})
  }

  if (to.meta.protected === true) {

  }
})
/// end-region Navigation Guards

export default router
