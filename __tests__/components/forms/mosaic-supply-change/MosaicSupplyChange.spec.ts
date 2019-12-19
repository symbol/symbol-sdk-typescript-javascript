import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import MosaicSupplyChange from '@/components/forms/mosaic-supply-change/MosaicSupplyChange.vue'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import {formDataConfig, networkConfig} from "@/config"
import flushPromises from 'flush-promises'
import {
    TransactionType,
} from "nem2-sdk"
import {
    mosaicsLoading,
    multisigAccountInfo,
    mosaics,
    CosignWallet
} from "@MOCKS/index"
import {AppMosaic} from "@/core/model"
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

describe('MosaicSupplyChange', () => {
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
        wrapper = shallowMount(MosaicSupplyChange, {
            sync: false,
            mocks: {
                $t: (msg) => msg,
            },
            localVue,
            store,
            router,
            propsData: {
                // @ts-ignore
                itemMosaic: new AppMosaic(mosaics['308F144790CD7BC4']),
                showMosaicEditDialog: true,
            }
        })
    }
    )

    it('Should render', () => {
        expect(wrapper).not.toBeNull()
    })


    it('should create a mosaic supply change transaction with the default values', async () => {
        wrapper.setData({
            formItems: formDataConfig.mosaicEditForm,
        })
        const signTransactionMock = jest.fn(x => x)
        wrapper.vm.signAndAnnounce = signTransactionMock
        wrapper.vm.submit()
        await flushPromises()
        const [{transaction},] = signTransactionMock.mock.calls[0]

        expect(signTransactionMock).toHaveBeenCalledTimes(1)
        expect(transaction.type).toBe(TransactionType.MOSAIC_SUPPLY_CHANGE)
    })


    it('should not create a mosaic supply change transaction with a wrong delta', async () => {
        wrapper.setData({
            formItems: {
                ...formDataConfig.mosaicEditForm,
                delta: networkConfig.maxMosaicAtomicUnits + 1,
            },
        })
        const signTransactionMock = jest.fn(x => x)
        wrapper.vm.signAndAnnounce = signTransactionMock
        wrapper.vm.submit()
        await flushPromises()

        expect(signTransactionMock).toHaveBeenCalledTimes(0)
    })
})
