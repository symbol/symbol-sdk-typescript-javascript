import {isWindows, Message, defaultNodeList, routesWithoutAlert} from '@/config/index.ts'
import monitorSelected from '@/common/img/window/windowSelected.png'
import monitorUnselected from '@/common/img/window/windowUnselected.png'
import {completeUrlWithHostAndProtocol, localSave} from '@/core/utils'
import {Component, Provide, Vue} from 'vue-property-decorator'
import {windowSizeChange, minWindow, maxWindow, unMaximize, closeWindow} from '@/core/utils/electron.ts'
import {mapState} from 'vuex'
import {NetworkType} from 'nem2-sdk'
import {languageConfig} from '@/config'
import {StoreAccount, AppInfo, Notice, NoticeType, Endpoint} from '@/core/model'
import routes from '@/router/routers'
import {validation} from '@/core/validation'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'
@Component({
  components: {
    ErrorTooltip,
  },
  computed: {
    ...mapState({
      activeAccount: 'account',
      app: 'app',
    }),
  },
})
export class MenuBarTs extends Vue {
  @Provide() validator: any = this.$validator
  activeAccount: StoreAccount
  app: AppInfo
  minWindow = minWindow
  validation = validation
  isWindows = isWindows
  inputNodeValue = ''
  isNowWindowMax = false
  monitorSelected = monitorSelected
  monitorUnselected = monitorUnselected
  languageList = languageConfig
  NetworkType = NetworkType
  closeWindow = closeWindow
  isShowNodeList = false

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

  created() {
    if (isWindows) windowSizeChange()
  }
}
