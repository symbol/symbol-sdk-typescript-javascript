import {FormattedMosaicGlobalRestriction} from '@/core/model/formattedTransactions/FormattedMosaicGlobalRestriction.ts'
import {Deadline, NetworkType, UInt64, NamespaceId, MosaicId, MosaicRestrictionType, MosaicGlobalRestrictionTransaction} from 'nem2-sdk';
import {mockNetworkCurrency} from '@MOCKS/conf/networkCurrency'
import {MultisigWallet} from '@MOCKS/conf'
import {AppWallet} from '@/core/model';

const referenceMosaicId = new NamespaceId([33347626, 3779697293]);
const mosaicId = new MosaicId([2262289484, 3405110546]);

const unsignedMosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction.create(
    Deadline.create(),
    mosaicId,
    UInt64.fromUint(1),
    UInt64.fromUint(9),
    MosaicRestrictionType.EQ,
    UInt64.fromUint(8),
    MosaicRestrictionType.GE,
    NetworkType.MIJIN_TEST,
    referenceMosaicId,
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

describe('FormattedMosaicGlobalRestriction', () => {
    it('should render an unsigned transaction data', () => {
        const formattedTransaction = new FormattedMosaicGlobalRestriction(
            unsignedMosaicGlobalRestrictionTransaction,
            // @ts-ignore
            mockStore,
            undefined,
        )

        expect(formattedTransaction.dialogDetailMap).toEqual({
            self: 'SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T',
            transaction_type: 'mosaic_global_restriction',
            fee: 0,
            block: undefined,
            hash: undefined,
        })
    })
})
