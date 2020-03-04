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
import {NodeInfo} from 'symbol-sdk'
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// configuration
import networkConfig from '@/../config/network.conf.json'
const currentNetworkConfig = networkConfig.networks['testnet-publicTest']

// child components
// @ts-ignore
import AnimatedNumber from '@/components/AnimatedNumber/AnimatedNumber.vue'

@Component({
  components: {
    AnimatedNumber,
  },
  computed: {...mapGetters({
    countTransactions: 'statistics/countTransactions',
    countAccounts: 'statistics/countAccounts',
    countNodes: 'statistics/countNodes',
    currentHeight: 'network/currentHeight',
    currentPeerInfo: 'network/currentPeerInfo',
  })}})
export class NetworkStatisticsPanelTs extends Vue {
  /**
   * Current network target block time
   * @protected
   * @var {number}
   */
  protected targetBlockTime: number = currentNetworkConfig.properties.targetBlockTime

  /**
   * Number of transactions on the network
   * @var {number}
   */
  public countTransactions: number

  /**
   * Number of accounts on the network
   * @var {number}
   */
  public countAccounts: number

  /**
   * Number of nodes on the network
   * @var {number}
   */
  public countNodes: number

  /**
   * Current network block height
   * @var {number}
   */
  public currentHeight: number

  /**
   * Currently connect peer information
   * @var {NodeInfo}
   */
  public currentPeerInfo: NodeInfo

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  created() {
    this.$store.dispatch('statistics/initialize')
  }
}
