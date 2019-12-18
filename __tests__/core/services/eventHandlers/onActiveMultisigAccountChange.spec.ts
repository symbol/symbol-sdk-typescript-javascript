import {OnActiveMultisigAccountChange} from '@/core/services/eventHandlers/onActiveMultisigAccountChange.ts'
import flushPromises from 'flush-promises'
import { MultisigWallet,
  // @ts-ignore
} from '@@/mock/conf/conf.spec'
import {NetworkType} from 'nem2-sdk'

jest.mock('@/core/services/multisig/methods')

const mockMosaicsAmountViewFromAddressCall = jest.fn()
jest.mock('@/core/services/namespace/methods')
jest.mock('@/core/services/mosaics/methods', () => {
  return {
    'mosaicsAmountViewFromAddress': () => {
      mockMosaicsAmountViewFromAddressCall()
      return []
    } ,
  }
})

const mockFromAppNamespaces = jest.fn()
jest.mock('@/core/services/mosaics/appMosaics', () => {
  return {
    AppMosaics: () => ({
      fromAppNamespaces: mockFromAppNamespaces,
    }),
  }
})

const mockCommit = jest.fn()

describe('OnActiveMultisigAccountChange', () => {
  it('should call all the methods', async (done) => {
    const store = {
      commit: mockCommit,
    }

    await OnActiveMultisigAccountChange.trigger(
      MultisigWallet.publicKey,
      'http://localhost:3000',
      NetworkType.MIJIN_TEST,
      // @ts-ignore
      store,
    )
    await flushPromises()

    expect(mockMosaicsAmountViewFromAddressCall).toHaveBeenCalledTimes(1)
    expect(mockFromAppNamespaces).toHaveBeenCalledTimes(1)
    expect(mockCommit.mock.calls[0][0]).toBe('SET_MULTISIG_ACCOUNT_NAMESPACES')
    expect(mockCommit.mock.calls[0][1]).toStrictEqual({
      address: MultisigWallet.address,
      namespaces: undefined,
    })

    expect(mockCommit.mock.calls[1][0]).toBe('UPDATE_MULTISIG_ACCOUNT_MOSAICS')
    expect(mockCommit.mock.calls[1][1]).toStrictEqual({
      address: MultisigWallet.address,
      mosaics: [],
    })
    done()
  })
})