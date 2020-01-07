import {FormattedMosaicSupplyChange} from '@/core/model/formattedTransactions/FormattedMosaicSupplyChange.ts'
import {Deadline, NetworkType, UInt64, MosaicId, MosaicSupplyChangeTransaction, MosaicSupplyChangeAction} from 'nem2-sdk';
import {mockNetworkCurrency} from '@MOCKS/conf/networkCurrency'
import {MultisigWallet} from '@MOCKS/conf'
import {AppWallet} from '@/core/model';

const mosaicId = new MosaicId([2262289484, 3405110546]);
const unsignedMosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
    Deadline.create(),
    mosaicId,
    MosaicSupplyChangeAction.Increase,
    UInt64.fromUint(10),
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
            networkProperties: mockNetworkProperties,
        }
    }
}

describe('FormattedMosaicSupplyChange', () => {
    it('should render an unsigned transaction data', () => {
        const formattedTransaction = new FormattedMosaicSupplyChange(
            unsignedMosaicSupplyChangeTransaction,
            // @ts-ignore
            mockStore,
            undefined,
        )

        expect(formattedTransaction.dialogDetailMap).toEqual({
            self: 'SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T',
            transaction_type: 'mosaic_supply_change',
            fee: 0,
            block: undefined,
            hash: undefined,
            mosaicId: 'CAF5DD1286D7CC4C',
            direction: 'Increase',
            delta: '10',
        })
    })
})
