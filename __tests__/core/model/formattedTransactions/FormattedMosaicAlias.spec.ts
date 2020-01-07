import {FormattedMosaicAlias} from '@/core/model/formattedTransactions/FormattedMosaicAlias.ts'
import {Deadline, NetworkType, UInt64, NamespaceId, MosaicId, MosaicAliasTransaction, AliasAction} from 'nem2-sdk';
import {mockNetworkCurrency} from '@MOCKS/conf/networkCurrency'
import {MultisigWallet} from '@MOCKS/conf'
import {AppWallet} from '@/core/model';

const namespaceId = new NamespaceId([33347626, 3779697293]);
const mosaicId = new MosaicId([2262289484, 3405110546]);
const unsignedMosaicAliasTransaction = MosaicAliasTransaction.create(
    Deadline.create(),
    AliasAction.Link,
    namespaceId,
    mosaicId,
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

describe('FormattedMosaicAlias', () => {
    it('should render an unsigned transaction data', () => {
        const formattedTransaction = new FormattedMosaicAlias(
            unsignedMosaicAliasTransaction,
            // @ts-ignore
            mockStore,
            undefined,
        )

        expect(formattedTransaction.dialogDetailMap).toEqual({
            self: 'SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T',
            transaction_type: 'mosaic_alias',
            fee: 0.000001,
            block: undefined,
            hash: undefined,
            action: 'Link',
            mosaic: 'CAF5DD1286D7CC4C',
            namespace: 'E1499A8D01FCD82A',
        })
    })
})
