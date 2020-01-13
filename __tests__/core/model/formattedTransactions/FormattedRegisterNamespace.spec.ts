import {FormattedRegisterNamespace} from '@/core/model/formattedTransactions/FormattedRegisterNamespace.ts'
import {Deadline, NetworkType, UInt64, NamespaceId, NamespaceRegistrationTransaction} from 'nem2-sdk'
import {mockNetworkCurrency} from '@MOCKS/conf/networkCurrency'
import {MultisigWallet} from '@MOCKS/conf'
import {AppWallet} from '@/core/model'

const unsignedRegisterNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
  Deadline.create(),
  'root-test-namespace',
  UInt64.fromUint(1000),
  NetworkType.MIJIN_TEST,
)

const unsignedRegisterSubNamespaceTransaction = NamespaceRegistrationTransaction.createSubNamespace(
  Deadline.create(),
  'root-test-namespace',
  new NamespaceId([ 929036875, 2226345261 ]),
  NetworkType.MIJIN_TEST,
)

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

describe('FormattedRegisterNamespace', () => {
  it('should render an unsigned transaction data (root namespace)', () => {
    const formattedTransaction = new FormattedRegisterNamespace(
      unsignedRegisterNamespaceTransaction,
      // @ts-ignore
      mockStore,
      undefined,
    )

    expect(formattedTransaction.dialogDetailMap).toEqual({
      self: 'SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T',
      transaction_type: 'register_namespace',
      namespace_name: 'root-test-namespace (root)',
      root_namespace: '-',
      sender: 'F96D892CD86878A6714CEC06B86F7A0848A0BA9A73DE8F6C77E5F20C026620DF',
      duration: '1,000',
      fee: '0',
      Rental_fee: '1',
    })
  })

  it('should render an unsigned transaction data (sub namespace)', () => {
    const formattedTransaction = new FormattedRegisterNamespace(
      unsignedRegisterSubNamespaceTransaction,
      // @ts-ignore
      mockStore,
      undefined,
    )

    expect(formattedTransaction.dialogDetailMap).toEqual({
      self: 'SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T',
      transaction_type: 'register_namespace',
      namespace_name: 'root-test-namespace (sub)',
      root_namespace: '84B3552D375FFA4B',
      sender: 'F96D892CD86878A6714CEC06B86F7A0848A0BA9A73DE8F6C77E5F20C026620DF',
      duration: 0,
      fee: '0',
      Rental_fee: '0',
    })
  })
})
