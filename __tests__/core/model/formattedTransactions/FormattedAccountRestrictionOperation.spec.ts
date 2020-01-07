import {FormattedAccountRestrictionOperation} from '@/core/model/formattedTransactions/FormattedAccountRestrictionOperation.ts'
import {Deadline, NetworkType, AccountRestrictionTransaction, AccountRestrictionFlags, TransactionType} from 'nem2-sdk';
import {mockNetworkCurrency} from '@MOCKS/conf/networkCurrency'
import {MultisigWallet} from '@MOCKS/conf'
import {AppWallet} from '@/core/model';

const operation = TransactionType.ADDRESS_ALIAS;
let unsignedAccountRestrictionOperation = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
    Deadline.create(),
    AccountRestrictionFlags.AllowOutgoingTransactionType,
    [operation],
    [],
    NetworkType.MIJIN_TEST,
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
describe('FormattedAccountRestrictionOperation', () => {
    it('should render an unsigned transaction data', () => {
        const formattedTransaction = new FormattedAccountRestrictionOperation(
            unsignedAccountRestrictionOperation,
            // @ts-ignore
            mockStore,
            undefined,
        )

        expect(formattedTransaction.dialogDetailMap).toEqual({
            self: 'SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T',
            transaction_type: 'account_restriction_operation',
            fee: 0,
            block: undefined,
            hash: undefined,
        })
    })
})
