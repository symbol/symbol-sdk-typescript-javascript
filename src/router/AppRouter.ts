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
// external dependencies
import Router from 'vue-router'

// internal dependencies
import {routes} from '@/router/routes'
import {AccountsRepository} from '@/repositories/AccountsRepository'
import {AppRoute} from './AppRoute'
import {TabEntry} from './TabEntry'
import {AppStore} from '@/app/AppStore'

/**
 * Extension of Vue Router
 * @class AppRouter
 * @extends {Router}
 */
export class AppRouter extends Router {
  /**
   * Application routes
   */
  public readonly routes: AppRoute[]

  constructor(options) {
    super(options)
    this.routes = options.routes
    this.beforeEach((to, from, next) => {
      const repository = new AccountsRepository()
      const hasAccounts = repository.entries().size > 0

      // No account when app is opened: redirect to create account page
      const skipRedirect: string[] = ['accounts.importAccount.importStrategy']
      if (!from.name && !hasAccounts && !skipRedirect.includes(to.name)) {
        return next({name: 'accounts.importAccount.importStrategy'})
      }

      if (!to.meta.protected) {
        return next(/* no-redirect */)
      }

      const isAuthenticated = AppStore.getters['account/isAuthenticated'] === true
      if (!isAuthenticated) {
        return next({name: 'accounts.login'})
      }

      return next()
    })
  }

  /**
   * Gets routes from Parent Route Name
   * @param {string} [parentRouteName]
   * @returns {AppRoute[]}
   */
  public getRoutes(parentRouteName? : string): AppRoute[] {
    const parentRoute = this.getParentRoute(parentRouteName)
    if (!parentRoute) return []
    return this.getChildRoutes(parentRoute)
  }

  /**
   * Get Tab Entries from Parent Route Name
   *
   * @param {string} [parentRouteName]
   * @returns {TabEntry[]}
   */
  public getTabEntries(parentRouteName? : string): TabEntry[] {
    const routes = this.getRoutes(parentRouteName)
    return TabEntry.getFromRoutes(routes)
  }

  /**
   * Gets a route from string
   * @private
   * @param {string} [parentRouteName]
   * @returns {RouteConfig[]}
   */
  private getParentRoute(parentRouteName: string = ''): AppRoute {
    const routes = [...this.routes]

    // - read custom route configuration
    // - first top level route contains all app routes
    // - second top level route contains login
    const appRoute = routes.shift()
    /* const loginRoute =*/routes.shift()

    if (!parentRouteName.length) {
      return appRoute
    }

    // - find requested top level route
    const modules = [
      'dashboard',
      'mosaics',
      'multisig',
      'namespaces',
      'settings',
      'wallets',
      'community',
    ]

    // - app modules
    const moduleRoutes = appRoute.children.filter(
      ({name}) => modules.includes(name),
    )

    // - find by name
    const module = moduleRoutes.find(r => r.name === parentRouteName)

    // - name does not represent a top level route
    if (undefined === module) {
      throw new Error(`Top level (module) route with name '${parentRouteName}' does not exist.`)
    }

    return module
  }

  /**
   *  Gets child routes from a route
   * @private
   * @param {AppRoute[]} routes
   * @returns {AppRoute[]}
   */
  private getChildRoutes(parentRoute: AppRoute): AppRoute[] {
    if (!parentRoute.children) return []
    return [...parentRoute.children].filter(({meta}) => !meta.hideFromMenu)  
  }
}


// create router instance
const router = new AppRouter({
  mode: 'hash',
  routes,
})

export default router
