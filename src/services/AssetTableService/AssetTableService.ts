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
import {MosaicTableFields, MosaicTableRowValues} from './MosaicTableConfig'
import {NamespaceTableFields, NamespaceTableRowValues} from './NamespaceTableConfig'

/**
 * Asset type
 * @export
 * @enum {number}
 */
export enum AssetType { 
  mosaic = 'mosaic',
  namespace = 'namespace',
}

/**
 * Table field to be used in a table header
 * @export
 * @interface TableField
 */
export interface TableField {
  name: TableFieldNames
  label: string
}

export const TableFieldNames = {...MosaicTableFields, ...NamespaceTableFields}

/**
 * Fields that can be used in a table
 * @export
 * @type {TableField}
 */
export type TableFieldNames = MosaicTableFields | NamespaceTableFields

/**
 * Values that can be displayed in a table
 * @export
 * @type {TableRowValues}
 */
export type TableRowValues = MosaicTableRowValues | NamespaceTableRowValues

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
export type TableSortingOptions = {itemName: TableFieldNames, direction: SortingDirections}

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
export type TableFilteringOptions = { itemName: TableFieldNames, filteringType: FilteringTypes }


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
   * @param {AssetType} assetType
   */
  public constructor(protected store: any, protected assetType: AssetType) {
    super()
    this.currentHeight = this.store.getters['network/currentHeight'] || 0
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
  public abstract getTableRows(): Promise<TableRowValues[]>

  /**
   * Filter table rows according to filtering options
   * @param {TableRowValues[]} values
   * @param {TableFilteringOptions} filterBy
   * @returns {TableRowValues[]}
   */
  public filter(values: TableRowValues[], filterBy: TableFilteringOptions): TableRowValues[] {
    const { itemName, filteringType } = filterBy

    if (filteringType === 'show') return values

    if (itemName === TableFieldNames.expiration) {
      return values.filter(({expiration}) => expiration !== 'expired')
    }

    if (itemName === TableFieldNames.expired) {
      return values.filter((value) => 'expired' in value && value.expired)
    }

    throw new Error(`sorting ${itemName} fields is not yet implemented`)
  }

  /**
   * Sorts array values according to sorting options
   * @param {TableRowValues[]} valuesToSort
   * @param {TableSortingOptions} sortBy
   * @returns {TableRowValues[]}
   */
  public sort(valuesToSort: TableRowValues[], sortBy: TableSortingOptions): TableRowValues[] {
    const { itemName, direction } = sortBy
    const values = [...valuesToSort]
    const sortingMethod = direction === 'asc' ? 'sort' : 'reverse'
    if (!values.length) return values
    const sampleValue = values[0][itemName]
    
    switch (typeof sampleValue) {
      case 'string':
        return values [sortingMethod]((a, b) => {
          return a[itemName].toLowerCase().localeCompare(
            b[itemName].toLowerCase(),
            navigator.languages[0] || navigator.language,
            {numeric: true, ignorePunctuation: true},
          )
        })
        
      case 'boolean':
        return [...values][sortingMethod]((a, b) => {
          return (a[itemName] === b[itemName]) ? 0 : a[itemName] ? -1 : 1
        })

      case 'number':
        return values[sortingMethod]((a, b) => {
          if (!b[itemName] || !a[itemName]) return 1
          return b[itemName] - a[itemName]
        })

      default:
        throw new Error(`sorting the data type ${typeof sampleValue} is not supported`)
    }
  }
}
