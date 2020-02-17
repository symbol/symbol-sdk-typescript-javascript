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
  AssetTableService,
  TableSortingOptions,
  TableFilteringOptions,
  TableField,
  SortingDirections,
  FilteringTypes,
} from '@/services/AssetTableService/AssetTableService'
import {MosaicTableService} from '@/services/AssetTableService/MosaicTableService'
import {NamespaceTableService} from '@/services/AssetTableService/NamespaceTableService'

// child components
// @ts-ignore
import TableRow from '@/components/TableRow/TableRow.vue'
import {NamespaceId, AliasAction, MosaicId} from 'nem2-sdk'

@Component({
  components: {TableRow},
})
export class TableDisplayTs extends Vue {
  /**
   * Type of assets shown in the table
   * @type {string}
   */
  @Prop({
    default: 'mosaic',
  }) assetType: string

  /**
  * Loading state of the data to be shown in the table
  * @type {boolean}
  */
  @Prop({default: false}) loading: boolean

  /**
   * Current table sorting state
   * @var {TableSortingOptions}
   */
  public sortedBy: TableSortingOptions = {fieldName: undefined, direction: undefined}

  /**
  * Current table filtering state
  * @var {TableFilteringOptions}
  */
  public filteredBy: TableFilteringOptions = {fieldName: undefined, filteringType: undefined}

  /**
   * Non-filtered table data
   * @var {TableRowValues[]}
   */
  public tableRows: any[] = []

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

  /**
   * Instantiate the table service around {assetType}
   * @return {AssetTableService}
   */
  protected getService(): AssetTableService {
    if ('mosaic' === this.assetType) {
      return new MosaicTableService(this.$store)
    }
    else if ('namespace' === this.assetType) {
      return new NamespaceTableService(this.$store)
    }

    throw new Error(`Asset type '${this.assetType}' does not exist in TableDisplay.`)
  }

  /// region getters and setters
  /**
   * Values displayed in the table
   * @readonly
   * @return {TableRowValues[]}
   */
  get displayedValues(): any[] {
    return this.getService().filter(this.tableRows, this.filteredBy)
  }

  /**
   * Header fields displayed in the table
   * @readonly
   * @return {TableField[]}
   */
  get tableFields(): TableField[] {
    return this.getService().getTableFields()
  }

  /**
   * Get current page rows
   * @readonly
   * @return {TableRowValues[]}
   */
  get currentPageRows(): any[] {
    return this.displayedValues.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize,
    )
  }
  /// end-region getters and setters


  /**
   * Hook called when the component is created
   * @return {void}
   */
  public async created(): Promise<void> {
    this.setDefaultFiltering()
    await this.refresh()
    this.setDefaultSorting()
  }

  /**
   * Sets the default filtering state
   */
  public setDefaultFiltering(): void {
    const defaultFilteringType: FilteringTypes = 'hide'
    const defaultFilteringfieldName: string = 'expiration'

    Vue.set(this, 'filteredBy', {
      fieldName: defaultFilteringfieldName,
      filteringType: defaultFilteringType,
    })
  }

  /**
   * Triggers table filtering by setting its filtering options
   * @param {TableFieldNames} fieldName
   */
  public filterBy(fieldName: string): void {
    const filteredBy = {...this.filteredBy}
    const filteringType: FilteringTypes = filteredBy.fieldName === fieldName
      && filteredBy.filteringType === 'show' ? 'hide' : 'show'

    this.filteredBy = {fieldName, filteringType}
  }

  /**
   * Sets the default sorting state and trigger it
   */
  public setDefaultSorting(): void {
    const defaultSort = 'asc'
    const defaultField = 'namespace' === this.assetType ? 'name' : 'hexId'

    Vue.set(this, 'sortedBy', {
      fieldName: defaultField,
      direction: defaultSort,
    })

    this.sortBy(defaultField)
  }

  /**
   * Sorts the table data
   * @param {TableFieldNames} fieldName
   */
  public sortBy(fieldName: string): void {
    const sortedBy = {...this.sortedBy}
    const direction: SortingDirections = sortedBy.fieldName === fieldName
      && sortedBy.direction === 'asc'
      ? 'desc' : 'asc'

    Vue.set(this, 'sortedBy', {fieldName, direction})
    this.tableRows = this.getService().sort(this.tableRows, this.sortedBy)
  }

  /**
   * Refreshes the table values
   * @returns {Promise<void>}
   */
  public async refresh(): Promise<void> {
    this.tableRows = await this.getService().getTableRows()
  }

  /**
   * Handle pagination page change
   * @param {number} page
   */
  public handlePageChange(page: number): void {
    this.currentPage = page
  }

  /**
   * Triggers the alias form modal
   * @protected
   * @param {Record<string, string>} rowValues
   */
  public showAliasForm(rowValues: Record<string, string>): void {
    if (this.assetType === 'mosaic') {
      this.$emit(
        'show-alias-form', {
          namespaceId: null,
          aliasTarget: new MosaicId(rowValues.hexId),
          aliasAction: AliasAction.Link,
        })
      return
    }

    if (this.assetType === 'namespace') {
      this.$emit(
        'show-alias-form', {
          namespaceId: new NamespaceId(rowValues.name),
          aliasTarget: null,
          aliasAction: AliasAction.Link,
        })
    }
  }
}
