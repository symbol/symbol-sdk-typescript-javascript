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
import {Component, Prop} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {FormNamespaceRegistrationTransactionTs} from '../FormNamespaceRegistrationTransaction/FormNamespaceRegistrationTransactionTs'
import {NamespaceId} from 'symbol-sdk'
import {TimeHelpers} from '@/core/utils/TimeHelpers'
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'

// configuration
import networkConfig from '@/../config/network.conf.json'
import {NamespacesModel} from '@/core/database/entities/NamespacesModel'
import {NamespaceService} from '@/services/NamespaceService'

// child components
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import ModalTransactionConfirmation from '@/views/modals/ModalTransactionConfirmation/ModalTransactionConfirmation.vue'

@Component({
  components: {ErrorTooltip, ModalTransactionConfirmation},
  computed: {
    ...mapGetters({
      currentHeight: 'network/currentHeight',
    }),
  },
})
export class FormExtendNamespaceDurationTransactionTs extends FormNamespaceRegistrationTransactionTs {
  @Prop({default: null, required: true}) namespaceId: NamespaceId

  /**
   * Namespace grace period duration
   * @private
   * @type {number}
   */
  private namespaceGracePeriodDuration: number = networkConfig.networks['testnet-publicTest'].properties.namespaceGracePeriodDuration

  /**
   * Network current height
   * @private
   * @type {number}
   */
  private currentHeight: number

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  protected validationRules = ValidationRuleset

  /**
   * Current namespace info
   * @readonly
   * @private
   * @type {NamespaceInfo}
   */
  protected get currentNamespaceEndHeight(): number {
    // @TODO: Should be read from store
    const allNamespaces: NamespacesModel[] = new NamespaceService(this.$store).getNamespaces()
    const currentNamespace = allNamespaces.find(model => model.getIdentifier() === this.namespaceId.toHex())
    return currentNamespace.objects.namespaceInfo.endHeight.compact()
  }

  /**
   * View of the namespace current expiration information
   * @readonly
   * @type {string}
   */
  protected get currentExpirationInfoView(): {expired: boolean, expiration: string} {
    const {expired, expiration} = this.getExpirationInfoFromEndHeight(this.currentNamespaceEndHeight)
    return {expired, expiration}
  }

  /**
   * Namespace new expiration height
   * @readonly
   * @protected
   * @type {number}
   */
  protected get newEndHeight(): number {
    const currentExpirationHeight = this.currentNamespaceEndHeight
    const newExpiration = Number(this.formItems.duration) + currentExpirationHeight
    return isNaN(newExpiration) ? currentExpirationHeight : newExpiration
  }

  /**
   * New namespace duration
   * @readonly
   * @protected
   * @type {number}
   */
  protected get newDuration(): number {
    return this.newEndHeight - this.currentHeight - this.namespaceGracePeriodDuration
  }

  /**
   * View of the new current expiration information
   * @readonly
   * @type {string}
   */
  protected get newExpirationInfoView(): string {
    const {expiration} = this.getExpirationInfoFromEndHeight(
      this.newEndHeight,
    )
    return expiration
  }

  // @TODO: duplicate with NamespaceTableService method
  /**
   * Returns a view of a namespace expiration info
   * @private
   * @param {NamespaceInfo} mosaicInfo
   * @returns {string}
   */
  private getExpirationInfoFromEndHeight(
    endHeight: number,
  ): {expiration: string, expired: boolean} {
    const {currentHeight} = this
    const networkConfig = this.$store.getters['network/config']
    const {namespaceGracePeriodDuration} = networkConfig.networks['testnet-publicTest']

    const expired = currentHeight > endHeight - namespaceGracePeriodDuration
    const expiredIn = endHeight - namespaceGracePeriodDuration - currentHeight
    const deletedIn = endHeight - currentHeight
    const expiration = expired
      ? TimeHelpers.durationToRelativeTime(expiredIn)
      : TimeHelpers.durationToRelativeTime(deletedIn)

    return {expired, expiration}
  }
}
