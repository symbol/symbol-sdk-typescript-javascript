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
import {Component, Prop, Vue} from 'vue-property-decorator'

// internal dependencies
import {
  AssetTableService, AssetType, TableFieldNames,
  TableSortingOptions, TableFilteringOptions,
  TableField, SortingDirections, FilteringTypes,
  TableRowValues,
} from '@/services/AssetTableService/AssetTableService'

// child components
// @ts-ignore
import TableRow from '@/components/TableRow/TableRow.vue'
import {AssetTableServiceFactory} from '@/services/AssetTableService/AssetTableServiceFactory'

@Component({
  components: {TableRow},
})
export class TableDisplayTs extends Vue {
  /**
   * Type of assets shown in the table
   * @type {string}
   */
  @Prop({default: AssetType.mosaic}) assetType: AssetType

  /**
  * Loading state of the data to be shown in the table
  * @type {boolean}
  */
  @Prop({default: false}) loading: boolean

  /**
   * Table Service
   * @var {AssetTableService}
   */
  public assetTableService: AssetTableService = AssetTableServiceFactory.getService(this.$store, this.assetType)

  /**
   * Current table sorting state
   * @var {TableSortingOptions}
   */
  public sortedBy: TableSortingOptions = {itemName: undefined, direction: undefined}

  /**
  * Current table filtering state
  * @var {TableFilteringOptions}
  */
  public filteredBy: TableFilteringOptions = {itemName: undefined, filteringType: undefined}

  /**
   * Non-filtered table data
   * @var {TableRowValues[]}
   */
  public tableRows: TableRowValues[] = []

  /**
   * Pagination page size
   * @type {number}
   */
  public pageSize: number = 10

  /**
   * Pagination page number
   * @type {number}
   */
  public currentPage: number = 1
  /// region getters and setters

  /**
   * Values displayed in the table
   * @readonly
   * @return {TableRowValues[]}
   */
  get displayedValues(): TableRowValues[] {
    return this.assetTableService.filter(this.tableRows, this.filteredBy)
  }

  /**
   * Header fields displayed in the table
   * @readonly
   * @return {TableField[]}
   */
  get tableFields(): TableField[] {
    return this.assetTableService.getTableFields()
  }

  /**
   * Get current page rows
   * @readonly
   * @return {TableRowValues[]}
   */
  get currentPageRows(): TableRowValues[] {
    return this.displayedValues.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    )
  }
  /// end-region getters and setters


  /**
   * Hook called when the component is created
   * @return {void}
   */
  public async created(): Promise<void> {
    this.setDefaultFiltering()
    await this.setTableValues()
    this.setDefaultSorting()
  }

  /**
   * Sets the default filtering state
   */
  public setDefaultFiltering(): void {
    const defaultFilteringType: FilteringTypes = 'hide'
    const defaultFilteringItemName: TableFieldNames = TableFieldNames.expiration

    Vue.set(this, 'filteredBy', {
      itemName: defaultFilteringItemName,
      filteringType: defaultFilteringType,
    })
  }

  /**
   * Triggers table filtering by setting its filtering options
   * @param {TableFieldNames} itemName
   */
  public filterBy(itemName: TableFieldNames): void {
    const filteredBy = {...this.filteredBy}
    const filteringType: FilteringTypes = filteredBy.itemName === itemName
      && filteredBy.filteringType === 'show' ? 'hide' : 'show'

    this.filteredBy = {itemName, filteringType}
  }

  /**
   * Sets the default sorting state and trigger it
   */
  public setDefaultSorting(): void {
    const defaultSortingDirection: SortingDirections = 'asc'
    const defaultSortingItemName: TableFieldNames = this.assetType === 'namespace'
      ? TableFieldNames.name : TableFieldNames.hexId

    Vue.set(this, 'sortedBy', {
      itemName: defaultSortingItemName,
      direction: defaultSortingDirection,
    })

    this.sortBy(defaultSortingItemName)
  }

  /**
   * Sorts the table data
   * @param {TableFieldNames} itemName
   */
  public sortBy(itemName: TableFieldNames): void {
    const sortedBy = {...this.sortedBy}
    const direction: SortingDirections = sortedBy.itemName === itemName
      && sortedBy.direction === 'asc'
      ? 'desc' : 'asc'

    Vue.set(this, 'sortedBy', {itemName, direction})
    this.tableRows = this.assetTableService.sort(this.tableRows, this.sortedBy)
  }

  /**
   * Refreshes the table values
   * @returns {Promise<void>}
   */
  public async refresh(): Promise<void> {
    await this.setTableValues()
  }

  /**
   * Sets the table values
   * @returns {Promise<void>}
   */
  public async setTableValues(): Promise<void> {
    this.tableRows = await this.assetTableService.getTableRows()
  }

  /**
   * Handle pagination page change
   * @param {number} page
   */
  public handlePageChange(page: number): void {
    this.currentPage = page
  }
}
