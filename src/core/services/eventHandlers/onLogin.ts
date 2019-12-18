import {Store} from 'vuex'
import {localRead, localSave} from '@/core/utils'
import {AppState, AppWallet, CurrentAccount} from '@/core/model'

// @TODO: Most of the methods here should be implemented in AppAccount and AppWallet

const persistAccountName = (accountName: string) => {
  localSave('activeAccountName', accountName)
}

const getAccountDataFromStorage = (accountName: string): any[] => {
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

const getAccountWallets = (accountData: any): AppWallet[] => {
  const {wallets} = accountData
  if (!wallets) throw new Error(`No wallets found in the localStorage for ${accountData.name}`)
  return wallets.map(wallet => new AppWallet(wallet))
}

const setValuesInLocalStorage = (accountName: string, store: Store<AppState>) => {
  const accountDataFromStorage = getAccountDataFromStorage(accountName) 
  const wallets = getAccountWallets(accountDataFromStorage)
  store.commit('SET_WALLET_LIST', wallets)
  store.commit('SET_WALLET', wallets[0])

  store.commit(
    'SET_ACCOUNT_DATA',
    // @ts-ignore
    new CurrentAccount(accountName, accountDataFromStorage.password, accountDataFromStorage.networkType),
  )
}

export const onLogin = (accountName: string, store: Store<AppState>) => {
  persistAccountName(accountName)
  setValuesInLocalStorage(accountName, store)
}