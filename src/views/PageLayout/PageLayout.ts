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
import {NetworkType} from 'nem2-sdk'
import {Component, Provide, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {Electron} from '@/core/utils/Electron'
import {AccountsModel} from '@/core/database/models/AppAccount'

// child components
// @ts-ignore
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'
// @ts-ignore
import PageNavigator from '@/components/page-navigator/PageNavigator.vue'

@Component({
  components: {
    ErrorTooltip,
    PageNavigator,
  },
  computed: {
    ...mapGetters({
      currentPeer: 'network/currentPeer',
      isConnected: 'network/isConnected',
      networkType: 'network/networkType',
      currentAccount: 'account/currentAccount',
      currentLanguage: 'app/currentLanguage',
    }),
  },
})
export class PageLayoutTs extends Vue {
  @Provide() validator: any = this.$validator

  /**
   * Whether the app is running on windows platform
   * @var {boolean}
   */
  public isWindows = process.platform === 'win32'

  /**
   * Currently active account
   * @see {Store.Account}
   * @var {string}
   */
  public currentAccount: AccountsModel

  /**
   * Currently active peer
   * @see {Store.Network}
   * @var {Object}
   */
  public currentPeer: Object

  /**
   * Currently active language
   * @see {Store.AppInfo}
   * @var {string}
   */
  public currentLanguage: string

  /**
   * Whether the connection is up
   * @see {Store.Network}
   * @var {boolean}
   */
  public isConnected: boolean

  /**
   * Current networkType
   * @see {Store.Network}
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Holds alert message
   * @var {Object}
   */
  public alert: {show: boolean, message: string} = {show: false, message: ''}

  /**
   * Hook called when the layout is created (used)
   * @return {void}
   */
  created() {
    if (process.platform === 'win32')
      Electron.windowSizeChange()

    if (! this.currentPeer || ! this.isConnected) {
      this.alert = {show: true, message: 'Node_not_available_please_check_your_node_or_network_settings'}
    }

    if (this.currentAccount && this.currentAccount.networkType !== this.networkType) {
      this.alert = {show: true, message: 'Wallet_network_type_does_not_match_current_network_type'}
    }
  }
/**
  get routes() {
    return routes[0].children
      .filter(({meta}) => meta.clickable)
      .map(({path, meta}) => ({path, meta}))
  }

  get NetworkProperties() {
    return this.app.networkProperties
  }

  get isNodeHealthy() {
    if (!this.NetworkProperties) return true
    if(!this.activeAccount.node) return false
    return this.NetworkProperties.healthy
  }

  get alert(): {show: boolean, message: string} {
    const {NetworkProperties, networkType, activeAccount, wallet} = this
    if (!NetworkProperties || !wallet || !wallet.networkType || routesWithoutAlert[this.$route.name]) {return {
      show: false,
      message: '',
    }}

    if (!activeAccount.node || !NetworkProperties.healthy) {return {
      show: true,
      message: 'Node_not_available_please_check_your_node_or_network_settings',
    }}

    if (networkType && NetworkProperties.networkType !== networkType) {return {
      show: true,
      message: 'Wallet_network_type_does_not_match_current_network_type',
    }}

    return {
      show: false,
      message: '',
    }
  }

  get wallet() {
    return this.activeAccount.wallet || false
  }

  get walletList() {
    return this.app.walletList || []
  }

  get networkType() {
    return this.activeAccount.wallet ? this.activeAccount.wallet.networkType : false
  }

  get node() {
    return this.activeAccount.node
  }

  set node(newNode: string) {
    if (!this.wallet) return
    const {networkType} = this
    this.$store.commit('SET_NODE', {node: `${newNode}`, networkType})
  }

  get nodeList() {
    const {networkType} = this
    if(!networkType) return []
    return [...this.app.nodeList].filter(item=>item.networkType === networkType)
  }

  set nodeList(nodeList: Endpoint[]) {
    this.$store.commit('SET_NODE_LIST', nodeList)
  }

  get language() {
    return this.$i18n.locale
  }

  set language(lang) {
    this.$i18n.locale = lang
    localSave('locale', lang)
  }

  get nodeNetworkTypeText() {
    const {healthy, networkType} = this.app.networkProperties
    if (!healthy) return this.$t('Invalid_node')
    return networkType ? NetworkType[networkType] : this.$t('Loading')
  }

  get currentWalletAddress() {
    if (!this.wallet) return null
    return this.activeAccount.wallet.address
  }

  set currentWalletAddress(newActiveWalletAddress) {
    const newActiveWallet = this.walletList.find(({address}) => address === newActiveWalletAddress)
    this.$store.commit('SET_WALLET', newActiveWallet)
  }

  get accountName() {
    return this.activeAccount.currentAccount.name
  }

  refreshValidate() {
    this.inputNodeValue = ''
    this.$validator.reset()
  }

  accountQuit() {
    this.$store.commit('RESET_APP')
    this.$store.commit('RESET_ACCOUNT')
    this.$router.push('login')
  }

  maxWindow() {
    this.isNowWindowMax = !this.isNowWindowMax
    maxWindow()
  }

  unMaximize() {
    this.isNowWindowMax = !this.isNowWindowMax
    unMaximize()
  }

  removeNode(clickedNodeName: string) {
    if (this.nodeList.length === 1) {
      Notice.trigger(Message.NODE_ALL_DELETED, NoticeType.error, this.$store)
      return
    }

    this.nodeList = [...this.app.nodeList].filter(
      ({value, networkType}) => !(value === clickedNodeName && networkType === this.networkType),
    )

    if (clickedNodeName === this.node){
      this.node = this.nodeList[0].value
    }
  }

  selectEndpoint(index) {
    if (this.node === this.nodeList[index].value) return
    this.node = this.nodeList[index].value
    this.refreshValidate()
  }

  submit() {
    const {inputNodeValue} = this
    this.$validator
      .validate()
      .then((valid) => {
        if (!valid) return
        this.inputNodeValue = completeUrlWithHostAndProtocol(inputNodeValue)
        this.createNewNode()
      })
  }

  createNewNode() {
    const {inputNodeValue} = this
    const {networkType} = this.activeAccount.wallet
    const nodeList = [...this.app.nodeList]
    const nodeIndexInList = nodeList.findIndex(item => item.value === inputNodeValue)

    if (nodeIndexInList > -1) nodeList.splice(nodeIndexInList, 1)

    nodeList.unshift({
      value: inputNodeValue,
      name: inputNodeValue,
      url: inputNodeValue,
      networkType,
    })

    this.nodeList = nodeList
    this.selectEndpoint(0)
  }

  resetNodeListToDefault() {
    const {networkType } = this
    this.nodeList = [...this.app.nodeList]
      .filter(item=>item.networkType !== networkType )
      .concat(defaultNodeList.filter(item=>item.networkType === networkType))
    this.selectEndpoint(0)
  }
*/
}
