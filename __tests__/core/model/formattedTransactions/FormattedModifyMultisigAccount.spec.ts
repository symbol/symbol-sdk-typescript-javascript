import {FormattedModifyMultisigAccount} from '@/core/model/formattedTransactions/FormattedModifyMultisigAccount.ts'
import {Deadline, NetworkType, MultisigAccountModificationTransaction, PublicAccount} from 'nem2-sdk'
import {mockNetworkCurrency} from '@MOCKS/conf/networkCurrency'
import {MultisigWallet} from '@MOCKS/conf'
import {AppWallet, CosignatoryModifications} from '@/core/model'

const unsignedModifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
  Deadline.create(),
  2,
  1,
  [ PublicAccount.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24',
    NetworkType.MIJIN_TEST),
  PublicAccount.createFromPublicKey('B1B5581FC81A6970DEE418D2C2978F2724228B7B36C5C6DF71B0162BB04778B4',
    NetworkType.MIJIN_TEST),
  ],
  [],
  NetworkType.MIJIN_TEST,
)

const mockGetTimeFromBlockNumber = jest.fn()
const mockNetworkProperties = {
  getTimeFromBlockNumber: (...args) => mockGetTimeFromBlockNumber(args),
}

const mockStore = {
  state: {
    account: {
      networkCurrency: mockNetworkCurrency,
      wallet: AppWallet.createFromDTO(MultisigWallet),
    },
    app: {
      networkProperties: mockNetworkProperties,
    },
  },
}

describe('FormattedModifyMultisigAccount', () => {
  it('should render an unsigned transaction data', () => {
    const formattedTransaction = new FormattedModifyMultisigAccount(
      unsignedModifyMultisigAccountTransaction,
      // @ts-ignore
      mockStore,
      undefined,
    )

    expect(formattedTransaction.dialogDetailMap).toEqual({
      self: 'SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T',
      transaction_type: 'modify_multisig_account',
      fee: 0,
      block: undefined,
      hash: undefined,
      minApprovalDelta: 2,
      maxRemovalDelta: 1,
      cosignatories: CosignatoryModifications
        .createFromMultisigAccountModificationTransaction(unsignedModifyMultisigAccountTransaction),
    })
  })
})
