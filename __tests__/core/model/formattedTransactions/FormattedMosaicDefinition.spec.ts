import {FormattedMosaicDefinition} from '@/core/model/formattedTransactions/FormattedMosaicDefinition.ts'
import {Deadline, NetworkType, UInt64, MosaicFlags, MosaicId, MosaicDefinitionTransaction, MosaicNonce} from 'nem2-sdk';
import {mockNetworkCurrency} from '@MOCKS/conf/networkCurrency'
import {MultisigWallet} from '@MOCKS/conf'
import {AppWallet} from '@/core/model';


const mosaicId = new MosaicId([2262289484, 3405110546]);
const unsignedMosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
    Deadline.create(),
    new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])),
    mosaicId,
    MosaicFlags.create(true, true, true),
    3,
    UInt64.fromUint(1000),
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
            networkProperties: mockNetworkProperties,
        }
    }
}

describe('FormattedMosaicDefinition', () => {
    it('should render an unsigned transaction data', () => {
        const formattedTransaction = new FormattedMosaicDefinition(
            unsignedMosaicDefinitionTransaction,
            // @ts-ignore
            mockStore,
            undefined,
        )

        expect(formattedTransaction.dialogDetailMap).toEqual({
            self: 'SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T',
            transaction_type: 'mosaic_definition',
            fee: 0.000001,
            block: undefined,
            hash: undefined,
            mosaicId: 'CAF5DD1286D7CC4C',
            supplyMutable: true,
            transferable: true,
            restrictable: true,
        })
    })
})
