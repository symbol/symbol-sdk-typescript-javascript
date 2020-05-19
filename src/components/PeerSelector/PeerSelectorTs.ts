/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { NetworkType, RepositoryFactory } from 'symbol-sdk'
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
// internal dependencies
import { URLHelpers } from '@/core/utils/URLHelpers'
import { NotificationType } from '@/core/utils/NotificationType'
// internal dependencies
import { ValidationRuleset } from '@/core/validation/ValidationRuleset'
// child components
import { ValidationObserver, ValidationProvider } from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// resources
import { dashboardImages } from '@/views/resources/Images'
import { NodeModel } from '@/core/database/entities/NodeModel'
import { NetworkTypeHelper } from '@/core/utils/NetworkTypeHelper'
import * as _ from 'lodash'

@Component({
  computed: {
    ...mapGetters({
      currentPeerInfo: 'network/currentPeerInfo',
      isConnected: 'network/isConnected',
      networkType: 'network/networkType',
      repositoryFactory: 'network/repositoryFactory',
      generationHash: 'network/generationHash',
      knowNodes: 'network/knowNodes',
    }),
  },
  components: { ValidationObserver, ValidationProvider, ErrorTooltip },
})
export class PeerSelectorTs extends Vue {
  /**
   * Currently active endpoint
   * @see {Store.Network}
   * @var {Object}
   */
  public currentPeerInfo: NodeModel

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
  public knowNodes: NodeModel[]

  public repositoryFactory: RepositoryFactory

  /**
   * Form items
   * @var {Object}
   */
  public formItems = {
    nodeUrl: '',
    filter: '',
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
  public poptipVisible: boolean = false

  /// region computed properties getter/setter
  get peersList(): NodeModel[] {
    const nodeModels = this.knowNodes.filter((p) => {
      if (!this.formItems.filter) {
        return true
      } else {
        return (
          p.url.includes(this.formItems.filter) ||
          (p.friendlyName && p.friendlyName.includes(this.formItems.filter)) ||
          this.currentPeerInfo.url === p.url
        )
      }
    })
    return _.sortBy(
      nodeModels,
      (a) => a.isDefault !== true,
      (a) => a.url,
    )
  }

  get networkTypeText(): string {
    if (!this.isConnected) return this.$t('Invalid_node').toString()
    return !!this.networkType ? NetworkTypeHelper.getNetworkTypeLabel(this.networkType) : this.$t('Loading').toString()
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
    // validate and parse input
    const nodeUrl = URLHelpers.getNodeUrl(this.formItems.nodeUrl)

    // return if node already exists in the database
    if (this.knowNodes.find((node) => node.url === nodeUrl)) {
      this.$store.dispatch('notification/ADD_ERROR', NotificationType.NODE_EXISTS_ERROR)
      return
    }

    // read network type from node pre-saving
    try {
      // hide loading overlay
      this.$store.dispatch('network/ADD_KNOWN_PEER', nodeUrl)
      this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)
      this.$store.dispatch('diagnostic/ADD_DEBUG', 'PeerSelector added peer: ' + nodeUrl)

      // reset the form input
      this.formItems.nodeUrl = ''

      Vue.nextTick().then(() => {
        // reset the form validation
        this.$refs.observer.reset()

        // scroll to the bottom of the node list
        // const container = this.$el.querySelector('#node-list-container')
        // container.scrollTop = container.scrollHeight
        // Maybe scroll to element instead of tunning the filter?
        this.formItems.filter = nodeUrl
      })
    } catch (e) {
      // hide loading overlay
      this.$store.dispatch('diagnostic/ADD_ERROR', 'PeerSelector unreachable host with URL: ' + nodeUrl)
      this.$store.dispatch('notification/ADD_ERROR', NotificationType.ERROR_PEER_UNREACHABLE)
    }
  }

  /**
   * Remove peer
   * @return {void}
   */
  public removePeer(url: string) {
    // don't allow deleting all the nodes
    if (this.knowNodes.length === 1) {
      this.$store.dispatch('notification/ADD_ERROR', NotificationType.ERROR_DELETE_ALL_PEERS)
      return
    }
    // get full node URL
    const nodeUrl = URLHelpers.getNodeUrl(url)
    // remove the mode from the vuex store
    this.$store.dispatch('network/REMOVE_KNOWN_PEER', nodeUrl)
    this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)
  }

  /**
   * Reset list of peers to defaults
   * @return {void}
   */
  public resetList() {
    this.$store.dispatch('network/RESET_PEERS')
  }
  onPopTipShow() {
    this.$forceUpdate()
  }
  goSetting() {
    this.poptipVisible = false
    this.$router.push({ name: 'settings' })
  }
}
