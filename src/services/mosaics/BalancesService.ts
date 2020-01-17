import {MosaicAmountView, AccountInfo, Mosaic} from 'nem2-sdk'
import {Balances, AppWallet, AppState} from '@/core/model'
import {Store} from 'vuex'
import {absoluteAmountToRelativeAmount} from '@/core/utils'

export class BalancesService {
  static getFromAccountsInfo(accountsInfo: AccountInfo[]): Record<string, Balances> {
    return accountsInfo
      .map(({address, mosaics}) => ({
        address: address.plain(),
        hexAndAmountMap: BalancesService.getFromMosaics(mosaics),
      }))
      .reduce((acc, {address, hexAndAmountMap}) => ({...acc, [address]: hexAndAmountMap}), {})
  }

  static getFromMosaics(mosaics: Mosaic[]): Balances {
    return mosaics
      .map(({id, amount}) => ({
        hex: id.toHex(),
        amount: amount.compact(),
      }))
      .reduce((acc, {hex, amount}) => (acc = {...acc, [hex]: amount}), {})
  }

  static getFromMosaicAmountViews(mosaics: MosaicAmountView[]): Balances {
    return mosaics
      .map(({mosaicInfo, amount}) => ({
        hex: mosaicInfo.id.toHex(),
        amount: amount.compact(),
      }))
      .reduce((acc, {hex, amount}) => (acc = {...acc, [hex]: amount}), {})
  }

  static getBalanceFromAddress(appWallet: AppWallet, store: Store<AppState>): string {
    const {address} = appWallet
    const {networkCurrency} = store.state.account

    const balances = store.state.account.balances[address]
    if (!balances) return '0'

    const balance = balances[networkCurrency.hex]
    return balance ? absoluteAmountToRelativeAmount(balance, networkCurrency) : '0'
  }
}
