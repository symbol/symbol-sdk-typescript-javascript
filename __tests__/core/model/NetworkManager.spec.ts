import {of, throwError} from 'rxjs'
import {tap, map, mapTo, switchMap, catchError} from 'rxjs/operators'
import {UInt64} from 'nem2-sdk'
import flushPromises from 'flush-promises'
import {NetworkManager} from '@/core/model/NetworkManager.ts'
import {BlockHttp} from 'nem2-sdk/dist/src/infrastructure/BlockHttp'
import {ChainHttp} from 'nem2-sdk/dist/src/infrastructure/ChainHttp'
import {Notice} from '@/core/model'
import {Message} from '@/config'
import {firstTransactionsNemXem, xemNamespace} from '../../../__mocks__/network/firstTransactionsNemXem'
import {firstTransactionsCatCurrency, catNamespace} from '../../../__mocks__/network/firstTransactionsCatCurrency'
import {block29248} from '../../../__mocks__/network/block29248'
import {block1} from '../../../__mocks__/network/block1'
import {OnWalletChange} from '@/core/services/eventHandlers/onWalletChange'
import {setWalletsBalances} from '@/core/services/wallets/setWalletsBalances'

jest.mock('@/core/model/Notice')
jest.mock('@/core/services/eventHandlers/onWalletChange')
jest.mock('@/core/services/wallets/setWalletsBalances')

const mockOnWalletChangeTrigger = jest.fn()
const mockDispatch = jest.fn()
const mockTriggerNotice = jest.fn()
const mockGetBlockByHeightCall = jest.fn()
const mockGetBlockTransactionsCall = jest.fn()
const mockGetBlockByHeightWithLimitCall = jest.fn()
const block1GenerationHash = block1.generationHash
Notice.trigger = mockTriggerNotice
OnWalletChange.trigger = mockOnWalletChangeTrigger

const mockGetBlockByHeight = blockNumber => of(blockNumber).pipe(
  tap(blockNumber => mockGetBlockByHeightCall(blockNumber)),
  switchMap(blockNumber => {
    if (blockNumber === '29248') return of(block29248)
    return of(block1)
  })
)

const mockGetBlockByHeightWithLimit = blockNumber => of(blockNumber).pipe(
  tap(blockNumber => mockGetBlockByHeightWithLimitCall(blockNumber)),
  switchMap(blockNumber => {
    if (blockNumber === '29248') return of([block29248])
    return of(block1)
  })
)

const mockGetBlockTransactions = (...args) => of(args).pipe(
  tap(args => mockGetBlockTransactionsCall(args)),
  mapTo((firstTransactionsNemXem)),
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

const mockGetBlockchainHeight = () => of('mock').pipe(
  mapTo(UInt64.fromUint(29248)),
)

const mockEmptyBlockHttp = () => of('mock').pipe(
  map(() => {throw new Error('Couldn\'t get the network first block')}),
  catchError(error => throwError(error)),
)

const mockEmptyResponse = () => of('mock').pipe(
  mapTo(({})),
)

const mockListeners = jest.fn().mockImplementation()
const mockNetworkPropertiesSetLoadingToTrue = jest.fn()
const mockNetworkPropertiesSetHealthyToFalse = jest.fn()
const mockNetworkPropertiesReset = jest.fn()
const mockNetworkPropertiesSetValuesFromFirstBlock = jest.fn()
const mockNetworkPropertiesInitializeLatestBlocks = jest.fn()
const mockNetworkProperties = jest.fn().mockImplementation(function() {
  return {
    setLoadingToTrue: mockNetworkPropertiesSetLoadingToTrue,
    setHealthyToFalse: mockNetworkPropertiesSetHealthyToFalse,
    reset: mockNetworkPropertiesReset ,
    setValuesFromFirstBlock: mockNetworkPropertiesSetValuesFromFirstBlock ,
    initializeLatestBlocks: mockNetworkPropertiesInitializeLatestBlocks ,
  }
})


jest.mock('nem2-sdk/dist/src/infrastructure/BlockHttp', () => ({
  BlockHttp: jest.fn().mockImplementation(endpoint => {
    if (endpoint === 'http://errored.endpoint:3000') {
      return {
        getBlockByHeight: mockEmptyBlockHttp,
        getBlocksByHeightWithLimit: mockGetBlockByHeightWithLimit,
        getBlockTransactions: mockEmptyResponse,
      }
    } else if (endpoint === 'http://cat.currency:3000') {
      return {
        getBlockByHeight: mockGetBlockByHeight,
        getBlocksByHeightWithLimit: mockGetBlockByHeightWithLimit,
        getBlockTransactions: mockGetBlockTransactionsCatCurrency,
      }
    }
    return {
      getBlockByHeight: mockGetBlockByHeight,
      getBlocksByHeightWithLimit: mockGetBlockByHeightWithLimit,
      getBlockTransactions: mockGetBlockTransactions,
    }
  }),
}))

jest.mock('nem2-sdk/dist/src/infrastructure/NamespaceHttp', () => ({
  NamespaceHttp: jest.fn().mockImplementation((...args) => ({
    endpoint: args,
  })),
}))

jest.mock('nem2-sdk/dist/src/infrastructure/ChainHttp', () => ({
  ChainHttp: jest.fn().mockImplementation(endpoint => {
    if (endpoint === 'http://errored.endpoint:3000') {
      return {getBlockchainHeight: mockEmptyResponse}
    }
    return {getBlockchainHeight: mockGetBlockchainHeight}
  }),
}))

jest.mock('nem2-sdk/dist/src/service/NamespaceService', () => ({
  NamespaceService: jest.fn().mockImplementation(namespaceHttp => {
    const [endpoint] = namespaceHttp.endpoint
    if (endpoint === 'http://cat.currency:3000') {
      return {namespace: mockCatNamespace}
    }
    return {namespace: mockNamespace}
  }),
}))

describe('switchNode', () => {
  beforeEach(() => {
    // @ts-ignore
    BlockHttp.mockClear()
    // @ts-ignore
    ChainHttp.mockClear()
    // @ts-ignore
    mockTriggerNotice.mockClear()
    mockGetBlockByHeightCall.mockClear()
    mockDispatch.mockClear()
    mockListeners.mockClear()
    mockNetworkPropertiesSetLoadingToTrue.mockClear()
    mockNetworkPropertiesSetHealthyToFalse.mockClear()
    mockNetworkPropertiesReset.mockClear()
    mockNetworkPropertiesSetValuesFromFirstBlock.mockClear()
    mockNetworkPropertiesInitializeLatestBlocks.mockClear()
    mockOnWalletChangeTrigger.mockClear()
    // @ts-ignore
    setWalletsBalances.mockClear()
  })

  it('should call the proper methods when the generationHash did not change', async done => {
    const store = {dispatch: mockDispatch}
    // @ts-ignore
    const network = NetworkManager.create(store, new mockNetworkProperties(), mockListeners)
    const mockSetNodeInfoAndHealth = jest.fn()
    // @ts-ignore
    network.setNodeInfoAndHealth = mockSetNodeInfoAndHealth
    const mockSwitchGenerationHash = jest.fn()
    // @ts-ignore
    network.switchGenerationHash = mockSwitchGenerationHash
    const mockSetLatestBlocks = jest.fn()
    // @ts-ignore
    network.setLatestBlocks = mockSetLatestBlocks
    // @ts-ignore
    network.generationHash = block1GenerationHash
    network.switchEndpoint('http://localhost:3000')
    await flushPromises()
    expect(mockNetworkPropertiesSetLoadingToTrue).toHaveBeenCalledTimes(1)
    expect(mockSetNodeInfoAndHealth).toHaveBeenCalledTimes(1)
    expect(mockTriggerNotice.mock.calls[0][0]).toBe(Message.NODE_CONNECTION_SUCCEEDED)
    expect(mockSetLatestBlocks).toHaveBeenCalledTimes(1)
    // @ts-ignore
    expect(network.generationHash).toBe(block1GenerationHash)
    done()
  })

  it('should call NetworkProperties and wallets methods', async done => {
    const store = {dispatch: mockDispatch}
    // @ts-ignore
    const network = NetworkManager.create(store, new mockNetworkProperties(), mockListeners)
    // @ts-ignore
    network.switchEndpoint('http://localhost:3000')

    const test = jest.fn()
    // @ts-ignore
    network.setNetworkMosaics = test
    await flushPromises()

    setTimeout(()=> {
      expect(mockNetworkPropertiesSetValuesFromFirstBlock).toHaveBeenCalledTimes(1)
      expect(mockNetworkPropertiesSetValuesFromFirstBlock.mock.calls[0][0]).toBe(block1)
      expect(mockNetworkPropertiesSetValuesFromFirstBlock.mock.calls[0][1]).toBe('http://localhost:3000')
      expect(mockNetworkPropertiesInitializeLatestBlocks.mock.calls[0][0]).toStrictEqual([block29248])
      expect(mockNetworkPropertiesInitializeLatestBlocks.mock.calls[0][1]).toBe('http://localhost:3000')
      expect(mockTriggerNotice.mock.calls[0][0]).toBe(Message.NODE_CONNECTION_SUCCEEDED)
      expect(mockOnWalletChangeTrigger).toHaveBeenCalledTimes(1)
      // @ts-ignore
      expect(mockOnWalletChangeTrigger.mock.calls[0][0]).toEqual(store)
      // @ts-ignore
      expect(mockOnWalletChangeTrigger.mock.calls[0][1]).toEqual(mockListeners)
      expect(setWalletsBalances).toHaveBeenCalledTimes(1)
      // @ts-ignore
      expect(setWalletsBalances.mock.calls[0][0]).toEqual(store)
      done()
    }, 50)
  })

  it('should call setHealthyToFalse if BlockHttp does not return a generation hash', async done => {
    const mockDispatch = jest.fn()
    const store = {dispatch: mockDispatch}
    // @ts-ignore
    const network = NetworkManager.create(store, new mockNetworkProperties(), mockListeners)
    network.switchEndpoint('http://errored.endpoint:3000')

    await flushPromises()

    setTimeout(() => {
      expect(BlockHttp).toHaveBeenCalledTimes(1)
      // @ts-ignore
      expect(BlockHttp.mock.calls[0][0]).toBe('http://errored.endpoint:3000')
      // @ts-ignore
      expect(network.endpoint).toBe(null)
      // @ts-ignore
      expect(network.generationHash).toBe(null)
      // @ts-ignore
      expect(mockTriggerNotice.mock.calls[0][0]).toBe(Message.NODE_CONNECTION_ERROR)
      expect(mockNetworkPropertiesSetValuesFromFirstBlock).not.toHaveBeenCalled()
      expect(mockNetworkPropertiesSetHealthyToFalse).toHaveBeenCalledTimes(1)
      expect(mockNetworkPropertiesSetHealthyToFalse.mock.calls[0][0]).toBe('http://errored.endpoint:3000')
      done()
    }, 1)
  })
})


describe('setNetworkMosaics', () => {
  beforeEach(() => {
    // @ts-ignore
    BlockHttp.mockClear()
    // @ts-ignore
    ChainHttp.mockClear()
    // @ts-ignore
    mockTriggerNotice.mockClear()
    mockGetBlockByHeightCall.mockClear()
    mockDispatch.mockClear()
    mockListeners.mockClear()
    mockNetworkPropertiesSetLoadingToTrue.mockClear()
    mockNetworkPropertiesReset.mockClear()
    mockNetworkPropertiesSetValuesFromFirstBlock.mockClear()
    mockNetworkPropertiesInitializeLatestBlocks.mockClear()
    mockNetworkPropertiesInitializeLatestBlocks.mockClear()
  })

  it('should set network mosaic properly for a nem.xem network', async done => {
    const mockDispatch = jest.fn()
    const store = {dispatch: mockDispatch}
    // @ts-ignore
    const network = NetworkManager.create(store, new mockNetworkProperties(), mockListeners)

    network.switchEndpoint('http://localhost:3000')
    await flushPromises()
    expect(mockDispatch.mock.calls[0][0]).toEqual('SET_NETWORK_CURRENCY')
    expect(mockDispatch.mock.calls[0][1]).toEqual({
      networkCurrency: {
        hex: '46BE9BC0626F9B1A',
        divisibility: 6,
        ticker: 'XEM',
        name: 'nem.xem',
      },
      endpoint: 'http://localhost:3000',
    })
    expect(mockDispatch.mock.calls[1][0]).toEqual('UPDATE_MOSAICS')
    expect(mockDispatch.mock.calls[1][1]).not.toBeNull()
    expect(mockDispatch.mock.calls[2][0]).toEqual('SET_NETWORK_MOSAICS')
    expect(mockDispatch.mock.calls[2][1]).not.toBeNull()

    done()
  })

  it('should set network mosaic properly for a cat.currency network', async done => {
    const mockDispatch = jest.fn()
    const store = {dispatch: mockDispatch}
    // @ts-ignore
    const network = NetworkManager.create(store, new mockNetworkProperties(), mockListeners)

    network.switchEndpoint('http://cat.currency:3000')
    await flushPromises()
    expect(mockDispatch.mock.calls[0][0]).toEqual('SET_NETWORK_CURRENCY')
    expect(mockDispatch.mock.calls[0][1]).toEqual({
      networkCurrency: {
        hex: '4B1278B5DD004110',
        divisibility: 6,
        ticker: 'CURRENCY',
        name: 'cat.currency',
      },
      endpoint: 'http://cat.currency:3000',
    })
    expect(mockDispatch.mock.calls[1][0]).toEqual('UPDATE_MOSAICS')
    expect(mockDispatch.mock.calls[1][1]).not.toBeNull()
    expect(mockDispatch.mock.calls[2][0]).toEqual('SET_NETWORK_MOSAICS')
    expect(mockDispatch.mock.calls[2][1]).not.toBeNull()

    done()
  })
})