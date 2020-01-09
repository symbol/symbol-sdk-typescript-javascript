import {RemoteAccountService} from '@/core/services/harvesting/RemoteAccountService.ts'
import {CosignAccount, CosignAccountRemoteMijinTest, CosignAccountRemoteTestNet, hdAccount} from '@MOCKS/index'
import {NetworkType, Password, SimpleWallet, Address, AccountType, Deadline, UInt64, TransferTransaction} from 'nem2-sdk'
import {AppWallet, CreateWalletType} from '@/core/model'
import {of} from 'rxjs'
import {map, tap} from 'rxjs/operators'
import flushPromises from 'flush-promises'
const password = new Password('password1')

const mijinPrivateKeyWallet = AppWallet.createFromDTO({
  name: 'pkeyWallet',
  simpleWallet: SimpleWallet.createFromPrivateKey(
    'pkeyWallet', password, CosignAccount.privateKey, NetworkType.MIJIN_TEST,
  ),
  networkType: NetworkType.MIJIN_TEST,
  sourceType: CreateWalletType.privateKey,
})

const testNetPrivateKeyWallet = AppWallet.createFromDTO({
  name: 'pkeyWallet',
  simpleWallet: SimpleWallet.createFromPrivateKey(
    'pkeyWallet', password, CosignAccount.privateKey, NetworkType.TEST_NET,
  ),
  networkType: NetworkType.TEST_NET,
  sourceType: CreateWalletType.privateKey,
})

const trezorWallet = AppWallet.createFromDTO({
  name: 'pkeyWallet',
  simpleWallet: SimpleWallet.createFromPrivateKey(
    'pkeyWallet', password, CosignAccount.privateKey, NetworkType.TEST_NET,
  ),
  networkType: NetworkType.TEST_NET,
  sourceType: CreateWalletType.trezor,
})


const noSourceWallet = AppWallet.createFromDTO({
  name: 'pkeyWallet',
  simpleWallet: SimpleWallet.createFromPrivateKey(
    'pkeyWallet', password, CosignAccount.privateKey, NetworkType.TEST_NET,
  ),
  networkType: NetworkType.TEST_NET,
  sourceType: null,
})


const mockGetAccountsInfoCall = jest.fn()
const hdAccountWallet1 = AppWallet.createFromDTO(hdAccount.wallets[0])
const hdAccountWallet1PublicKey1 = '8D1D84DCD42528BE9913BC05CDB016AE602DF6AF016EFBCBA0CE8D1DA5A7D6DE'
const hdAccountWallet1PublicKey2 = 'C555CD059C6B70144907A11D065201E3785BADEF1D6022E811C1A846F37E6A02'
const hdAccountWallet1PublicKey3 = '4002F5594B15DB81BA1BB305771D2AF00B951F16432D323E10524F27E2A6549B'
const hdAccountWallet1PublicKey4 = '1B93C316A88A2EEBF4633B35F5E54526567640D2B57B587AB62F0F55E5389DA9'
const hdAccountWallet1Address1 = Address.createFromPublicKey(hdAccountWallet1PublicKey1, NetworkType.MIJIN_TEST)
const hdAccountWallet1Address2 = Address.createFromPublicKey(hdAccountWallet1PublicKey2, NetworkType.MIJIN_TEST)
const hdAccountWallet1Address3 = Address.createFromPublicKey(hdAccountWallet1PublicKey3, NetworkType.MIJIN_TEST)
const hdAccountWallet1Address4 = Address.createFromPublicKey(hdAccountWallet1PublicKey4, NetworkType.MIJIN_TEST)


const hdAccountWallet2 = AppWallet.createFromDTO(hdAccount.wallets[1])
const hdAccountWallet2PublicKey1 = '87881C952F2041A2F0F03CB52058EEBC16FB1551FE7E5F96FFE15C56A9845483'
const hdAccountWallet2PublicKey2 = '3A2228F609054E161D423383DFEADB1EFD1735667213BAF2314B7F0D3A09938A'
const hdAccountWallet2PublicKey3 = '531B86DD76DAB98BB8010699FBC5A1412077573203BDE8DA468A6CF5F7EA3863'
const hdAccountWallet2PublicKey4 = 'AB710B0A9F9C45A45FF6AC8CAF3DAB7DF25AB22DBB3BA3A7E091521C533B9698'
const hdAccountWallet2Address1 = Address.createFromPublicKey(hdAccountWallet2PublicKey1, NetworkType.MIJIN_TEST)
const hdAccountWallet2Address2 = Address.createFromPublicKey(hdAccountWallet2PublicKey2, NetworkType.MIJIN_TEST)
const hdAccountWallet2Address3 = Address.createFromPublicKey(hdAccountWallet2PublicKey3, NetworkType.MIJIN_TEST)
const hdAccountWallet2Address4 = Address.createFromPublicKey(hdAccountWallet2PublicKey4, NetworkType.MIJIN_TEST)


const mockGetAccountsInfo = (args) => of(args).pipe(
  tap(mockGetAccountsInfoCall),
  map((args: Address[]) => {
    if (args[0].plain() === hdAccountWallet1Address1.plain()) {
      return [{
        address: hdAccountWallet1Address1,
        accountType: AccountType.Main
      }]
    }

    if (args[0].plain() === hdAccountWallet2Address1.plain()) {
      return [{
        address: hdAccountWallet2Address1,
        accountType: AccountType.Main
      }]
    }

    if (args[0].plain() === hdAccountWallet2Address2.plain()) {
      return [
        {
          address: hdAccountWallet2Address2,
          accountType: AccountType.Main
        },
        {
          address: hdAccountWallet2Address3,
          accountType: AccountType.Main
        },
        {
          address: hdAccountWallet2Address4,
          accountType: AccountType.Remote_Unlinked
        },
      ]
    }

    return []
  }),
)

jest.mock('nem2-sdk/dist/src/infrastructure/AccountHttp', () => ({
  AccountHttp: jest.fn().mockImplementation(() => {
    return {
      getAccountsInfo: mockGetAccountsInfo,
    }
  })
}))


describe('generateRemoteAccountFromPrivateKey', () => {
  it('should return the correct account, on MIJIN_TEST', () => {
    const account = new RemoteAccountService(mijinPrivateKeyWallet)
      // @ts-ignore
      .getRemoteAccounts(password, 1, 1)

    expect(account[0]).toEqual(CosignAccountRemoteMijinTest)
  })

  it('should return the correct account, on TEST_TEST', () => {
    const account = new RemoteAccountService(testNetPrivateKeyWallet)
      // @ts-ignore
      .getRemoteAccounts(password, 1, 1)

    expect(account[0]).toEqual(CosignAccountRemoteTestNet)
  })
})

const mockStore = {
  state: {
    account: {
      node: 'http://localHost:3000',
    }
  }
}

describe('getAvailableRemotePublicKey', () => {
  beforeEach(() => {
    mockGetAccountsInfoCall.mockClear()
  })

  it('should return the first publicKey if no accountInfo is returned', async (done) => {
    const publicKey = await new RemoteAccountService(mijinPrivateKeyWallet)
      .getAvailableRemotePublicKey(
        password,
        // @ts-ignore
        mockStore,
      )

    await flushPromises()

    expect(publicKey).toBe('6AE08614F9197098D2509C0843A2D9A885DB0ECE1F7813C0B8FEC2298D105232')
    done()
  })

  it('should return the second publicKey if first account is not linkable', async (done) => {
    const publicKey = await new RemoteAccountService(hdAccountWallet1)
      .getAvailableRemotePublicKey(
        new Password('password'),
        // @ts-ignore
        mockStore,
      )

    await flushPromises()
    expect(mockGetAccountsInfoCall).toHaveBeenCalledTimes(2)
    expect(mockGetAccountsInfoCall.mock.calls[0][0]).toEqual([hdAccountWallet1Address1])
    expect(mockGetAccountsInfoCall.mock.calls[1][0][0]).toEqual(hdAccountWallet1Address2)
    expect(mockGetAccountsInfoCall.mock.calls[1][0][1]).toEqual(hdAccountWallet1Address3)
    expect(mockGetAccountsInfoCall.mock.calls[1][0][2]).toEqual(hdAccountWallet1Address4)
    expect(publicKey).toBe(hdAccountWallet1PublicKey2)
    done()
  })

  it('should return the publicKey of an unlinked remote account', async (done) => {
    const publicKey = await new RemoteAccountService(hdAccountWallet2)
      .getAvailableRemotePublicKey(
        new Password('password'),
        // @ts-ignore
        mockStore,
      )

    await flushPromises()
    expect(mockGetAccountsInfoCall).toHaveBeenCalledTimes(2)
    expect(mockGetAccountsInfoCall.mock.calls[0][0]).toEqual([hdAccountWallet2Address1])
    expect(mockGetAccountsInfoCall.mock.calls[1][0][0]).toEqual(hdAccountWallet2Address2)
    expect(mockGetAccountsInfoCall.mock.calls[1][0][1]).toEqual(hdAccountWallet2Address3)
    expect(mockGetAccountsInfoCall.mock.calls[1][0][2]).toEqual(hdAccountWallet2Address4)
    expect(publicKey).toBe(hdAccountWallet2PublicKey4)
    done()
  })

  it('should throw if the wallet source is not supported', async (done) => {
    expect(new RemoteAccountService(trezorWallet)
      .getAvailableRemotePublicKey(
        new Password('password'),
        // @ts-ignore
        mockStore,
      )).rejects.toThrow()

    expect(new RemoteAccountService(noSourceWallet)
      .getAvailableRemotePublicKey(
        new Password('password'),
        // @ts-ignore
        mockStore,
      )).rejects.toThrow()

    done()
  })
})

describe('getPersistentDelegationRequestTransaction', () => {
  it('should return a PersistentDelegationRequestTransaction', async (done) => {
    const walletA = AppWallet.createFromDTO({
      ...hdAccount.wallets[0],
      linkedAccountKey: hdAccountWallet1PublicKey1,
    })

    const transaction = new RemoteAccountService(walletA)
      .getPersistentDelegationRequestTransaction(
        Deadline.create(),
        '5624423FFAEFE11E4D991E9DF820FBDBDFEE577C52E9AAECD49AD5EDD3BDB906',
        UInt64.fromUint(1),
        new Password('password'),
      )
    await flushPromises()
    expect(transaction).toBeInstanceOf(TransferTransaction)
    expect(transaction).toBeInstanceOf(TransferTransaction)
    done()
  })

  it('should throw when the linkedAccountKey does not belong to a default remote account path', () => {
    const walletB = AppWallet.createFromDTO({
      ...hdAccount.wallets[0],
      linkedAccountKey: '5624423FFAEFE11E4D991E9DF820FBDBDFEE577C52E9AAECD49AD5EDD3BDB906',
    })

    expect(() => {
      new RemoteAccountService(walletB).getPersistentDelegationRequestTransaction(
        Deadline.create(),
        '5624423FFAEFE11E4D991E9DF820FBDBDFEE577C52E9AAECD49AD5EDD3BDB906',
        UInt64.fromUint(1),
        new Password('password'),
      )
    }).toThrow()
  })
})