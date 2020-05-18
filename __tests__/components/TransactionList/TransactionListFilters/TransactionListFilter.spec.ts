//@ts-ignore
import TransactionListFilters from '@/components/TransactionList/TransactionListFilters/TransactionListFilters.vue'
import { getComponent } from '@MOCKS/Components'
import AccountStore from '@/store/Account'
import TransactionStore from '@/store/Transaction'
let wrapper
let vm
beforeEach(() => {
  wrapper = getComponent(
    TransactionListFilters,
    { account: AccountStore, transaction: TransactionStore },
    { currentAccount: null, signers: [] },
    {},
    {},
  )
  vm = wrapper.vm as TransactionListFilters
})
afterEach(() => {
  wrapper.destroy()
})
describe('TransactionListFilters', () => {
  test("should call the 'account/SET_CURRENT_SIGNER' with publicKey", () => {
    vm.onSignerSelectorChange('123')
    expect(vm.$store.dispatch).toBeCalledWith('account/SET_CURRENT_SIGNER', { publicKey: '123' })
  })
  test("should not call the 'account/SET_CURRENT_SIGNER' without publicKey", () => {
    vm.onSignerSelectorChange()
    expect(vm.$store.dispatch).not.toBeCalled()
  })
})
