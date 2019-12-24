import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import MenuBar from '@/components/menu-bar/MenuBar.vue'
import iView from 'view-design'
import {accountMutations, accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"
import moment from 'vue-moment'
import i18n from "@/language"
import flushPromises from 'flush-promises'
import {AppWallet, CurrentAccount} from "@/core/model"
import {
    hdAccount,
    // @ts-ignore
} from "@MOCKS/index"
import appStore from '@/store/index.ts'
import {NetworkProperties} from '@/core/model/NetworkProperties.ts'

// @ts-ignore
const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(moment as any)
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
const fullUrl = 'http://1.2.3.4:3000'

describe('MenuBar', () => {
    let store
    let wrapper
    let state
    beforeEach(() => {
        store = store = new Vuex.Store({
            modules: {
                account: {
                    state: Object.assign(accountState.state, {
                        //@ts-ignore
                        wallet: new AppWallet(hdAccount.wallets[0]),
                        currentAccount: new CurrentAccount(null, hdAccount.password, hdAccount.networkType),
                        node: 'http://endpoint.com:3000',
                    }),
                    mutations: accountMutations.mutations
                },
                app: {
                    state: Object.assign(appState.state, {
                        NetworkProperties: NetworkProperties.create(appStore),
                        nodeList: [{
                            value: 'http://endpoint.com:3000',
                            name: 'endpoint',
                            url: 'endpoint.com',
                        }],
                    }),
                    mutations: appMutations.mutations
                }
            }
        }
        )
        wrapper = shallowMount(MenuBar, {
            sync: false,
            mocks: {
                $t: (msg) => msg,
            },
            i18n,
            localVue,
            store,
            router,
        })
    }
    )

    it('menu bar should init correctly', async () => {
        expect(MenuBar).not.toBe(null)
    })

    it('should jump to login page after call accountQuit', () => {
        wrapper.vm.accountQuit()
        expect(wrapper.vm.$route.path).toBe('/login')
    })
    it('should set url correctly while input url is http://1.2.3.4:3000', async () => {
        wrapper.vm.inputNodeValue = fullUrl
        wrapper.vm.submit()
        await flushPromises()
        expect(wrapper.vm.node).toBe(fullUrl)
    })
    it('should set url correctly while input url is 1.2.3.4:3000', async () => {
        wrapper.vm.inputNodeValue = '1.2.3.4:3000'
        wrapper.vm.submit()
        await flushPromises()
        expect(wrapper.vm.node).toBe(fullUrl)
    })
    it('should set url correctly while input url is http://1.2.3.4', async () => {
        wrapper.vm.inputNodeValue = 'http://1.2.3.4'
        wrapper.vm.submit()
        await flushPromises()
        expect(wrapper.vm.node).toBe(fullUrl)
    })
    it('should set url correctly while input url is 1.2.3.4', async () => {
        wrapper.vm.inputNodeValue = '1.2.3.4'
        wrapper.vm.submit()
        await flushPromises()
        expect(wrapper.vm.node).toBe(fullUrl)
    })
    it('should not call switchToNewNode while input url is not correct', async () => {
        const mockSwitchToNewNode = jest.fn()
        wrapper.vm.switchToNewNode = mockSwitchToNewNode
        wrapper.vm.inputNodeValue = 'errorUrl'
        wrapper.vm.submit()
        await flushPromises()
        expect(mockSwitchToNewNode).not.toHaveBeenCalled()
    })

    it('remove node should do nothing when there is only one node in the list', () => {
        wrapper.vm.removeNode('http://endpoint.com')
        const initialNodeList = [...wrapper.vm.nodeList]
        expect(wrapper.vm.nodeList).toEqual(initialNodeList)
    })

    it('remove node should remove a node', async (done) => {
        wrapper.vm.inputNodeValue = 'a.new.endpoint'
        wrapper.vm.submit()
        await flushPromises()
        expect(wrapper.vm.nodeList).toEqual([
            {
                value: 'http://a.new.endpoint:3000',
                name: 'http://a.new.endpoint:3000',
                url: 'http://a.new.endpoint:3000'
            },
            {
                value: 'http://endpoint.com:3000',
                name: 'endpoint',
                url: 'endpoint.com',
            }
        ])
        expect(wrapper.vm.node).toBe('http://a.new.endpoint:3000')

        wrapper.vm.removeNode('http://a.new.endpoint:3000')
        expect(wrapper.vm.nodeList).toEqual([
            {
                value: 'http://endpoint.com:3000',
                name: 'endpoint',
                url: 'endpoint.com',
            }
        ])
        expect(wrapper.vm.node).toBe('http://endpoint.com:3000')

        const initialNodeList = [...wrapper.vm.nodeList]
        expect(wrapper.vm.nodeList).toEqual(initialNodeList)
        done()
    })
})
