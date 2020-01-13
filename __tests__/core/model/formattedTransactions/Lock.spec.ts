import {FormattedLock} from '@/core/model/formattedTransactions/FormattedLock.ts'
import {Deadline, NetworkType, AggregateTransaction, HashLockTransaction, NetworkCurrencyMosaic, UInt64} from 'nem2-sdk'
import {mockNetworkCurrency} from '@MOCKS/conf/networkCurrency'
import {MultisigWallet, MultisigAccount} from '@MOCKS/conf'
import {AppWallet} from '@/core/model'

const generationHash = '8472FA74A64A97C85F0A285299D9FD2D44D71CB5698FE9C7E88C33001F9DD83F'

const aggregateTransaction = AggregateTransaction.createBonded(
  Deadline.create(),
  [],
  NetworkType.MIJIN_TEST,
  [],
)

const signedTransaction = MultisigAccount.sign(aggregateTransaction, generationHash)
const unsignedLockTransaction = HashLockTransaction.create(Deadline.create(),
  NetworkCurrencyMosaic.createRelative(10),
  UInt64.fromUint(10),
  signedTransaction,
  NetworkType.MIJIN_TEST)

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
}

describe('FormattedLock', () => {
  it('should render an unsigned transaction data', () => {
    const formattedTransaction = new FormattedLock(
      unsignedLockTransaction,
      // @ts-ignore
      mockStore,
      undefined,
    )

    expect(formattedTransaction.dialogDetailMap).toEqual({
      self: 'SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T',
      transaction_type: 'lock',
      fee: 0,
      hash: undefined,
      duration_blocks: 10,
      mosaics: [NetworkCurrencyMosaic.createRelative(10)],
    })
  })
})
