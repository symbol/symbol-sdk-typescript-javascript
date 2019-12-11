import {of, throwError} from 'rxjs';
import {tap, map, mapTo, switchMap, catchError} from 'rxjs/operators';
import {UInt64, NetworkType} from 'nem2-sdk'
import flushPromises from 'flush-promises';
import {Network} from '@/core/model/Network.ts'
import {BlockHttp} from 'nem2-sdk/dist/src/infrastructure/BlockHttp'
import {ChainHttp} from 'nem2-sdk/dist/src/infrastructure/ChainHttp'
import {NodeHttp} from 'nem2-sdk/dist/src/infrastructure/NodeHttp'
import {NamespaceService} from 'nem2-sdk/dist/src/service/NamespaceService'
import {Notice, ChainStatus} from '@/core/model'
import {Message, networkConfig} from "@/config"
import {firstTransactionsNemXem, xemNamespace} from '../../../__mocks__/network/firstTransactionsNemXem'
import {firstTransactionsCatCurrency, catNamespace} from '../../../__mocks__/network/firstTransactionsCatCurrency'
import {block29248} from '../../../__mocks__/network/block29248'
import {block1} from '../../../__mocks__/network/block1'

jest.mock('@/core/model/Notice')

const mockDispatch = jest.fn()
const mockTriggerNotice = jest.fn()
const mockGetBlockByHeightCall = jest.fn()
const mockGetBlockTransactionsCall = jest.fn()
const modeGetNodeInfoCall = jest.fn()
const mockResetStoreValues = jest.fn()
const block1GenerationHash = block1.generationHash

Notice.trigger = mockTriggerNotice

const mockGetBlockByHeight = (blockNumber) => of(blockNumber).pipe(
  tap(blockNumber => mockGetBlockByHeightCall(blockNumber)),
  switchMap(blockNumber => {
    if (blockNumber === `29248`) return of(block29248)
    return of(block1)
  })
)

const mockGetBlockTransactions = (...args) => of(args).pipe(
  tap(args => mockGetBlockTransactionsCall(args)),
  mapTo((firstTransactionsNemXem)),
)

const mockGetNodeInfo = (...args) => of(('mock')).pipe(
  tap(args => modeGetNodeInfoCall(args)),
  mapTo({networkIdentifier: NetworkType.TEST_NET}),
)

const mockGetBlockTransactionsCatCurrency = (...args) => of(args).pipe(
  tap(args => mockGetBlockTransactionsCall(args)),
  mapTo((firstTransactionsCatCurrency)),
)

const mockNamespace = (...args) => of(args).pipe(
  mapTo(xemNamespace),
)

const mockCatNamespace = (...args) => of(args).pipe(
  mapTo(catNamespace),
)

const mockGetBlockchainHeight = (...args) => of('mock').pipe(
  mapTo(UInt64.fromUint(29248)),
)

const mockEmptyBlockHttp = (...args) => of('mock').pipe(
  map(_ => {throw new Error('Couldn\'t get the network first block')}),
  catchError((error) => throwError(error)),
)

const mockEmptyResponse = (...args) => of('mock').pipe(
  mapTo(({})),
)

jest.mock('nem2-sdk/dist/src/infrastructure/BlockHttp', () => ({
  BlockHttp: jest.fn().mockImplementation((endpoint) => {
    if (endpoint === 'http://errored.endpoint:3000') {
      return {
        getBlockByHeight: mockEmptyBlockHttp,
        getBlockTransactions: mockEmptyResponse,
      }
    } else if (endpoint === 'http://cat.currency:3000') {
      return {
        getBlockByHeight: mockGetBlockByHeight,
        getBlockTransactions: mockGetBlockTransactionsCatCurrency,
      }
    }
    return {
      getBlockByHeight: mockGetBlockByHeight,
      getBlockTransactions: mockGetBlockTransactions,
    }
  })
}))

jest.mock('nem2-sdk/dist/src/infrastructure/ChainHttp', () => ({
  ChainHttp: jest.fn().mockImplementation((endpoint) => {
    if (endpoint === 'http://errored.endpoint:3000') {
      return {getBlockchainHeight: mockEmptyResponse}
    }
    return {getBlockchainHeight: mockGetBlockchainHeight}
  })
}))

jest.mock('nem2-sdk/dist/src/infrastructure/NodeHttp', () => ({
  NodeHttp: jest.fn().mockImplementation((endpoint) => {
    if (endpoint === 'http://errored.endpoint:3000') {
      return {getNodeInfo: mockEmptyResponse}
    }
    return {getNodeInfo: mockGetNodeInfo}
  })
}))

jest.mock('nem2-sdk/dist/src/service/NamespaceService', () => ({
  NamespaceService: jest.fn().mockImplementation((namespaceHttp) => {
    const endpoint = namespaceHttp.namespaceRoutesApi._basePath
    if (endpoint === 'http://cat.currency:3000') {
      return {namespace: mockCatNamespace}
    }
    return {namespace: mockNamespace}
  })
}))

describe('switchNode', () => {
  beforeEach(() => {
    // @ts-ignore
    BlockHttp.mockClear()
    // @ts-ignore
    ChainHttp.mockClear()
    // @ts-ignore
    NodeHttp.mockClear()
    mockTriggerNotice.mockClear()
    mockGetBlockByHeightCall.mockClear()
    mockDispatch.mockClear()
  })

  it('should call the proper methods when the generationHash did not change', async (done) => {
    const store = {dispatch: mockDispatch}
    // @ts-ignore
    const network = Network.create(store)
    // @ts-ignore
    // @ts-ignore
    const mockSwitchGenerationHash = jest.fn()
    // @ts-ignore
    network.switchGenerationHash = mockSwitchGenerationHash
    const mockSetChainHeight = jest.fn()
    // @ts-ignore
    network.setChainHeight = mockSetChainHeight
    // @ts-ignore
    network.generationHash = block1GenerationHash
    network.switchNode('http://localhost:3000')
    await flushPromises()
    expect(modeGetNodeInfoCall).toHaveBeenCalledTimes(1)
    expect(mockTriggerNotice).toHaveBeenCalledTimes(1)
    expect(mockTriggerNotice.mock.calls[0][0]).toBe(Message.NODE_CONNECTION_SUCCEEDED)
    expect(mockSetChainHeight).toHaveBeenCalledTimes(1)
    expect(mockSwitchGenerationHash).toHaveBeenCalledTimes(0)
    // @ts-ignore
    expect(network.generationHash).toBe(block1GenerationHash)
    done()
  })

  it('should set the network generation hash and network type', async (done) => {
    const mockDispatch = jest.fn()
    const store = {dispatch: mockDispatch}
    // @ts-ignore
    const network = Network.create(store)
    // @ts-ignore
    network.switchNode('http://localhost:3000')

    await flushPromises()
    expect(BlockHttp).toHaveBeenCalledTimes(1)
    expect(NodeHttp).toHaveBeenCalledTimes(1)
    // @ts-ignore
    expect(BlockHttp.mock.calls[0][0]).toBe('http://localhost:3000')
    expect(mockGetBlockByHeightCall).toHaveBeenCalled()
    expect(mockGetBlockByHeightCall.mock.calls[0][0]).toBe('1')
    // @ts-ignore
    expect(network.endpoint).toBe('http://localhost:3000')
    // @ts-ignore
    expect(network.generationHash).toBe(block1GenerationHash)
    expect(mockDispatch.mock.calls[0][0]).toEqual('SET_NODE_LOADING')
    expect(mockDispatch.mock.calls[0][1]).toEqual({
      endpoint: 'http://localhost:3000',
      nodeLoading: true,
    })
    expect(mockDispatch.mock.calls[1][0]).toEqual('SET_GENERATION_HASH')
    expect(mockDispatch.mock.calls[1][1]).toEqual({
      endpoint: 'http://localhost:3000',
      generationHash: block1GenerationHash,
    })
    expect(mockDispatch.mock.calls[2][0]).toEqual('SET_NODE_NETWORK_TYPE')
    expect(mockDispatch.mock.calls[2][1]).toEqual({
      endpoint: 'http://localhost:3000',
      nodeNetworkType: 152,
    })
    expect(mockDispatch.mock.calls[3][0]).toEqual('SET_CHAIN_STATUS')
    expect(mockDispatch.mock.calls[4][0]).toEqual('SET_IS_NODE_HEALTHY')
    expect(mockDispatch.mock.calls[4][1]).toEqual({
      endpoint: 'http://localhost:3000',
      isNodeHealthy: true,
    })
    expect(mockDispatch.mock.calls[5][0]).toEqual('SET_NODE_LOADING')
    expect(mockDispatch.mock.calls[5][1]).toEqual({
      endpoint: 'http://localhost:3000',
      nodeLoading: false,
    })
    done()
  })

  it('should call reset if BlockHttp does not return a generation hash', async (done) => {
    const mockDispatch = jest.fn()
    const store = {dispatch: mockDispatch}
    // @ts-ignore
    const network = Network.create(store)
    network.switchNode('http://errored.endpoint:3000')

    await flushPromises()

    setTimeout(() => {
      expect(BlockHttp).toHaveBeenCalledTimes(1)
      // @ts-ignore
      expect(BlockHttp.mock.calls[0][0]).toBe('http://errored.endpoint:3000')
      // @ts-ignore
      expect(network.endpoint).toBe(null)
      // @ts-ignore
      expect(network.generationHash).toBe(null)
      expect(mockDispatch.mock.calls[0][0]).toEqual('SET_NODE_LOADING')
      expect(mockDispatch.mock.calls[0][1]).toEqual({
        endpoint: 'http://errored.endpoint:3000',
        nodeLoading: true,
      })
      expect(mockDispatch.mock.calls[1][0]).toBe('SET_IS_NODE_HEALTHY')
      expect(mockDispatch.mock.calls[1][1]).toEqual({
        endpoint: 'http://errored.endpoint:3000', isNodeHealthy: false,
      })
      expect(mockDispatch.mock.calls[2][0]).toBe('SET_GENERATION_HASH')
      expect(mockDispatch.mock.calls[2][1]).toEqual({
        endpoint: 'http://errored.endpoint:3000', generationHash: 'error',
      })
      expect(mockDispatch.mock.calls[3][0]).toBe('SET_NODE_NETWORK_TYPE')
      expect(mockDispatch.mock.calls[3][1]).toEqual({
        endpoint: 'http://errored.endpoint:3000', nodeNetworkType: null,
      })
      expect(mockDispatch.mock.calls[4][0]).toBe('SET_CHAIN_STATUS')
      expect(mockDispatch.mock.calls[5][0]).toEqual('SET_NODE_LOADING')
      expect(mockDispatch.mock.calls[5][1]).toEqual({
        endpoint: 'http://errored.endpoint:3000',
        nodeLoading: false,
      })
      done()
    }, 1)
  })
})


describe('setNetworkMosaics', () => {
  beforeEach(() => {
    // @ts-ignore
    ChainHttp.mockClear()
    mockTriggerNotice.mockClear()
    mockGetBlockByHeightCall.mockClear()
    mockDispatch.mockClear()
    mockResetStoreValues.mockClear()
    // @ts-ignore
    NamespaceService.mockClear()
    // @ts-ignore
    BlockHttp.mockClear()
  })

  it('should set network mosaic properly for a nem.xem network', async (done) => {
    const mockDispatch = jest.fn()
    const store = {dispatch: mockDispatch}
    // @ts-ignore
    const network = Network.create(store)

    network.switchNode('http://localhost:3000')
    await flushPromises()
    expect(mockDispatch.mock.calls[6][0]).toEqual('SET_NETWORK_CURRENCY')
    expect(mockDispatch.mock.calls[6][1]).toEqual({
      networkCurrency: {
        hex: '46BE9BC0626F9B1A',
        divisibility: 6,
        ticker: 'XEM',
        name: 'nem.xem',
      },
      endpoint: 'http://localhost:3000'
    })
    expect(mockDispatch.mock.calls[7][0]).toEqual('UPDATE_MOSAICS')
    expect(mockDispatch.mock.calls[7][1]).not.toBeNull()
    expect(mockDispatch.mock.calls[8][0]).toEqual('SET_NETWORK_MOSAICS')
    expect(mockDispatch.mock.calls[8][1]).not.toBeNull()

    done()
  })

  it('should set network mosaic properly for a cat.currency network', async (done) => {
    const mockDispatch = jest.fn()
    const store = {dispatch: mockDispatch}
    // @ts-ignore
    const network = Network.create(store)

    network.switchNode('http://cat.currency:3000')
    await flushPromises()
    expect(mockDispatch.mock.calls[6][0]).toEqual('SET_NETWORK_CURRENCY')
    expect(mockDispatch.mock.calls[6][1]).toEqual({
      networkCurrency: {
        hex: '4B1278B5DD004110',
        divisibility: 6,
        ticker: 'CURRENCY',
        name: 'cat.currency',
      },
      endpoint: 'http://cat.currency:3000'
    })
    expect(mockDispatch.mock.calls[7][0]).toEqual('UPDATE_MOSAICS')
    expect(mockDispatch.mock.calls[7][1]).not.toBeNull()
    expect(mockDispatch.mock.calls[8][0]).toEqual('SET_NETWORK_MOSAICS')
    expect(mockDispatch.mock.calls[8][1]).not.toBeNull()

    done()
  })


  it('should throw if the getBlockTransactions returns an empty payload ', async (done) => {
    const mockDispatch = jest.fn()
    const store = {dispatch: mockDispatch}
    // @ts-ignore
    const network = Network.create(store)

    network.switchNode('http://cat.currency:3000')
    await flushPromises()
    expect(mockDispatch.mock.calls[6][0]).toEqual('SET_NETWORK_CURRENCY')
    expect(mockDispatch.mock.calls[6][1]).toEqual({
      networkCurrency: {
        hex: '4B1278B5DD004110',
        divisibility: 6,
        ticker: 'CURRENCY',
        name: 'cat.currency',
      },
      endpoint: 'http://cat.currency:3000'
    })
    expect(mockDispatch.mock.calls[7][0]).toEqual('UPDATE_MOSAICS')
    expect(mockDispatch.mock.calls[7][1]).not.toBeNull()
    expect(mockDispatch.mock.calls[8][0]).toEqual('SET_NETWORK_MOSAICS')
    expect(mockDispatch.mock.calls[8][1]).not.toBeNull()

    done()
  })
});


describe('setChainHeight', () => {
  beforeEach(() => {
    // @ts-ignore
    ChainHttp.mockClear()
    mockTriggerNotice.mockClear()
    mockGetBlockByHeightCall.mockClear()
    mockDispatch.mockClear()
    mockResetStoreValues.mockClear()
    // @ts-ignore
    NamespaceService.mockClear()
    // @ts-ignore
    BlockHttp.mockClear()
  })


  it('should dispatch SET_CHAIN_STATUS', async (done) => {
    const mockDispatch = jest.fn()
    const store = {dispatch: mockDispatch}
    // @ts-ignore
    const network = Network.create(store)

    network.switchNode('http://cat.currency:3000')
    await flushPromises()
    expect(mockDispatch.mock.calls[3][0]).toBe('SET_CHAIN_STATUS')
    expect(mockDispatch.mock.calls[3][1]).toEqual({
      endpoint: 'http://cat.currency:3000',
      chainStatus: new ChainStatus(block29248),
    })
    // @ts-ignore
    done()
  })
})
