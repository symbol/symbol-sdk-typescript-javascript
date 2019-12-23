import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import NumberFormatting from '@/components/number-formatting/NumberFormatting.vue'
import {veeValidateConfig} from "@/core/validation"
import VueRx from "vue-rx"

// @ts-ignore
const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(iView)
localVue.use(Vuex)
localVue.use(VeeValidate, veeValidateConfig)
localVue.use(VueRx)
localVue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})
// close warning
config.logModifiedComponents = false

describe('NumberFormatting', () => {
  let store
  let wrapper
  let state
  beforeEach(() => {
      wrapper = shallowMount(NumberFormatting, {
        sync: false,
        localVue,
      })
    }
  )

  it('NumberFormatting should render correctly ', () => {
    expect(wrapper).not.toBeNull()
  })

  it('NumberFormatting format 1.2345 correctly', () => {
    wrapper.setProps({
      numberOfFormatting: '1.2345'
    })
    expect(wrapper.vm.pointIndex).toBe(1)
    expect(wrapper.vm.integer).toBe('1')
    expect(wrapper.vm.decimals).toBe('.2345')
  })

  it('NumberFormatting format 0 correctly', () => {
    wrapper.setProps({
      numberOfFormatting: 0
    })
    expect(wrapper.vm.pointIndex).toBe(1)
    expect(wrapper.vm.integer).toBe('0')
    expect(wrapper.vm.decimals).toBe('')
  })
  it('NumberFormatting format 123,456 correctly', () => {
    wrapper.setProps({
      numberOfFormatting: 123456
    })
    expect(wrapper.vm.pointIndex).toBe(6)
    expect(wrapper.vm.integer).toBe('123456')
    expect(wrapper.vm.decimals).toBe('')
  })

})
