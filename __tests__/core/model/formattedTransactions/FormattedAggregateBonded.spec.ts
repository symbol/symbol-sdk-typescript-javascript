import {FormattedAggregateBonded} from '@/core/model/formattedTransactions/FormattedAggregateBonded.ts'
import {Deadline, NetworkType, Address, TransferTransaction, PlainMessage, AggregateTransaction} from 'nem2-sdk';
import {mockNetworkCurrency} from '@MOCKS/conf/networkCurrency'
import {MultisigWallet, MultisigAccount} from '@MOCKS/conf'
import {AppWallet} from '@/core/model';

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
    [],
    PlainMessage.create('test-message'),
    NetworkType.MIJIN_TEST,
);

const unsignedAggregateTransaction = AggregateTransaction.createBonded(
    Deadline.create(),
    [transferTransaction.toAggregate(MultisigAccount.publicAccount)],
    NetworkType.MIJIN_TEST,
    [],
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
            transactionFormatter: {
                formatTransactions: (args) => args,
            },
        }
    }
}

describe('FormattedAggregateBonded', () => {
    it('should render an unsigned transaction data', () => {
        const formattedTransaction = new FormattedAggregateBonded(
            unsignedAggregateTransaction,
            // @ts-ignore
            mockStore,
            undefined,
        )

        expect(formattedTransaction.dialogDetailMap).toEqual({
            self: 'SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T',
            transaction_type: 'aggregate_bonded',
            fee: 0,
            block: undefined,
            hash: undefined,
            cosigned_by: null,
        })

        expect(formattedTransaction.formattedInnerTransactions).toStrictEqual(
            unsignedAggregateTransaction.innerTransactions,
        )
    })
})
