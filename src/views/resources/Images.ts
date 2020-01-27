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
import seedImg from '@/../public/img/login/seed.png'
// @ts-ignore
import trezorImg from '@/../public/img/login/trezor.png'
// @ts-ignore
import ledgerImg from '@/../public/img/login/ledger.png'
// @ts-ignore
import importStepImage1 from '@/../public/img/login/1_4.png'
// @ts-ignore
import importStepImage2 from '@/../public/img/login/2_4.png'
// @ts-ignore
import importStepImage3 from '@/../public/img/login/3_4.png'
// @ts-ignore
import importStepImage4 from '@/../public/img/login/4_4.png'
// @ts-ignore
import createStepImage1 from '@/../public/img/login/1_5.png'
// @ts-ignore
import createStepImage2 from '@/../public/img/login/2_5.png'
// @ts-ignore
import createStepImage3 from '@/../public/img/login/3_5.png'
// @ts-ignore
import createStepImage4 from '@/../public/img/login/4_5.png'
// @ts-ignore
import createStepImage5 from '@/../public/img/login/5_5.png'
// @ts-ignore
import dashboardUnconfirmed from ' @/../public/img/monitor/dash-board/dashboardUnconfirmed.png'
// @ts-ignore
import dashboardConfirmed from ' @/../public/img/monitor/dash-board/dashboardConfirmed.png'
// @ts-ignore
import windowDashboard from '@/../public/img/window/windowDashboard.png'
// @ts-ignore
import windowDashboardActive from '@/../public/img/window/windowDashboardActive.png'
// @ts-ignore
import windowWallet from '@/../public/img/window/windowWallet.png'
// @ts-ignore
import windowWalletActive from '@/../public/img/window/windowWalletActive.png'
// @ts-ignore
import windowMosaic from '@/../public/img/window/windowMosaic.png'
// @ts-ignore
import windowMosaicActive from '@/../public/img/window/windowMosaicActive.png'
// @ts-ignore
import windowNamespace from '@/../public/img/window/windowNamespace.png'
// @ts-ignore
import windowNamespaceActive from '@/../public/img/window/windowNamespaceActive.png'
// @ts-ignore
import windowMultisig from '@/../public/img/window/windowMultisig.png'
// @ts-ignore
import windowMultisigActive from '@/../public/img/window/windowMultisigActive.png'
// @ts-ignore
import windowCommunity from '@/../public/img/window/windowCommunity.png'
// @ts-ignore
import windowCommunityActive from '@/../public/img/window/windowCommunityActive.png'
// @ts-ignore
import windowSetting from '@/../public/img/window/windowSetting.png'
// @ts-ignore
import windowSettingActive from '@/../public/img/window/windowSettingActive.png'
// @ts-ignore
import dashboardAggregate from '@/../public/img/monitor/dash-board/dashboardAggregate.png'
// @ts-ignore
import dashboardMultisig from '@/../public/img/monitor/dash-board/dashboardMultisig.png'
// @ts-ignore
import dashboardOther from '@/../public/img/monitor/dash-board/dashboardOther.png'
// @ts-ignore
import transferSent from '@/../public/img/monitor/dash-board/dashboardMosaicOut.png'
// @ts-ignore
import transferReceived from '@/../public/img/monitor/dash-board/dashboardMosaicIn.png'

/// region exported image objects
export const walletTypeImage = {
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
  [TransactionType.REGISTER_NAMESPACE] : dashboardOther,
  [TransactionType.ADDRESS_ALIAS] : dashboardOther,
  [TransactionType.MOSAIC_ALIAS] : dashboardOther,
  [TransactionType.MOSAIC_DEFINITION] : dashboardOther,
  [TransactionType.MOSAIC_SUPPLY_CHANGE] : dashboardOther,
  [TransactionType.MODIFY_MULTISIG_ACCOUNT] : dashboardMultisig,
  [TransactionType.AGGREGATE_COMPLETE] : dashboardAggregate,
  [TransactionType.AGGREGATE_BONDED] : dashboardAggregate,
  [TransactionType.LOCK] : dashboardOther,
  [TransactionType.SECRET_LOCK] : dashboardOther,
  [TransactionType.SECRET_PROOF] : dashboardOther,
  [TransactionType.ACCOUNT_RESTRICTION_ADDRESS] : dashboardOther,
  [TransactionType.ACCOUNT_RESTRICTION_MOSAIC] : dashboardOther,
  [TransactionType.ACCOUNT_RESTRICTION_OPERATION] : dashboardOther,
  [TransactionType.LINK_ACCOUNT] : dashboardOther,
  [TransactionType.MOSAIC_ADDRESS_RESTRICTION] : dashboardOther,
  [TransactionType.MOSAIC_GLOBAL_RESTRICTION] : dashboardOther,
  [TransactionType.ACCOUNT_METADATA_TRANSACTION] : dashboardOther,
  [TransactionType.MOSAIC_METADATA_TRANSACTION] : dashboardOther,
  [TransactionType.NAMESPACE_METADATA_TRANSACTION] : dashboardOther,
}
/// end-region exported image objects
