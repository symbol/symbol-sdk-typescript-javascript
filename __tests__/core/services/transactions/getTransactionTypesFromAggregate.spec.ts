import {getTransactionTypesFromAggregate} from '@/core/services/transactions/getTransactionTypesFromAggregate.ts'
import {MultisigAccount} from '@MOCKS/conf'
import {AggregateTransaction, NamespaceRegistrationTransaction, Deadline, UInt64, NetworkType, TransferTransaction, Address, PlainMessage, NetworkCurrencyMosaic, MosaicId, MosaicAliasTransaction, AliasAction, NamespaceId, TransactionType} from 'nem2-sdk'

describe('getTransactionTypesFromAggregate', () => {
  it('should return the transaction types contained in an aggregate, without duplicates', async () => {
    const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
      Deadline.create(),
      'root-test-namespace',
      UInt64.fromUint(1000),
      NetworkType.MIJIN_TEST,
    )

    const transferTransaction1 = TransferTransaction.create(
      Deadline.create(),
      Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
      [],
      PlainMessage.create('test-message'),
      NetworkType.MIJIN_TEST,
      new UInt64([ 1, 0 ]),
    )

    const transferTransaction2 = TransferTransaction.create(
      Deadline.create(),
      Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
      [
        NetworkCurrencyMosaic.createRelative(100),
      ],
      PlainMessage.create('test-message'),
      NetworkType.MIJIN_TEST,
    )

    const mosaicId = new MosaicId([ 2262289484, 3405110546 ])
    const namespaceId = new NamespaceId([ 33347626, 3779697293 ])
    const mosaicAliasTransaction = MosaicAliasTransaction.create(
      Deadline.create(),
      AliasAction.Link,
      namespaceId,
      mosaicId,
      NetworkType.MIJIN_TEST,
      new UInt64([ 1, 0 ]),
    )


    const aggregateTransaction = AggregateTransaction.createComplete(
      Deadline.create(),
      [
        registerNamespaceTransaction.toAggregate(MultisigAccount.publicAccount),
        transferTransaction1.toAggregate(MultisigAccount.publicAccount),
        transferTransaction2.toAggregate(MultisigAccount.publicAccount),
        mosaicAliasTransaction.toAggregate(MultisigAccount.publicAccount),
      ],
      NetworkType.MIJIN_TEST,
      [],
    )

    const transactionTypesFromAggregate = getTransactionTypesFromAggregate(aggregateTransaction)

    expect(transactionTypesFromAggregate).toEqual([
      TransactionType.REGISTER_NAMESPACE,
      TransactionType.TRANSFER,
      TransactionType.MOSAIC_ALIAS,
    ])
  })
})
