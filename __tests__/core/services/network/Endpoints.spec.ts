import {Endpoints} from '@/core/services/network/Endpoints.ts'
import {defaultNodeList} from '@/config/view/node'
import flushPromises from 'flush-promises'
import * as utils from '@/core/utils/utils'
import {hdAccountTestNet} from '@MOCKS/conf'

describe('Endpoints', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should initialize nodes localStorage when some are found in it', async (done) => {
    jest.spyOn(utils, 'localRead').mockImplementationOnce(() => JSON.stringify([{
      value: 'http://a.custom.endpoint:3000',
      name: 'http://a.custom.endpoint:3000',
      url: 'http://a.custom.endpoint:3000',
      networkType:hdAccountTestNet.networkType,

    },
    {
      value: 'http://another.custom.endpoint:3000',
      name: 'http://another.custom.endpoint:3000',
      url: 'http://another.custom.endpoint:3000',
      networkType:hdAccountTestNet.networkType,
    }]))

    jest.spyOn(utils, 'localRead').mockImplementationOnce(() =>JSON.stringify( {
      '152': 'http://a.custom.endpoint:3000',
    }))


    const mockCommit = jest.fn()
    const store = {
      commit: mockCommit,
    }

    // @ts-ignore
    Endpoints.setNodeInfo(hdAccountTestNet.networkType,store)

    await flushPromises()
    expect(mockCommit.mock.calls[1][0]).toBe('SET_NODE_LIST')
    expect(mockCommit.mock.calls[1][1]).toEqual([
      {
        value: 'http://a.custom.endpoint:3000',
        name: 'http://a.custom.endpoint:3000',
        url: 'http://a.custom.endpoint:3000',
        networkType:hdAccountTestNet.networkType,
      },
      {
        value: 'http://another.custom.endpoint:3000',
        name: 'http://another.custom.endpoint:3000',
        url: 'http://another.custom.endpoint:3000',
        networkType:hdAccountTestNet.networkType,
      },
    ])

    expect(mockCommit.mock.calls[0][0]).toBe('SET_NODE')
    expect(mockCommit.mock.calls[0][1]).toStrictEqual({'networkType': 152, 'node': 'http://a.custom.endpoint:3000'})
    done()
  })


  it('should initialize nodes from default when nothing is found in localStorage', async (done) => {
    jest.spyOn(utils, 'localRead').mockImplementation(() => '')

    // @ts-ignore
    const mockCommit = jest.fn()
    const store = {
      commit: mockCommit,
    }

    // @ts-ignore
    Endpoints.initialize(store)

    await flushPromises()
    expect(mockCommit.mock.calls[0][0]).toBe('SET_NODE_LIST')
    expect(mockCommit.mock.calls[0][1]).toEqual(defaultNodeList)
    expect(mockCommit.mock.calls[1][0]).toBe('SET_NODE')
    expect(mockCommit.mock.calls[1][1]).toStrictEqual({
      'networkType': 152,
      'node': 'http://api-harvest-20.ap-northeast-1.nemtech.network:3000',
    })
    done()
  })

  it('should initialize nodes from default when an empty list is found in localStorage', async (done) => {
    jest.spyOn(utils, 'localRead').mockImplementationOnce(() => '{}')
    jest.spyOn(utils, 'localRead').mockImplementationOnce(() => '')

    // @ts-ignore
    const mockCommit = jest.fn()
    const store = {
      commit: mockCommit,
    }

    // @ts-ignore
    Endpoints.initialize(store)

    await flushPromises()
    expect(mockCommit.mock.calls[0][0]).toBe('SET_NODE_LIST')
    expect(mockCommit.mock.calls[0][1]).toEqual(defaultNodeList)
    expect(mockCommit.mock.calls[1][0]).toBe('SET_NODE')
    expect(mockCommit.mock.calls[1][1]).toStrictEqual({
      'networkType': 152,
      'node': 'http://api-harvest-20.ap-northeast-1.nemtech.network:3000',
    })
    done()
  })
})
