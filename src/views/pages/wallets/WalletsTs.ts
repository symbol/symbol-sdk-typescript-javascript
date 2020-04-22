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
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
// child components
// @ts-ignore
import NavigationTabs from '@/components/NavigationTabs/NavigationTabs.vue'
// @ts-ignore
import WalletSelectorPanel from '@/components/WalletSelectorPanel/WalletSelectorPanel.vue'

@Component({
  components: {
    NavigationTabs,
    WalletSelectorPanel,
  },
  computed: {
    ...mapGetters({}),
  },
})
export class WalletsTs extends Vue {
  /**
   * Argument passed to the navigation component
   * @var {string}
   */
  public parentRouteName: string = 'wallets'

}
