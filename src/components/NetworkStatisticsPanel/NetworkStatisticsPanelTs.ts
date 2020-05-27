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
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
// configuration
// child components
// @ts-ignore
import AnimatedNumber from '@/components/AnimatedNumber/AnimatedNumber.vue'
import { NodeModel } from '@/core/database/entities/NodeModel'
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel'

@Component({
  components: {
    AnimatedNumber,
  },
  computed: {
    ...mapGetters({
      networkConfiguration: 'network/networkConfiguration',
      countTransactions: 'statistics/countTransactions',
      countAccounts: 'statistics/countAccounts',
      countNodes: 'statistics/countNodes',
      currentHeight: 'network/currentHeight',
      currentPeerInfo: 'network/currentPeerInfo',
    }),
  },
})
export class NetworkStatisticsPanelTs extends Vue {
  /**
   * The network configuration.
   */
  private networkConfiguration: NetworkConfigurationModel

  /**
   * Number of transactions on the network
   */
  public countTransactions: number

  /**
   * Number of accounts on the network
   */
  public countAccounts: number

  /**
   * Number of nodes on the network
   */
  public countNodes: number

  /**
   * Current network block height
   */
  public currentHeight: number

  /**
   * Currently connect peer information
   */
  public currentPeerInfo: NodeModel

  /**
   * Current network target block time
   */
  protected get blockGenerationTargetTime(): number {
    return this.networkConfiguration.blockGenerationTargetTime
  }
}
