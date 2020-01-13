import {TransactionFormatter} from '@/core/services/transactions/TransactionFormatter.ts'
import {AppWallet} from '@/core/model/AppWallet'
import {MultisigWallet, mockNetworkCurrency} from '@MOCKS/conf'
import {
  NamespaceRegistrationTransaction, Deadline, UInt64, NetworkType,
  TransferTransaction, Address, PlainMessage, NetworkCurrencyMosaic,
  MosaicId, NamespaceId, MosaicAliasTransaction, AliasAction,
} from 'nem2-sdk'
import {
  FormattedRegisterNamespace, FormattedTransfer, FormattedMosaicAlias,
  TransactionCategories, TransactionStatusGroups,
} from '@/core/model'

const mockCommit = jest.fn()

const mockGetTimeFromBlockNumber = jest.fn()
const mockNetworkProperties = {
  getTimeFromBlockNumber: (...args) => mockGetTimeFromBlockNumber(args),
}

const mockStore = {
  state: {
    account: {
      networkCurrency: mockNetworkCurrency,
      wallet: AppWallet.createFromDTO(MultisigWallet),
    },
    app: {
      networkProperties: mockNetworkProperties,
    },
  },
  commit: mockCommit,
}

const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
  Deadline.create(),
  'root-test-namespace',
  UInt64.fromUint(1000),
  NetworkType.MIJIN_TEST,
)

const transferTransaction1 = TransferTransaction.create(
  Deadline.create(),
  Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
  [],
  PlainMessage.create('test-message'),
  NetworkType.MIJIN_TEST,
  new UInt64([ 1, 0 ]),
)

const transferTransaction2 = TransferTransaction.create(
  Deadline.create(),
  Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
  [
    NetworkCurrencyMosaic.createRelative(100),
  ],
  PlainMessage.create('test-message'),
  NetworkType.MIJIN_TEST,
)

const mosaicId = new MosaicId([ 2262289484, 3405110546 ])
const namespaceId = new NamespaceId([ 33347626, 3779697293 ])
const mosaicAliasTransaction = MosaicAliasTransaction.create(
  Deadline.create(),
  AliasAction.Link,
  namespaceId,
  mosaicId,
  NetworkType.MIJIN_TEST,
  new UInt64([ 1, 0 ]),
)

describe('TransactionFormatter', () => {
  beforeEach(() => {
    mockCommit.mockClear()
  })

  it('when no options is provided, SET_TRANSACTION_LIST should be called', () => {
  // @ts-ignore 
    TransactionFormatter.create(mockStore).formatAndSaveTransactions([
      registerNamespaceTransaction,
      transferTransaction1,
      transferTransaction2,
      mosaicAliasTransaction,
    ])

    expect(mockCommit.mock.calls[0][0]).toBe('SET_TRANSACTION_LIST')
    expect(mockCommit.mock.calls[0][1][0]).toBeInstanceOf(FormattedRegisterNamespace)
    expect(mockCommit.mock.calls[0][1][1]).toBeInstanceOf(FormattedTransfer)
    expect(mockCommit.mock.calls[0][1][2]).toBeInstanceOf(FormattedTransfer)
    expect(mockCommit.mock.calls[0][1][3]).toBeInstanceOf(FormattedMosaicAlias)
  })

  it('should call SET_TRANSACTIONS_TO_COSIGN', () => {
  // @ts-ignore 
    TransactionFormatter.create(mockStore).formatAndSaveTransactions([
      registerNamespaceTransaction,
      transferTransaction1,
      transferTransaction2,
      mosaicAliasTransaction,
    ], {transactionCategory: TransactionCategories.TO_COSIGN})

    expect(mockCommit.mock.calls[0][0]).toBe('SET_TRANSACTIONS_TO_COSIGN')
    expect(mockCommit.mock.calls[0][1][0]).toBeInstanceOf(FormattedRegisterNamespace)
    expect(mockCommit.mock.calls[0][1][1]).toBeInstanceOf(FormattedTransfer)
    expect(mockCommit.mock.calls[0][1][2]).toBeInstanceOf(FormattedTransfer)
    expect(mockCommit.mock.calls[0][1][3]).toBeInstanceOf(FormattedMosaicAlias)
  })

  it('should call SET_UNCONFIRMED_TRANSACTION_LIST', () => {
  // @ts-ignore 
    TransactionFormatter.create(mockStore).formatAndSaveTransactions([
      registerNamespaceTransaction,
      transferTransaction1,
      transferTransaction2,
      mosaicAliasTransaction,
    ], {transactionStatusGroup: TransactionStatusGroups.unconfirmed})

    expect(mockCommit.mock.calls[0][0]).toBe('SET_UNCONFIRMED_TRANSACTION_LIST')
    expect(mockCommit.mock.calls[0][1][0]).toBeInstanceOf(FormattedRegisterNamespace)
    expect(mockCommit.mock.calls[0][1][1]).toBeInstanceOf(FormattedTransfer)
    expect(mockCommit.mock.calls[0][1][2]).toBeInstanceOf(FormattedTransfer)
    expect(mockCommit.mock.calls[0][1][3]).toBeInstanceOf(FormattedMosaicAlias)
  })

  it('should call ADD_CONFIRMED_TRANSACTION when no option is provided', () => {
  // @ts-ignore 
    TransactionFormatter.create(mockStore).formatAndSaveNewTransaction(
      registerNamespaceTransaction)

    expect(mockCommit.mock.calls[0][0]).toBe('ADD_CONFIRMED_TRANSACTION')
    expect(mockCommit.mock.calls[0][1]).toBeInstanceOf(FormattedRegisterNamespace)
  })

  it('should call ADD_UNCONFIRMED_TRANSACTION', () => {
  // @ts-ignore 
    TransactionFormatter.create(mockStore).formatAndSaveNewTransaction(
      registerNamespaceTransaction,
      {transactionStatusGroup: TransactionStatusGroups.unconfirmed})

    expect(mockCommit.mock.calls[0][0]).toBe('ADD_UNCONFIRMED_TRANSACTION')
    expect(mockCommit.mock.calls[0][1]).toBeInstanceOf(FormattedRegisterNamespace)
  })
})
