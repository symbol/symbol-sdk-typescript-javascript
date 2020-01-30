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
import {ParentRouteNames} from './ParentRouteNames'
import {TabEntry} from './TabEntry'
import {AppStore} from '@/main'

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
      const skipRedirect: string[] = ['login.createAccount.info']
      if (!from.name && !hasAccounts && !skipRedirect.includes(to.name)) {
        return next({name: 'login.createAccount.info'})
      }

      if (!to.meta.protected) {
        return next(/* no-redirect */)
      }

      const isAuthenticated = AppStore.getters['account/isAuthenticated'] === true
      console.log("auth: ", isAuthenticated)
      if (!isAuthenticated) {
        return next({name: 'login.account'})
      }

      return next()
    })
  }

  /**
   * Gets routes from Parent Route Name
   * @param {ParentRouteNames} [parentRouteName]
   * @returns {AppRoute[]}
   */
  public getRoutes(parentRouteName? : ParentRouteNames): AppRoute[] {
    const parentRoute = this.getParentRoute(parentRouteName)
    if (!parentRoute) return []
    return this.getChildRoutes(parentRoute)
  }

  /**
   * Get Tab Entries from Parent Route Name
   *
   * @param {ParentRouteNames} [parentRouteName]
   * @returns {TabEntry[]}
   */
  public getTabEntries(parentRouteName? : ParentRouteNames): TabEntry[] {
    const routes = this.getRoutes(parentRouteName)
    return TabEntry.getFromRoutes(routes)
  }

  /**
   * Gets a route from ParentRouteNames
   * @private
   * @param {ParentRouteNames} [parentRouteName]
   * @returns {RouteConfig[]}
   */
  private getParentRoute(parentRouteName? : ParentRouteNames): AppRoute {
    switch (parentRouteName) {
      case ParentRouteNames.dashboard:
      case ParentRouteNames.settings:
        if (!this.getParentRoute() || !this.getParentRoute().children) return null
        return this.getParentRoute().children
          .find(({name}) => name === parentRouteName) as AppRoute
    
      default:
        return [...this.routes].shift()
    }
  }

  /**
   *  Gets child routes from a route
   * @private
   * @param {AppRoute[]} routes
   * @returns {AppRoute[]}
   */
  private getChildRoutes(parentRoute: AppRoute): AppRoute[] {
    if (!parentRoute.children) return []
    return [...parentRoute.children]
    // @ TODO: Replace by a Hidden prop on routes to hide if needed
    // .filter(({meta}) => meta.clickable)  
  }
}


// create router instance
const router = new AppRouter({
  mode: 'hash',
  routes,
})

export default router
