import {FormattedMosaicAddressRestriction} from '@/core/model/formattedTransactions/FormattedMosaicAddressRestriction.ts'
import {Deadline, NetworkType, UInt64, MosaicId, MosaicAddressRestrictionTransaction} from 'nem2-sdk';
import {mockNetworkCurrency} from '@MOCKS/conf/networkCurrency'
import {MultisigWallet, MultisigAccount} from '@MOCKS/conf'
import {AppWallet} from '@/core/model';

const mosaicId = new MosaicId([2262289484, 3405110546]);
const unsignedMosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
    Deadline.create(),
    mosaicId,
    UInt64.fromUint(1),
    MultisigAccount.address,
    UInt64.fromUint(8),
    NetworkType.MIJIN_TEST,
    UInt64.fromUint(9),
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
            networkProperties: mockNetworkProperties,
        }
    }
}

describe('FormattedMosaicAddressRestriction', () => {
    it('should render an unsigned transaction data', () => {
        const formattedTransaction = new FormattedMosaicAddressRestriction(
            unsignedMosaicAddressRestrictionTransaction,
            // @ts-ignore
            mockStore,
            undefined,
        )

        expect(formattedTransaction.dialogDetailMap).toEqual({
            self: 'SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T',
            transaction_type: 'mosaic_address_restriction',
            fee: 0,
            block: undefined,
            hash: undefined,
        })
    })
})
