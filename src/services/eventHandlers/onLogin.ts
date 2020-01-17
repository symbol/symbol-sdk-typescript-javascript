import {Store} from 'vuex'
import {localSave} from '@/core/utils'
import {localRead} from '@/core/utils/utils'
import {AppState, AppWallet, CurrentAccount} from '@/core/model'

// @TODO: Most of the methods here should be implemented in AppAccount and AppWallet
const persistAccountName = (accountName: string) => {
  localSave('activeAccountName', accountName)
}

const getAccountDataFromStorage = (accountName: string): any => {
  try {
    const accountMap = localRead('accountMap')
    if (accountMap === '') throw new Error('No accountMap found in the localStorage after login')

    const parsedAccountMap = JSON.parse(accountMap)
    const accountData = parsedAccountMap[accountName]
    if (!accountData) throw new Error(`No data found in the localStorage for ${accountName}`)

    return accountData
  } catch (error) {
    throw new Error(error)
  }
}

const getAccountWallets = (accountData: any) => {
  const {wallets} = accountData
  if (!wallets) throw new Error(`No wallets found in the localStorage for ${accountData.name}`)
  return wallets.map(wallet => wallet)
}

const getLastActiveWallet = (accountData: any, wallets: any) => {
  const {activeWalletAddress} = accountData
  if (!activeWalletAddress) return wallets[0]
  const walletFromList = wallets.find(({address}) => address === activeWalletAddress)
  const chosenWallet = walletFromList === undefined ? wallets[0] : walletFromList
  return AppWallet.createFromDTO(chosenWallet)
}

const setValuesInLocalStorage = (accountName: string, store: Store<AppState>) => {
  const accountDataFromStorage = getAccountDataFromStorage(accountName)
  const wallets = getAccountWallets(accountDataFromStorage)
  const lastActiveWallet = getLastActiveWallet(accountDataFromStorage, wallets)

  store.commit(
    'SET_ACCOUNT_DATA',
    // @ts-ignore
    new CurrentAccount(accountName, accountDataFromStorage.password, accountDataFromStorage.networkType),
  )

  store.commit('SET_WALLET_LIST', wallets)
  store.commit('SET_WALLET', lastActiveWallet)
}

export const onLogin = (accountName: string, store: Store<AppState>) => {
  persistAccountName(accountName)
  setValuesInLocalStorage(accountName, store)
  store.dispatch('SET_ACCOUNTS_BALANCES')
}
