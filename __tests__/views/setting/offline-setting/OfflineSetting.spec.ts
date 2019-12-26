import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import OfflineSetting from '@/views/setting/offline-setting/OfflineSetting.vue'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import flushPromises from 'flush-promises'
import i18n from '@/language/index.ts'
import {hdAccount, mockNetworkCurrency} from "@MOCKS/index"
import {AppWallet, NetworkProperties} from "@/core/model"
import {localRead} from "@/core/utils"
import {explorerLinkList} from "@/config"
// @ts-ignore
const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(iView)
localVue.use(Vuex)
localVue.use(VeeValidate, veeValidateConfig)
localVue.use(VueRx)
// close warning
config.logModifiedComponents = false

describe('OfflineSetting', () => {
    let store
    let wrapper
    let state
    beforeEach(() => {
        store = new Vuex.Store({
                modules: {
                    account: {
                        state: Object.assign(accountState.state, {
                            // @ts-ignore
                            wallet: new AppWallet(hdAccount.wallets[0]),
                            node: 'http://initial.endpoint',
                            networkCurrency: mockNetworkCurrency,
                            generationHash: 'initialGenerationHash'
                        }),
                        mutations: accountMutations.mutations,
                    },
                    app: {
                        state: Object.assign(appState.state),
                        mutations: appMutations.mutations
                    }
                }
            }
        )
        
        store.state.app.NetworkProperties = NetworkProperties.create(store)
        store.state.app.NetworkProperties.height = 666
        store.state.app.NetworkProperties.generationHash = 'initialGenerationHash'

        wrapper = shallowMount(OfflineSetting, {
            sync: false,
            mocks: {
                $t: (msg) => msg,
            },
            i18n,
            localVue,
            store,
            router,
        })
    })

    it('OfflineSetting should render with appropriate default values', async (done) => {
        expect(wrapper.vm.$store.state.account.node).toBe('http://initial.endpoint')
        expect(wrapper.vm.generationHash).toBe('initialGenerationHash')
        expect(wrapper.vm.networkCurrency).toStrictEqual(mockNetworkCurrency)
        wrapper.vm.submit()
        await flushPromises()
        expect(wrapper.vm.$store.state.account.node).toBe('http://initial.endpoint')
        expect(wrapper.vm.$store.state.app.NetworkProperties.generationHash).toBe('initialGenerationHash')
        expect(wrapper.vm.$store.state.account.networkCurrency).toStrictEqual(mockNetworkCurrency)
        done()
    })

    it('OfflineSetting should update store settings properly', async (done) => {
        expect(wrapper.vm.$store.state.account.node).toBe('http://initial.endpoint')
        expect(wrapper.vm.generationHash).toBe('initialGenerationHash')
        expect(wrapper.vm.networkCurrency).toStrictEqual(mockNetworkCurrency)
        const newGenerationHash = '30CA0A8179477777AB3407611405EAAE6C4BA12156035E4DF8A73BD7651D6D9C'
        const newNetworkCurrency = {
            hex: '308F144790CD7BC4',
            divisibility: 3,
            ticker: 'XIM',
            name: 'nom.xom',
        }
        wrapper.setData({
            generationHash: newGenerationHash,
            networkCurrency: newNetworkCurrency,
        })

        wrapper.vm.submit()
        await flushPromises()
        expect(wrapper.vm.$store.state.account.node).toBe('http://initial.endpoint')
        expect(wrapper.vm.$store.state.app.NetworkProperties.generationHash).toBe(newGenerationHash)
        expect(wrapper.vm.$store.state.account.networkCurrency).toStrictEqual(newNetworkCurrency)
        done()
    })

    it('OfflineSetting should not update store settings if generationHash is invalid', async (done) => {
        expect(wrapper.vm.$store.state.account.node).toBe('http://initial.endpoint')
        expect(wrapper.vm.generationHash).toBe('initialGenerationHash')
        expect(wrapper.vm.networkCurrency).toStrictEqual(mockNetworkCurrency)
        const invalidGenerationHash = 'invalidGenerationHash'
        const newNetworkCurrency = {
            hex: '308F144790CD7BC4',
            divisibility: 3,
            ticker: 'XIM',
            name: 'nom.xom',
        }
        wrapper.setData({
            generationHash: invalidGenerationHash,
            networkCurrency: newNetworkCurrency,
        })

        wrapper.vm.submit()
        await flushPromises()
        expect(wrapper.vm.$store.state.account.node).toBe('http://initial.endpoint')
        expect(wrapper.vm.$store.state.app.NetworkProperties.generationHash).toBe('initialGenerationHash')
        expect(wrapper.vm.$store.state.account.networkCurrency).toStrictEqual(mockNetworkCurrency)
        done()
    })

    it('OfflineSetting should not update store settings if hex is invalid', async (done) => {
        expect(wrapper.vm.$store.state.account.node).toBe('http://initial.endpoint')
        expect(wrapper.vm.generationHash).toBe('initialGenerationHash')
        expect(wrapper.vm.networkCurrency).toStrictEqual(mockNetworkCurrency)
        const newGenerationHash = '30CA0A8179477777AB3407611405EAAE6C4BA12156035E4DF8A73BD7651D6D9C'
        const invalidNetworkCurrency = {
            hex: 'notAValidHex',
            divisibility: 3,
            ticker: 'XIM',
            name: 'nom.xom',
        }
        wrapper.setData({
            generationHash: newGenerationHash,
            networkCurrency: invalidNetworkCurrency,
        })

        wrapper.vm.submit()
        await flushPromises()
        expect(wrapper.vm.$store.state.account.node).toBe('http://initial.endpoint')
        expect(wrapper.vm.$store.state.app.NetworkProperties.generationHash).toBe('initialGenerationHash')
        expect(wrapper.vm.$store.state.account.networkCurrency).toStrictEqual(mockNetworkCurrency)
        done()
    })
})
