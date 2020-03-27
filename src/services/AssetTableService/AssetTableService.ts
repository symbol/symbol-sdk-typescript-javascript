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
import {Store} from 'vuex'

// internal dependencies
import {AbstractService} from '../AbstractService'

/**
 * Table field to be used in a table header
 * @export
 * @interface TableField
 */
export interface TableField {
  name: string
  label: string
}

/**
 * Sorting directions
 * @export
 * @type {SortingDirections}
 */
export type SortingDirections = 'asc' | 'desc'

/**
 * Sorting options
 * @export
 * @type {TableSortingOptions}
 */
export type TableSortingOptions = {
  fieldName: string
  direction: SortingDirections
}

/**
 * Filtering types
 * @export
 * @type {FilteringTypes}
 */
export type FilteringTypes = 'show' | 'hide'

/**
 * Filtering options
 * @export
 * @type {TableFilteringOptions}
 */
export type TableFilteringOptions = {
  fieldName: string
  filteringType: FilteringTypes
}

export abstract class AssetTableService extends AbstractService {
  /**
   * Service name
   * @var {string}
   */
  public name: string = 'asset-table'

  /**
   * Vuex Store 
   * @var {Vuex.Store}
   */
  public $store: Store<any>

  /**
   * Chain height
   * @protected
   * @var {number}
   */
  protected currentHeight: number

  /**
   * Creates an instance of AssetTableService.
   * @param {*} store
   */
  constructor(store?: Store<any>) {
    super()
    this.$store = store
    this.currentHeight = this.getCurrentHeight()
  }

  /**
   * Fetch current height from network store
   * @see {Store.Network}
   * @return {number}
   */
  protected getCurrentHeight(): number {
    return this.$store.getters['network/currentHeight'] || 0
  }

  /**
   * Return table fields to be displayed in a table header
   * @returns {TableField[]}
   */
  public abstract getTableFields(): TableField[]

  /**
   * Return table values to be displayed in a table rows
   * @returns {TableRowValues[]}
   */
  public abstract getTableRows(): any[]

  /**
   * Filter table rows according to filtering options
   * @param {TableRowValues[]} values
   * @param {TableFilteringOptions} filterBy
   * @returns {TableRowValues[]}
   */
  public filter(values: any[], filter: TableFilteringOptions): any[] {
    if (filter.filteringType === 'show') {
      return values
    }

    if (filter.fieldName === 'expiration') {
      return values.filter(({expiration}) => expiration !== 'expired')
    }

    if (filter.fieldName === 'expired') {
      return values.filter((value) => 'expired' in value && value.expired)
    }

    throw new Error(`Sorting by '${filter.fieldName}' field is not yet implemented`)
  }

  /**
   * Sorts array values according to sorting options
   * @param {TableRowValues[]} valuesToSort
   * @param {TableSortingOptions} sortBy
   * @returns {TableRowValues[]}
   */
  public sort(valuesToSort: any[], options: TableSortingOptions): any[] {
    const values = [...valuesToSort]
    const sortingMethod = options.direction === 'asc' ? 'sort' : 'reverse'
    if (!values.length) {
      return values
    }

    // - use sample to identify fields type
    const sampleValue = [...values][0][options.fieldName]

    if (sampleValue === undefined) {
      return values
    }

    // - sorting method depends on type
    if ('string' === typeof sampleValue) {
      return [...values][sortingMethod]((a, b) => {
        return a[options.fieldName].toLowerCase().localeCompare(
          b[options.fieldName].toLowerCase(),
          navigator.languages[0] || navigator.language,
          {numeric: true, ignorePunctuation: true},
        )
      })
    }
    else if ('boolean' === typeof sampleValue) {
      return [...values][sortingMethod]((a, b) => {
        return (a[options.fieldName] === b[options.fieldName]) ? 0 : a[options.fieldName] ? -1 : 1
      })
    }
    else if ('number' === typeof sampleValue) {
      return values[sortingMethod]((a, b) => {
        if (!b[options.fieldName] || !a[options.fieldName]) return 1
        return b[options.fieldName] - a[options.fieldName]
      })
    }

    throw new Error(`sorting the data type ${typeof sampleValue} is not supported`)
  }
}
