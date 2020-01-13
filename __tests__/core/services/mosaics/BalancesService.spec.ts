import {BalancesService} from '@/core/services/mosaics/BalancesService.ts'
import {Address, Mosaic, MosaicId, UInt64} from 'nem2-sdk'
import {networkCurrency, hdAccount} from '@MOCKS/index'
import {AppWallet} from '@/core/model'

const appWallet = AppWallet.createFromDTO(hdAccount.wallets[0])

const mosaicIds = [
  new MosaicId([ 557850352, 1974403924 ]),
  new MosaicId([ 2908020011, 220799016 ]),
]

const mosaic = new Mosaic(
  mosaicIds[0],
  UInt64.fromUint(1),
)

const mosaics = [
  new Mosaic(
    mosaicIds[1],
    UInt64.fromUint(2),
  ),
  new Mosaic(
    mosaicIds[0],
    UInt64.fromUint(3),
  ),
]

const mockAccountsInfo = [
  {
    address: Address.createFromRawAddress('TAHCTKJCVZLZGLGWUCQC3AMCEVWDE6JKYMKK2ANC'),
    mosaics: [mosaic],
  },
  {
    address: Address.createFromRawAddress(appWallet.address),
    mosaics: mosaics,
  },
]

const mockMosaicAmountViews = [
  {
    mosaicInfo: {id: mosaicIds[0]},
    amount: UInt64.fromUint(1),
  },
  {
    mosaicInfo: {id: mosaicIds[1]},
    amount: UInt64.fromUint(2),
  },
]

const mockStoreBalances = {
  TAHCTKJCVZLZGLGWUCQC3AMCEVWDE6JKYMKK2ANC: {
    '75AF035421401EF0': 1,
  },
  [appWallet.address]: {
    '0D292028AD54DD2B': 2,
    '75AF035421401EF0': 3,
  },
}

describe('BalancesService', () => {
  it('getFromAccountsInfo should return a map of accounts and Balances', () => {
    // @ts-ignore
    const balancesMap = BalancesService.getFromAccountsInfo(mockAccountsInfo)
    expect(balancesMap).toEqual(mockStoreBalances)
  })

  it('getFromMosaicAmountViews should return a Balances object', () => {
    // @ts-ignore
    const balances = BalancesService.getFromMosaicAmountViews(mockMosaicAmountViews)
    expect(balances).toEqual({
      '75AF035421401EF0': 1,
      '0D292028AD54DD2B': 2,
    })
  })

  it('getBalanceFromAddress should return a wallet\'s mosaic from the store', () => {
    const mockStore = {
      state: {
        account: {
          networkCurrency,
          balances: mockStoreBalances,
        },
      },
    }

    // @ts-ignore
    const balances = BalancesService.getBalanceFromAddress(appWallet, mockStore)
    expect(balances).toEqual('0.000003')
  })

  it('getBalanceFromAddress should return "0" if a wallet balance is not found in the store', () => {
    const mockStore = {
      state: {
        account: {
          networkCurrency,
          balances: {},
        },
      },
    }

    // @ts-ignore
    const balances = BalancesService.getBalanceFromAddress(appWallet, mockStore)
    expect(balances).toEqual('0')
  })

  it('getBalanceFromAddress should return "0" if a wallet has no network currency', () => {
    const mockStore = {
      state: {
        account: {
          networkCurrency,
          balances: {'0D292028AD54DD2B': 2},
        },
      },
    }
    
    // @ts-ignore
    const balances = BalancesService.getBalanceFromAddress(appWallet, mockStore)
    expect(balances).toEqual('0')
  })
})
