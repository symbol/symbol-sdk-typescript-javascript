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
import {TransactionType} from 'nem2-sdk'

// @ts-ignore
import seedImg from '@/views/resources/img/login/seed.png'
// @ts-ignore
import trezorImg from '@/views/resources/img/login/trezor.png'
// @ts-ignore
import ledgerImg from '@/views/resources/img/login/ledger.png'
// @ts-ignore
import importStepImage1 from '@/views/resources/img/login/1_4.png'
// @ts-ignore
import importStepImage2 from '@/views/resources/img/login/2_4.png'
// @ts-ignore
import importStepImage3 from '@/views/resources/img/login/3_4.png'
// @ts-ignore
import importStepImage4 from '@/views/resources/img/login/4_4.png'
// @ts-ignore
import createStepImage1 from '@/views/resources/img/login/1_5.png'
// @ts-ignore
import createStepImage2 from '@/views/resources/img/login/2_5.png'
// @ts-ignore
import createStepImage3 from '@/views/resources/img/login/3_5.png'
// @ts-ignore
import createStepImage4 from '@/views/resources/img/login/4_5.png'
// @ts-ignore
import createStepImage5 from '@/views/resources/img/login/5_5.png'
// @ts-ignore
import dashboardUnconfirmed from '@/views/resources/img/monitor/dash-board/dashboardUnconfirmed.png'
// @ts-ignore
import dashboardConfirmed from '@/views/resources/img/monitor/dash-board/dashboardConfirmed.png'
// @ts-ignore
import windowDashboard from '@/views/resources/img/window/windowDashboard.png'
// @ts-ignore
import windowDashboardActive from '@/views/resources/img/window/windowDashboardActive.png'
// @ts-ignore
import windowWallet from '@/views/resources/img/window/windowWallet.png'
// @ts-ignore
import windowWalletActive from '@/views/resources/img/window/windowWalletActive.png'
// @ts-ignore
import windowMosaic from '@/views/resources/img/window/windowMosaic.png'
// @ts-ignore
import windowMosaicActive from '@/views/resources/img/window/windowMosaicActive.png'
// @ts-ignore
import windowNamespace from '@/views/resources/img/window/windowNamespace.png'
// @ts-ignore
import windowNamespaceActive from '@/views/resources/img/window/windowNamespaceActive.png'
// @ts-ignore
import windowMultisig from '@/views/resources/img/window/windowMultisig.png'
// @ts-ignore
import windowMultisigActive from '@/views/resources/img/window/windowMultisigActive.png'
// @ts-ignore
import windowCommunity from '@/views/resources/img/window/windowCommunity.png'
// @ts-ignore
import windowCommunityActive from '@/views/resources/img/window/windowCommunityActive.png'
// @ts-ignore
import windowSetting from '@/views/resources/img/window/windowSetting.png'
// @ts-ignore
import windowSettingActive from '@/views/resources/img/window/windowSettingActive.png'
// @ts-ignore
import dashboardAggregate from '@/views/resources/img/monitor/dash-board/dashboardAggregate.png'
// @ts-ignore
import dashboardMultisig from '@/views/resources/img/monitor/dash-board/dashboardMultisig.png'
// @ts-ignore
import dashboardOther from '@/views/resources/img/monitor/dash-board/dashboardOther.png'
// @ts-ignore
import transferSent from '@/views/resources/img/monitor/dash-board/dashboardMosaicOut.png'
// @ts-ignore
import transferReceived from '@/views/resources/img/monitor/dash-board/dashboardMosaicIn.png'
// @ts-ignore
import selected from '@/views/resources/img/monitor/mosaics/selected.png'
// @ts-ignore
import unselected from '@/views/resources/img/monitor/mosaics/unselected.png'

/// region exported image objects
export const walletTypeImages = {
  seedImg,
  trezorImg,
  ledgerImg,
}

export const importStepImage = {
  importStepImage1,
  importStepImage2,
  importStepImage3,
  importStepImage4,
}

export const createStepImage = {
  createStepImage1,
  createStepImage2,
  createStepImage3,
  createStepImage4,
  createStepImage5,
}

export const dashboardImages = {
  dashboardUnconfirmed,
  dashboardConfirmed,
  selected,
  unselected,
}

export const leftBarIcons = {
  windowDashboard,
  windowDashboardActive,
  windowWallet,
  windowWalletActive,
  windowMosaic,
  windowMosaicActive,
  windowNamespace,
  windowNamespaceActive,
  windowMultisig,
  windowMultisigActive,
  windowCommunity,
  windowCommunityActive,
  windowSetting,
  windowSettingActive,
}

export const transferIcons = {
  transferReceived,
  transferSent,
}

export const transactionTypeToIcon = {
  [TransactionType.NAMESPACE_REGISTRATION] : dashboardOther,
  [TransactionType.ADDRESS_ALIAS] : dashboardOther,
  [TransactionType.MOSAIC_ALIAS] : dashboardOther,
  [TransactionType.MOSAIC_DEFINITION] : dashboardOther,
  [TransactionType.MOSAIC_SUPPLY_CHANGE] : dashboardOther,
  [TransactionType.MULTISIG_ACCOUNT_MODIFICATION] : dashboardMultisig,
  [TransactionType.AGGREGATE_COMPLETE] : dashboardAggregate,
  [TransactionType.AGGREGATE_BONDED] : dashboardAggregate,
  [TransactionType.HASH_LOCK] : dashboardOther,
  [TransactionType.SECRET_LOCK] : dashboardOther,
  [TransactionType.SECRET_PROOF] : dashboardOther,
  [TransactionType.ACCOUNT_ADDRESS_RESTRICTION] : dashboardOther,
  [TransactionType.ACCOUNT_MOSAIC_RESTRICTION] : dashboardOther,
  [TransactionType.ACCOUNT_OPERATION_RESTRICTION] : dashboardOther,
  [TransactionType.ACCOUNT_LINK] : dashboardOther,
  [TransactionType.MOSAIC_ADDRESS_RESTRICTION] : dashboardOther,
  [TransactionType.MOSAIC_GLOBAL_RESTRICTION] : dashboardOther,
  [TransactionType.ACCOUNT_METADATA] : dashboardOther,
  [TransactionType.MOSAIC_METADATA] : dashboardOther,
  [TransactionType.NAMESPACE_METADATA] : dashboardOther,
}
/// end-region exported image objects
