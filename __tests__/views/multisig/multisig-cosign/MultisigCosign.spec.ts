import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import MultisigCosign from '@/views/multisig/multisig-cosign/MultisigCosign.vue'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import {FEE_SPEEDS} from "@/config"
import flushPromises from 'flush-promises'
import {
    Address, Deadline,
    Mosaic,
    AggregateTransaction,
    MosaicId,
    NetworkType,
    TransactionType,
    TransferTransaction,
    UInt64
} from "nem2-sdk"
import {
    CosignAccount,
    mosaicsLoading,
    multisigAccountInfo,
    mosaics,
    MultisigAccount,
    Multisig2Account,
    CosignWallet
    // @ts-ignore
} from "@@/mock/conf/conf.spec"
import {AppWallet} from "@/core/model"
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

describe('MultisigCosign', () => {
    let store
    let wrapper
    let state
    beforeEach(() => {
            store = store = new Vuex.Store({
                    modules: {
                        account: {
                            state: Object.assign(accountState.state, {
                                wallet: CosignWallet,
                                mosaics,
                                multisigAccountInfo
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
            wrapper = shallowMount(MultisigCosign, {
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

    it('Component MultisigCosign is not null ', () => {
        expect(wrapper).not.toBeNull()
    })
})
