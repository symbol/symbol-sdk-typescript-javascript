import {FormattedAddressAlias} from '@/core/model/formattedTransactions/FormattedAddressAlias.ts'
import {Deadline, NetworkType, AddressAliasTransaction, NamespaceId, Address, AliasAction} from 'nem2-sdk';
import {mockNetworkCurrency} from '@MOCKS/conf/networkCurrency'
import {MultisigWallet} from '@MOCKS/conf'
import {AppWallet} from '@/core/model';

const namespaceId = new NamespaceId([33347626, 3779697293]);
const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
const unsignedAddressAliasTransaction = AddressAliasTransaction.create(
    Deadline.create(),
    AliasAction.Link,
    namespaceId,
    address,
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

describe('FormattedAddressAlias', () => {
    it('should render an unsigned transaction data', () => {
        const formattedTransaction = new FormattedAddressAlias(
            unsignedAddressAliasTransaction,
            // @ts-ignore
            mockStore,
            undefined,
        )

        expect(formattedTransaction.dialogDetailMap).toEqual({
            self: 'SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T',
            transaction_type: 'address_alias',
            fee: 0,
            block: undefined,
            hash: undefined,
            action: 'Link',
            address: 'SBILTA-367K2L-X2FEXG-5TFWAS-7GEFYA-GY7QLF-BYKC',
            namespace: 'E1499A8D01FCD82A',
        })
    })
})
