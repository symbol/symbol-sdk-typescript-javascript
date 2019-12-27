import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import FinishCreate from '@/views/login/create-account/finish-create/FinishCreate.vue'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import {NetworkType, Password} from 'nem2-sdk'
import {AppWallet} from '@/core/model'
import VueRx from "vue-rx"
import {
    mosaicsLoading,
    multisigAccountInfo,
    mosaics,
    CosignWallet
} from "@MOCKS/index"
// @ts-ignore
const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(iView)
localVue.use(Vuex)
localVue.use(VeeValidate, veeValidateConfig)
localVue.use(VueRx)
localVue.directive('focus', {
    inserted: function (el, binding) {
        el.focus()
    }
})
// close warning
config.logModifiedComponents = false

const mockCreateFromMnemonicCall = jest.fn()
jest.mock('@/core/model/AppWallet', () => ({
    AppWallet: jest.fn().mockImplementation((...args) => ({
        createFromMnemonic: (...args) => mockCreateFromMnemonicCall(args),
    }))
}))

const mockLocalSave = jest.fn()
jest.mock('@/core/utils/utils', (...args) => ({
    localSave: (...args) => mockLocalSave(args),
    localRead: x => x,
}))


const expectedMnemonic = "mirror reject rookie talk pudding throw happy era myth already payment own sentence push head sting video explain letter bomb casual hotel rather garment"

describe('FinishCreate', () => {
    let store
    let wrapper
    let state
    beforeEach(() => {
        mockLocalSave.mockClear()
        mockCreateFromMnemonicCall.mockClear()

        store = store = new Vuex.Store({
            modules: {
                account: {
                    state: Object.assign(accountState.state, {
                        wallet: CosignWallet,
                        mosaics,
                        multisigAccountInfo,
                        currentAccount: {
                            networkType: NetworkType.TEST_NET,
                            name: 'current account name',
                        },
                        temporaryLoginInfo: {
                            password: 'password',
                            mnemonic: expectedMnemonic,
                        },
                    }),
                    mutations: accountMutations.mutations
                },
                app: {
                    state: Object.assign(appState.state, {mosaicsLoading}),
                    mutations: appMutations.mutations
                }
            }
        }
        )
        wrapper = shallowMount(FinishCreate, {
            sync: false,
            mocks: {
                $t: (msg) => msg,
            },
            localVue,
            store,
            router,
        })
    }
    )

    it('Clicking submit should create an AppWallet and commit REMOVE_TEMPORARY_LOGIN_INFO', () => {
        const mockCommit = jest.fn()
        wrapper.vm.submit()
        expect(AppWallet).toHaveBeenCalledTimes(1)
        expect(mockCreateFromMnemonicCall.mock.calls[0][0]).toStrictEqual([
         'SeedWallet',
         new Password('password'),
         expectedMnemonic,
         NetworkType.TEST_NET,
         wrapper.vm.$store,
        ])
        expect(mockLocalSave.mock.calls[0][0]).toEqual([
         'activeAccountName', 'current account name',
        ])
        expect(store.state.account.temporaryLoginInfo).toStrictEqual({
            password: null,
            mnemonic: null,
        })
    })
})
