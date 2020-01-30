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
import {Route} from 'vue-router'

// internal dependencies
import {AppRoute} from './AppRoute'

export class TabEntry {
  /**
   * Get Tab Entries from routes
   * @static
   * @param {AppRoute[]} routes
   * @returns {TabEntry[]}
   */
  public static getFromRoutes(routes: AppRoute[]): TabEntry[] {
    return routes.map(({meta, name}) => new TabEntry(meta?.title, name))
  }

  /**
   * Checks if the Tab Entry is the current route
   * @param {Route} activeRoute
   * @returns {boolean}
   */
  public isActive(activeRoute: Route): boolean {
    return activeRoute.matched.map(({name}) => name).includes(this.route)
  }

  /**
   * Creates an instance of TabEntry.
   * @param {string} title
   * @param {string} route
   */
  private constructor(
    public readonly title: string,
    public readonly route: string,
  ) {}
}
