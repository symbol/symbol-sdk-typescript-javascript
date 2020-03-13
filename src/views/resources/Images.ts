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
import {TransactionType} from 'symbol-sdk'

// @ts-ignore
import createImg from '@/views/resources/img/login/create.png'
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
import selected from '@/views/resources/img/monitor/mosaics/selected.png'
// @ts-ignore
import unselected from '@/views/resources/img/monitor/mosaics/unselected.png'

// official icons

// @ts-ignore
import accountRestrictionAlt from '@/views/resources/img/icons/account-restriction-alt.png'
// @ts-ignore
import accountRestriction from '@/views/resources/img/icons/account-restriction.png'
// @ts-ignore
import addAccount from '@/views/resources/img/icons/add-account.png'
// @ts-ignore
import addAggregate from '@/views/resources/img/icons/add-aggregate.png'
// @ts-ignore
import aggregate from '@/views/resources/img/icons/aggregate.png'
// @ts-ignore
import aggregateTransaction from '@/views/resources/img/icons/aggregate-transaction.png'
// @ts-ignore
import alias from '@/views/resources/img/icons/alias.png'
// @ts-ignore
import apiNode from '@/views/resources/img/icons/api-node.png'
// @ts-ignore
import blockchainBlock from '@/views/resources/img/icons/blockchain-block.png'
// @ts-ignore
import blockchain from '@/views/resources/img/icons/blockchain.png'
// @ts-ignore
import block from '@/views/resources/img/icons/block.png'
// @ts-ignore
import blocks from '@/views/resources/img/icons/blocks.png'
// @ts-ignore
import blockTime from '@/views/resources/img/icons/block-time.png'
// @ts-ignore
import card from '@/views/resources/img/icons/card.png'
// @ts-ignore
import certificate from '@/views/resources/img/icons/certificate.png'
// @ts-ignore
import checkMark from '@/views/resources/img/icons/check-mark.png'
// @ts-ignore
import confirmed from '@/views/resources/img/icons/confirmed.png'
// @ts-ignore
import crossChain from '@/views/resources/img/icons/cross-chain.png'
// @ts-ignore
import cryptography from '@/views/resources/img/icons/cryptography.png'
// @ts-ignore
import customerAlice from '@/views/resources/img/icons/customer-alice.png'
// @ts-ignore
import customerBob from '@/views/resources/img/icons/customer-bob.png'
// @ts-ignore
import customerCharlie from '@/views/resources/img/icons/customer-charlie.png'
// @ts-ignore
import dashboard from '@/views/resources/img/icons/dashboard.png'
// @ts-ignore
import delegatedHarvesting from '@/views/resources/img/icons/delegated-harvesting.png'
// @ts-ignore
import encryptedMessage from '@/views/resources/img/icons/encrypted-message.png'
// @ts-ignore
import enterprise from '@/views/resources/img/icons/enterprise.png'
// @ts-ignore
import explorer from '@/views/resources/img/icons/explorer.png'
// @ts-ignore
import fingerprint from '@/views/resources/img/icons/fingerprint.png'
// @ts-ignore
import harvest from '@/views/resources/img/icons/harvest.png'
// @ts-ignore
import incoming from '@/views/resources/img/icons/incoming.png'
// @ts-ignore
import lock from '@/views/resources/img/icons/lock.png'
// @ts-ignore
import message from '@/views/resources/img/icons/message.png'
// @ts-ignore
import metadata from '@/views/resources/img/icons/metadata.png'
// @ts-ignore
import mosaic from '@/views/resources/img/icons/mosaic.png'
// @ts-ignore
import mosaicRestriction from '@/views/resources/img/icons/mosaic-restriction.png'
// @ts-ignore
import multipleParties from '@/views/resources/img/icons/multiple-parties.png'
// @ts-ignore
import multisig from '@/views/resources/img/icons/multisig.png'
// @ts-ignore
import namespace from '@/views/resources/img/icons/namespace.png'
// @ts-ignore
import nem2Cli from '@/views/resources/img/icons/nem2-cli.png'
// @ts-ignore
import nem2Sdk from '@/views/resources/img/icons/nem2-sdk.png'
// @ts-ignore
import news from '@/views/resources/img/icons/news.png'
// @ts-ignore
import nodeReputation from '@/views/resources/img/icons/node-reputation.png'
// @ts-ignore
import nodes from '@/views/resources/img/icons/nodes.png'
// @ts-ignore
import notMultisig from '@/views/resources/img/icons/not-multisig.png'
// @ts-ignore
import outgoing from '@/views/resources/img/icons/outgoing.png'
// @ts-ignore
import pending from '@/views/resources/img/icons/pending.png'
// @ts-ignore
import privateChain from '@/views/resources/img/icons/private-chain.png'
// @ts-ignore
import privateKey from '@/views/resources/img/icons/private-key.png'
// @ts-ignore
import publicChain from '@/views/resources/img/icons/public-chain.png'
// @ts-ignore
import publicKey from '@/views/resources/img/icons/public-key.png'
// @ts-ignore
import publicPrivateKey from '@/views/resources/img/icons/public-private-key.png'
// @ts-ignore
import qr from '@/views/resources/img/icons/qr.png'
// @ts-ignore
import receive from '@/views/resources/img/icons/receive.png'
// @ts-ignore
import send from '@/views/resources/img/icons/send.png'
// @ts-ignore
import sent from '@/views/resources/img/icons/sent.png'
// @ts-ignore
import settings from '@/views/resources/img/icons/settings.png'
// @ts-ignore
import signatureRequired from '@/views/resources/img/icons/signature-required.png'
// @ts-ignore
import signCosign from '@/views/resources/img/icons/sign-cosign.png'
// @ts-ignore
import spamThrottle from '@/views/resources/img/icons/spam-throttle.png'
// @ts-ignore
import statistics from '@/views/resources/img/icons/statistics.png'
// @ts-ignore
import transactions from '@/views/resources/img/icons/transactions.png'
// @ts-ignore
import transfer from '@/views/resources/img/icons/transfer.png'
// @ts-ignore
import transferTransactions from '@/views/resources/img/icons/transfer-transactions.png'
// @ts-ignore
import unlock from '@/views/resources/img/icons/unlock.png'
// @ts-ignore
import wallet from '@/views/resources/img/icons/wallet.png'
// @ts-ignore
import xymCoin from '@/views/resources/img/icons/xym-coin.png'

/// region exported image objects
export const walletTypeImages = {
  createImg,
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

// icons provided by the marketing agency
export const officialIcons = {
  accountRestrictionAlt,
  accountRestriction,
  addAccount,
  addAggregate,
  aggregate,
  aggregateTransaction,
  alias,
  apiNode,
  blockchainBlock,
  blockchain,
  block,
  blocks,
  blockTime,
  card,
  certificate,
  checkMark,
  confirmed,
  crossChain,
  cryptography,
  customerAlice,
  customerBob,
  customerCharlie,
  dashboard,
  delegatedHarvesting,
  encryptedMessage,
  enterprise,
  explorer,
  fingerprint,
  harvest,
  incoming,
  lock,
  message,
  metadata,
  mosaic,
  mosaicRestriction,
  multipleParties,
  multisig,
  namespace,
  nem2Cli,
  nem2Sdk,
  news,
  nodeReputation,
  nodes,
  notMultisig,
  outgoing,
  pending,
  privateChain,
  privateKey,
  publicChain,
  publicKey,
  publicPrivateKey,
  qr,
  receive,
  send,
  sent,
  settings,
  signatureRequired,
  signCosign,
  spamThrottle,
  statistics,
  transactions,
  transfer,
  transferTransactions,
  unlock,
  wallet,
  xymCoin,
}

export const transactionTypeToIcon = {
  [TransactionType.NAMESPACE_REGISTRATION] : officialIcons.namespace,
  [TransactionType.ADDRESS_ALIAS] : officialIcons.alias,
  [TransactionType.MOSAIC_ALIAS] : officialIcons.namespace,
  [TransactionType.MOSAIC_DEFINITION] : officialIcons.mosaic,
  [TransactionType.MOSAIC_SUPPLY_CHANGE] : officialIcons.mosaic,
  [TransactionType.MULTISIG_ACCOUNT_MODIFICATION] : officialIcons.multipleParties,
  [TransactionType.AGGREGATE_COMPLETE] : officialIcons.aggregateTransaction,
  [TransactionType.AGGREGATE_BONDED] : officialIcons.aggregateTransaction,
  [TransactionType.HASH_LOCK] : officialIcons.lock,
  [TransactionType.SECRET_LOCK] : officialIcons.lock,
  [TransactionType.SECRET_PROOF] : officialIcons.lock,
  [TransactionType.ACCOUNT_ADDRESS_RESTRICTION] : officialIcons.accountRestriction,
  [TransactionType.ACCOUNT_MOSAIC_RESTRICTION] : officialIcons.mosaicRestriction,
  [TransactionType.ACCOUNT_OPERATION_RESTRICTION] : officialIcons.accountRestrictionAlt,
  [TransactionType.ACCOUNT_LINK] : officialIcons.publicChain,
  [TransactionType.MOSAIC_ADDRESS_RESTRICTION] : officialIcons.mosaicRestriction,
  [TransactionType.MOSAIC_GLOBAL_RESTRICTION] : officialIcons.mosaicRestriction,
  [TransactionType.ACCOUNT_METADATA] : officialIcons.metadata,
  [TransactionType.MOSAIC_METADATA] : officialIcons.metadata,
  [TransactionType.NAMESPACE_METADATA] : officialIcons.metadata,
}

/// end-region exported image objects
