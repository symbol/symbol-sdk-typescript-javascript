import {FormattedMosaicMetadataTransaction} from '@/core/model/formattedTransactions/FormattedMosaicMetadataTransaction.ts'
import {Deadline, NetworkType, UInt64, MosaicId, MosaicMetadataTransaction, Convert} from 'nem2-sdk'
import {mockNetworkCurrency} from '@MOCKS/conf/networkCurrency'
import {MultisigWallet, MultisigAccount} from '@MOCKS/conf'
import {AppWallet} from '@/core/model'

const unsignedMosaicMetadataTransaction = MosaicMetadataTransaction.create(
  Deadline.create(),
  MultisigAccount.publicKey,
  UInt64.fromUint(1000),
  new MosaicId([ 2262289484, 3405110546 ]),
  1,
  Convert.uint8ToUtf8(new Uint8Array(10)),
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

describe('FormattedMosaicMetadataTransaction', () => {
  it('should render an unsigned transaction data', () => {
    const formattedTransaction = new FormattedMosaicMetadataTransaction(
      unsignedMosaicMetadataTransaction,
      // @ts-ignore
      mockStore,
      undefined,
    )

    expect(formattedTransaction.dialogDetailMap).toEqual({
      self: 'SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T',
      transaction_type: 'mosaic_metadata_transaction',
      fee: 0,
      block: undefined,
      hash: undefined,
    })
  })
})
