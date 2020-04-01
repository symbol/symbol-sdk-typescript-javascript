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
import {mapGetters} from 'vuex'
import {NamespaceId, AliasAction, MosaicId, Address, MosaicInfo, NamespaceInfo} from 'symbol-sdk'

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
import {MosaicService} from '@/services/MosaicService'

// child components
// @ts-ignore
import TableRow from '@/components/TableRow/TableRow.vue'
// @ts-ignore
import ModalFormWrap from '@/views/modals/ModalFormWrap/ModalFormWrap.vue'
// @ts-ignore
import FormAliasTransaction from '@/views/forms/FormAliasTransaction/FormAliasTransaction.vue'
// @ts-ignore
import FormExtendNamespaceDurationTransaction from '@/views/forms/FormExtendNamespaceDurationTransaction/FormExtendNamespaceDurationTransaction.vue'
// @ts-ignore
import FormMosaicSupplyChangeTransaction from '@/views/forms/FormMosaicSupplyChangeTransaction/FormMosaicSupplyChangeTransaction.vue'

@Component({
  components: {
    TableRow,
    ModalFormWrap,
    FormAliasTransaction,
    FormExtendNamespaceDurationTransaction,
    FormMosaicSupplyChangeTransaction,
  },
  computed: {...mapGetters({
    currentWalletAddress: 'wallet/currentWalletAddress',
    ownedMosaics: 'wallet/currentWalletOwnedMosaics',
    ownedNamespaces: 'wallet/currentWalletOwnedNamespaces',
  })},
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
  loading: boolean =false

  /**
   * Current wallet owned mosaics
   * @protected
   * @type {MosaicInfo[]}
   */
  protected ownedMosaics: MosaicInfo[]

  /**
   * Current wallet owned namespaces
   * @protected
   * @type {NamespaceInfo[]}
   */
  protected ownedNamespaces: NamespaceInfo[]

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
   * Current wallet address
   * @private
   * @type {Address}
   */
  private currentWalletAddress: Address

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

  public nodata = [...new Array(this.pageSize).keys()]

  protected get ownedAssetHexIds(): string[] {
    return this.assetType === 'namespace'
      ? this.ownedNamespaces.map(({id}) => id.toHex())
      : this.ownedMosaics.map(({id}) => id.toHex())
  }

  /**
   * Modal forms visibility states
   * @protected
   * @type {{
   *     aliasTransaction: boolean
   *     extendNamespaceDuration: boolean
   *     mosaicSupplyChangeTransaction: boolean
   *   }}
   */
  protected modalFormsVisibility: {
    aliasTransaction: boolean
    extendNamespaceDurationTransaction: boolean
    mosaicSupplyChangeTransaction: boolean
  } = {
    aliasTransaction: false,
    extendNamespaceDurationTransaction: false,
    mosaicSupplyChangeTransaction: false,
  }

  /**
   * Action forms props
   * @protected
   * @type {({
   *     namespaceId: NamespaceId
   *     aliasTarget: MosaicId | Address
   *     aliasAction: AliasAction
   *     mosaicId: MosaicId
   *   })}
   */
  protected modalFormsProps: {
    namespaceId: NamespaceId
    aliasTarget: MosaicId | Address
    aliasAction: AliasAction
    mosaicId: MosaicId
  } = {
    namespaceId: null,
    aliasTarget: null,
    aliasAction: null,
    mosaicId: null,
  }
  // Alias forms props

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
   * Non-filtered table data
   * @var {TableRowValues[]}
   */
  private get tableRows(): any[] {
    return this.getService().getTableRows()
  }

  /**
   * Values displayed in the table
   * @readonly
   * @return {TableRowValues[]}
   */
  get displayedValues(): any[] {
    return this.getService().sort(
      this.getService().filter(this.tableRows, this.filteredBy),
      this.sortedBy,
    )
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
  /**
   * getter and setter for the showExpired button
   * 
   */
  get showExpired(): boolean{
    return this.filteredBy.fieldName === 'expiration' && this.filteredBy.filteringType === 'show'
  }
  set showExpired(newVal: boolean){
    this.setFilteredBy('expiration')
  }

  /**
   * Alias form modal title
   * @type {string}
   * @protected
   */
  protected get aliasModalTitle(): string {
    return this.modalFormsProps.aliasAction === AliasAction.Link
      ? 'modal_title_link_alias' : 'modal_title_unlink_alias'
  }
  /// end-region getters and setters

  /**
   * Hook called when the component is created
   * @return {void}
   */
  public async created(): Promise<void> {
    // refresh owned assets
    this.refresh()
    // initialize sorting and filtering
    this.setDefaultFiltering()
    // await this.refresh()
    this.setDefaultSorting()
  }

  /**
   * Refreshes the owned assets
   * @returns {void}
   */
  private async refresh(): Promise<void> {
    this.loading = true
    if (this.assetType === 'namespace') {
      this.$store.dispatch('wallet/REST_FETCH_OWNED_NAMESPACES', this.currentWalletAddress.plain())
    }

    const mosaics = await this.$store.dispatch('wallet/REST_FETCH_OWNED_MOSAICS', this.currentWalletAddress.plain())
    new MosaicService(this.$store).refreshMosaicModels(mosaics, true)
    this.loading = false
  }
  /**
   * Sets the default filtering state
   */
  public setDefaultFiltering(): void {
    const defaultFilteringType: FilteringTypes = 'hide'
    const defaultFilteringFieldName: string = 'expiration'

    Vue.set(this, 'filteredBy', {
      fieldName: defaultFilteringFieldName,
      filteringType: defaultFilteringType,
    })
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

    this.setSortedBy(defaultField)
  }

  /**
   * Triggers table filtering by setting its filtering options
   * @param {TableFieldNames} fieldName
   */
  public setFilteredBy(fieldName: string): void {
    const filteredBy = {...this.filteredBy}
    const filteringType: FilteringTypes = filteredBy.fieldName === fieldName
      && filteredBy.filteringType === 'show' ? 'hide' : 'show'

    this.filteredBy = {fieldName, filteringType}
  }

  /**
   * Sorts the table data
   * @param {TableFieldNames} fieldName
   */
  public setSortedBy(fieldName: string): void {
    const sortedBy = {...this.sortedBy}
    const direction: SortingDirections = sortedBy.fieldName === fieldName
      && sortedBy.direction === 'asc'
      ? 'desc' : 'asc'

    Vue.set(this, 'sortedBy', {fieldName, direction})
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
   * @return {void}
   */
  protected showAliasForm(rowValues: Record<string, string>): void {
    // populate asset form modal props if asset is a mosaic
    if (this.assetType === 'mosaic') {
      this.modalFormsProps.namespaceId = rowValues.name !== 'N/A' ? new NamespaceId(rowValues.name) : null
      this.modalFormsProps.aliasTarget = new MosaicId(rowValues.hexId)
      this.modalFormsProps.aliasAction = rowValues.name !== 'N/A' ? AliasAction.Unlink : AliasAction.Link
    }

    /**
     * Helper function to instantiate the alias target if any
     * @param {string} aliasTarget
     * @param {('address' | 'mosaic')} aliasType
     * @returns {(MosaicId | Address)}
     */
    const getInstantiatedAlias = (aliasType: string, aliasTarget: string): MosaicId | Address => {
      if (aliasType === 'mosaic') return new MosaicId(aliasTarget)
      return Address.createFromRawAddress(aliasTarget)
    }

    // populate asset form modal props if asset is a namespace
    if (this.assetType === 'namespace') {
      this.modalFormsProps.namespaceId = new NamespaceId(rowValues.name),
      this.modalFormsProps.aliasTarget = rowValues.aliasIdentifier === 'N/A' ? null : rowValues.aliasIdentifier 
        ? getInstantiatedAlias(rowValues.aliasType, rowValues.aliasIdentifier) : null
      this.modalFormsProps.aliasAction = rowValues.aliasIdentifier === 'N/A' ? AliasAction.Link : AliasAction.Unlink
    }

    // show the alias form modal
    Vue.set(this.modalFormsVisibility, 'aliasTransaction', true)
  }

  /**
   * Triggers the extend namespace duration form modal
   * @protected
   * @param {Record<string, string>} rowValues
   * @return {void}
   */
  protected showExtendNamespaceDurationForm(rowValues: Record<string, string>): void {
    this.modalFormsProps.namespaceId = new NamespaceId(rowValues.name)
    Vue.set(this.modalFormsVisibility, 'extendNamespaceDurationTransaction', true)
  }

  /**
   * Triggers the modify mosaic supply form modal
   * @protected
   * @param {Record<string, string>} rowValues
   * @return {void}
   */
  protected showModifyMosaicSupplyForm(rowValues: Record<string, string>): void {
    this.modalFormsProps.mosaicId = new MosaicId(rowValues.hexId)
    Vue.set(this.modalFormsVisibility, 'mosaicSupplyChangeTransaction', true)
  }

  /**
   * Closes a modal
   * @protected
   * @param {string} modalIdentifier
   * @return {void}
   */
  protected closeModal(modalIdentifier: string): void {
    Vue.set(this.modalFormsVisibility, modalIdentifier, false)
  }
  /**
   * avoid multiple clicks
   * @protected
   * @param {string} 
   * @return {void}
   */
  public isRefreshing: boolean = false
  protected async onRefresh() {
    if (!this.isRefreshing) {
      this.isRefreshing = true
      try {
        await this.refresh()
        this.$store.dispatch('notification/ADD_SUCCESS', `${this.$t('refresh_success')}`)
      } catch{
        this.$store.dispatch('notification/ADD_ERROR', `${this.$t('refresh_failed')}`)
      }
      this.isRefreshing = false
    }
  }
}
