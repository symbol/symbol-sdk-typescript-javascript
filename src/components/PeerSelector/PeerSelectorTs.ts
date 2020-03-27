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
import {NetworkType} from 'symbol-sdk'
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {PeersModel} from '@/core/database/entities/PeersModel'
import {PeersRepository} from '@/repositories/PeersRepository'
import {PeerService} from '@/services/PeerService'
import {URLHelpers} from '@/core/utils/URLHelpers'
import {NotificationType} from '@/core/utils/NotificationType'

// internal dependencies
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'

// helpers
const getNetworkTypeText = (networkType: NetworkType) => {
  switch (networkType) {
    default:
    case NetworkType.MIJIN_TEST: return 'MIJIN_TEST'
    case NetworkType.MIJIN: return 'MIJIN'
    case NetworkType.TEST_NET: return 'TEST_NET'
    case NetworkType.MAIN_NET: return 'MAIN_NET'
  }
}

// child components
import {ValidationObserver, ValidationProvider} from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'

// resources
import {dashboardImages} from '@/views/resources/Images'

@Component({
  computed: {...mapGetters({
    currentPeer: 'network/currentPeer',
    isConnected: 'network/isConnected',
    networkType: 'network/networkType',
    generationHash: 'network/generationHash',
    knownPeers: 'network/knownPeers',
  })},
  components: {ValidationObserver, ValidationProvider, ErrorTooltip},
})
export class PeerSelectorTs extends Vue {
  /**
   * Currently active endpoint
   * @see {Store.Network}
   * @var {Object}
   */
  public currentPeer: Record<string, any>

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
   * Current generationHash
   * @see {Store.Network}
   * @var {string}
   */
  public generationHash: string

  /**
   * Known peers
   * @see {Store.Network}
   * @var {string[]}
   */
  public knownPeers: string[]

  /**
   * Peers list
   * @var {Map<string, PeersModel>}
   */
  public collection: Map<string, PeersModel>

  /**
   * Form items
   * @var {Object}
   */
  public formItems = {
    nodeUrl: '',
    setDefault: false,
  }

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  public validationRules = ValidationRuleset

  /**
   * Image resources
   */
  public imageResources = dashboardImages

  /**
  * Type the ValidationObserver refs 
  * @type {{
  *     observer: InstanceType<typeof ValidationObserver>
  *   }}
  */
  public $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  }

  /// region computed properties getter/setter
  get peersList(): string[] {
    return this.knownPeers
  }

  get networkTypeText(): string {
    if (!this.isConnected) return this.$t('Invalid_node').toString()
    return !!this.networkType ? getNetworkTypeText(this.networkType) : this.$t('Loading').toString()
  }
  /// end-region computed properties getter/setter

  /**
   * Switch the currently active peer
   * @param peer 
   */
  public switchPeer(url: string) {
    this.$store.dispatch('network/SET_CURRENT_PEER', url)
  }

  /**
   * Add a new peer to storage
   * @return {void}
   */
  public async addPeer() {
    const service = new PeerService(this.$store)
    const repository = new PeersRepository()

    // validate and parse input
    const nodeUrl = service.getNodeUrl(this.formItems.nodeUrl)
    const node = URLHelpers.formatUrl(nodeUrl)

    // return if node already exists in the database
    if (service
      .getEndpoints()
      .map(model => model.values.get('rest_url'))
      .findIndex(url => url === nodeUrl) > -1) {
      this.$store.dispatch('notification/ADD_ERROR', NotificationType.NODE_EXISTS_ERROR)
      return
    }

    // show loading overlay
    this.$store.dispatch('app/SET_LOADING_OVERLAY', {
      show: true,
      message: `${this.$t('info_connecting_peer', {peerUrl: node.url})}`,
    })

    // read network type from node pre-saving
    try {
      const {
        networkType,
        generationHash,
        peerInfo,
      } = await this.$store.dispatch('network/REST_FETCH_PEER_INFO', nodeUrl)

      // hide loading overlay
      this.$store.dispatch('app/SET_LOADING_OVERLAY', {show: false})

      // prepare model
      const peer = new PeersModel(new Map<string, any>([
        [ 'rest_url', nodeUrl ],
        [ 'host', node.hostname ],
        [ 'port', parseInt(node.port) ],
        [ 'protocol', node.protocol ],
        [ 'networkType', networkType ],
        [ 'generationHash', generationHash ],
        [ 'roles', peerInfo.roles ],
        [ 'is_default', this.formItems.setDefault ],
        [ 'friendly_name', peerInfo.friendlyName ],
      ]))

      // save in storage
      repository.create(peer.values)
      this.$store.dispatch('network/ADD_KNOWN_PEER', nodeUrl)
      this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)
      this.$store.dispatch('diagnostic/ADD_DEBUG', `PeerSelector added peer: ${nodeUrl}`)

      // reset the form input
      this.formItems.nodeUrl = ''

      Vue.nextTick().then(() =>{
        // reset the form validation
        this.$refs.observer.reset()

        // scroll to the bottom of the node list
        const container = this.$el.querySelector('#node-list-container')
        container.scrollTop = container.scrollHeight
      })
    }
    catch(e) {
      // hide loading overlay
      this.$store.dispatch('app/SET_LOADING_OVERLAY', {show: false})
      this.$store.dispatch('diagnostic/ADD_ERROR', `PeerSelector unreachable host with URL: ${nodeUrl}`)
      this.$store.dispatch('notification/ADD_ERROR', NotificationType.ERROR_PEER_UNREACHABLE)
    }
  }

  /**
   * Remove peer
   * @return {void}
   */
  public removePeer(url: string) {
    // get peer service
    const service = new PeerService(this.$store)

    // don't allow deleting all the nodes
    if (service.getEndpoints().length === 1) {
      this.$store.dispatch('notification/ADD_ERROR', NotificationType.ERROR_DELETE_ALL_PEERS)
      return
    }

    // get full node URL
    const nodeUrl = service.getNodeUrl(url)

    // remove the mode from the vuex store
    this.$store.dispatch('network/REMOVE_KNOWN_PEER', nodeUrl)
    this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)

    // remove the node from the storage
    service.deleteEndpoint(url)
  }

  /**
   * Reset list of peers to defaults
   * @return {void}
   */
  public resetList() {
    this.$store.dispatch('network/RESET_PEERS')
  }
}
