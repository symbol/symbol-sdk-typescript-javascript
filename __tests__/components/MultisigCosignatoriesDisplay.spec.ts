/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { shallowMount } from '@vue/test-utils'
// @ts-ignore
import MultisigCosignatoriesDisplay from '@/components/MultisigCosignatoriesDisplay/MultisigCosignatoriesDisplay'
import { MultisigAccountInfo, NetworkType, PublicAccount } from 'symbol-sdk'
import i18n from '@/language/index'

const networkType = NetworkType.MAIN_NET
const account1 = PublicAccount.createFromPublicKey(
  'B694186EE4AB0558CA4AFCFDD43B42114AE71094F5A1FC4A913FE9971CACD21D',
  networkType,
)
const account2 = PublicAccount.createFromPublicKey(
  'CF893FFCC47C33E7F68AB1DB56365C156B0736824A0C1E273F9E00B8DF8F01EB',
  networkType,
)
const account3 = PublicAccount.createFromPublicKey(
  'DAB1C38C3E1642494FCCB33138B95E81867B5FB59FC4277A1D53761C8B9F6D14',
  networkType,
)
const account4 = PublicAccount.createFromPublicKey(
  '1674016C27FE2C2EB5DFA73996FA54A183B38AED0AA64F756A3918BAF08E061B',
  networkType,
)
const multisigInfo = new MultisigAccountInfo(account1, 1, 1, [account2, account3], [])

describe('MultisigCosignatoriesDisplay', () => {
  test('Getters should return correct values when no modifications', () => {
    const wrapper = shallowMount(MultisigCosignatoriesDisplay, {
      i18n,
      propsData: {
        multisig: multisigInfo,
        modifiable: true,
        cosignatoryModifications: {},
      },
    })

    const component = wrapper.vm as MultisigCosignatoriesDisplay

    expect(component.addModifications).toEqual([])
    expect(component.removeModifications).toEqual([])
    expect(component.cosignatories).toEqual([
      { publicKey: account2.publicKey, address: account2.address.pretty() },
      { publicKey: account3.publicKey, address: account3.address.pretty() },
    ])

    wrapper.destroy()
  })

  test('Getters should return correct values when there are modifications', () => {
    const wrapper = shallowMount(MultisigCosignatoriesDisplay, {
      i18n,
      propsData: {
        multisig: multisigInfo,
        modifiable: true,
        cosignatoryModifications: {
          [account4.publicKey]: { cosignatory: account4, addOrRemove: 'add' },
          [account3.publicKey]: { cosignatory: account3, addOrRemove: 'remove' },
        },
      },
    })

    const component = wrapper.vm as MultisigCosignatoriesDisplay

    expect(component.addModifications).toEqual([{ publicKey: account4.publicKey, address: account4.address.pretty() }])
    expect(component.removeModifications).toEqual([
      { publicKey: account3.publicKey, address: account3.address.pretty() },
    ])
    expect(component.cosignatories).toEqual([{ publicKey: account2.publicKey, address: account2.address.pretty() }])

    wrapper.destroy()
  })

  test('Should dispatch an error when adding a cosigner that is already one', () => {
    const mockStoreDispatch = jest.fn()

    const wrapper = shallowMount(MultisigCosignatoriesDisplay, {
      i18n,
      propsData: {
        multisig: multisigInfo,
        modifiable: true,
        cosignatoryModifications: {},
      },
      mocks: {
        $store: {
          dispatch: mockStoreDispatch,
        },
      },
    })

    const component = wrapper.vm as MultisigCosignatoriesDisplay

    component.onAddCosignatory(account2)

    expect(mockStoreDispatch).toHaveBeenCalledWith('notification/ADD_WARNING', 'warning_already_a_cosignatory')
    wrapper.destroy()
  })

  test('Should dispatch an error when adding a cosigner has already been added', () => {
    const mockStoreDispatch = jest.fn()

    const wrapper = shallowMount(MultisigCosignatoriesDisplay, {
      i18n,
      propsData: {
        multisig: multisigInfo,
        modifiable: true,
        cosignatoryModifications: {
          [account4.publicKey]: { cosignatory: account4, addOrRemove: 'add' },
        },
      },
      mocks: {
        $store: {
          dispatch: mockStoreDispatch,
        },
      },
    })

    const component = wrapper.vm as MultisigCosignatoriesDisplay

    component.onAddCosignatory(account4)

    expect(mockStoreDispatch).toHaveBeenCalledWith('notification/ADD_WARNING', 'warning_already_a_cosignatory')
    wrapper.destroy()
  })

  test('Should emit when adding a cosigner', () => {
    const wrapper = shallowMount(MultisigCosignatoriesDisplay, {
      i18n,
      propsData: {
        multisig: multisigInfo,
        modifiable: true,
        cosignatoryModifications: {},
      },
    })

    const component = wrapper.vm as MultisigCosignatoriesDisplay

    component.onAddCosignatory(account4)
    expect(wrapper.emitted('add')).toBeTruthy()
    expect(wrapper.emitted().add[0]).toEqual([account4])
    wrapper.destroy()
  })

  test('Should emit when removing a cosigner', () => {
    const wrapper = shallowMount(MultisigCosignatoriesDisplay, {
      i18n,
      propsData: {
        multisig: multisigInfo,
        modifiable: true,
        cosignatoryModifications: {},
      },
    })

    const component = wrapper.vm as MultisigCosignatoriesDisplay

    component.onRemoveCosignatory(account2)
    expect(wrapper.emitted('remove')).toBeTruthy()
    expect(wrapper.emitted().remove[0]).toEqual([account2])
    wrapper.destroy()
  })
})
