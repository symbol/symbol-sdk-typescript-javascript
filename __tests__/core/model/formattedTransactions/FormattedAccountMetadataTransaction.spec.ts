import {FormattedAccountMetadataTransaction} from '@/core/model/formattedTransactions/FormattedAccountMetadataTransaction.ts'
import {Deadline, NetworkType, UInt64, AccountMetadataTransaction, Convert} from 'nem2-sdk';
import {mockNetworkCurrency} from '@MOCKS/conf/networkCurrency'
import {MultisigWallet} from '@MOCKS/conf'
import {AppWallet} from '@/core/model';

const unsignedAccountMetadataTransaction = AccountMetadataTransaction.create(
    Deadline.create(),
    MultisigWallet.publicKey,
    UInt64.fromUint(1000),
    1,
    Convert.uint8ToUtf8(new Uint8Array(10)),
    NetworkType.MIJIN_TEST,
    new UInt64([1, 0]),
);

const mockGetTimeFromBlockNumber = jest.fn()
const mockNetworkProperties = {
    getTimeFromBlockNumber: (...args) => mockGetTimeFromBlockNumber(args)
}

const mockStore = {
    state: {
        account: {
            networkCurrency: mockNetworkCurrency,
            wallet: AppWallet.createFromDTO(MultisigWallet)
        },
        app: {
            networkProperties: mockNetworkProperties
        }
    }
}
describe('FormattedAccountMetadataTransaction', () => {
    it('should render an unsigned transaction data', () => {
        const formattedTransaction = new FormattedAccountMetadataTransaction(
            unsignedAccountMetadataTransaction,
            // @ts-ignore
            mockStore,
            undefined,
        )

        expect(formattedTransaction.dialogDetailMap).toEqual({
            self: 'SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T',
            transaction_type: 'account_metadata_transaction',
            fee: 0.000001,
            block: undefined,
            hash: undefined,
        })
    })
})
