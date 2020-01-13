import {FormattedLinkAccount} from '@/core/model/formattedTransactions/FormattedLinkAccount.ts'
import {Deadline, NetworkType, AccountLinkTransaction, LinkAction} from 'nem2-sdk'
import {mockNetworkCurrency} from '@MOCKS/conf/networkCurrency'
import {MultisigWallet, MultisigAccount} from '@MOCKS/conf'
import {AppWallet} from '@/core/model'

const unsignedAccountLinkTransaction = AccountLinkTransaction.create(
  Deadline.create(),
  MultisigAccount.publicKey,
  LinkAction.Link,
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

describe('FormattedLinkAccount', () => {
  it('should render an unsigned transaction data', () => {
    const formattedTransaction = new FormattedLinkAccount(
      unsignedAccountLinkTransaction,
      // @ts-ignore
      mockStore,
      undefined,
    )

    expect(formattedTransaction.dialogDetailMap).toEqual({
      self: 'SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T',
      transaction_type: 'link_account',
      fee: 0,
      block: undefined,
      hash: undefined,
      action: 'Link',
      Remote_public_key: 'D483C074437097FC9847169528A9E04F421A7A6E49D293BFB1CD3EC995F8BF37',
    })
  })
})
