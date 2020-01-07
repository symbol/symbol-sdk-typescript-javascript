import {FormattedAccountRestrictionMosaic} from '@/core/model/formattedTransactions/FormattedAccountRestrictionMosaic.ts'
import {Deadline, NetworkType, AccountRestrictionTransaction, AccountRestrictionFlags, MosaicId} from 'nem2-sdk';
import {mockNetworkCurrency} from '@MOCKS/conf/networkCurrency'
import {MultisigWallet} from '@MOCKS/conf'
import {AppWallet} from '@/core/model';

const mosaicId = new MosaicId([2262289484, 3405110546]);
const unsignedAccountRestrictionTransaction = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
    Deadline.create(),
    AccountRestrictionFlags.AllowMosaic,
    [mosaicId],
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
describe('FormattedAccountRestrictionMosaic', () => {
    it('should render an unsigned transaction data', () => {
        const formattedTransaction = new FormattedAccountRestrictionMosaic(
            unsignedAccountRestrictionTransaction,
            // @ts-ignore
            mockStore,
            undefined,
        )

        expect(formattedTransaction.dialogDetailMap).toEqual({
            self: 'SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T',
            block: undefined,
            fee: 0,
            hash: undefined,
            transaction_type: 'account_restriction_mosaic'
        })
    })
})
