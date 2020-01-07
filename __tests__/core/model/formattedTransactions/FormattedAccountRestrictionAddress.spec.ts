import {FormattedAccountRestrictionAddress} from '@/core/model/formattedTransactions/FormattedAccountRestrictionAddress.ts'
import {Deadline, NetworkType, AccountRestrictionTransaction, AccountRestrictionFlags, Address} from 'nem2-sdk';
import {mockNetworkCurrency} from '@MOCKS/conf/networkCurrency'
import {MultisigWallet} from '@MOCKS/conf'
import {AppWallet} from '@/core/model';

const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
const unsignedAddressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
    Deadline.create(),
    AccountRestrictionFlags.AllowOutgoingAddress,
    [address],
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
describe('FormattedAccountRestrictionAddress', () => {
    it('should render an unsigned transaction data', () => {
        const formattedTransaction = new FormattedAccountRestrictionAddress(
            unsignedAddressRestrictionTransaction,
            // @ts-ignore
            mockStore,
            undefined,
        )

        expect(formattedTransaction.dialogDetailMap).toEqual({
            self: 'SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T',
            transaction_type: 'account_restriction_address',
            fee: 0,
            block: undefined,
            hash: undefined,
        })
    })
})
