import {of, throwError} from 'rxjs'
import {tap, map, mapTo, switchMap, catchError} from 'rxjs/operators'
import {UInt64} from 'nem2-sdk'
import {NetworkProperties} from '@/core/model/NetworkProperties.ts'
import {BlockHttp} from 'nem2-sdk/dist/src/infrastructure/BlockHttp'
import {ChainHttp} from 'nem2-sdk/dist/src/infrastructure/ChainHttp'
import {Notice} from '@/core/model'
import {networkConfig} from '@/config'
import {firstTransactionsNemXem, xemNamespace} from '../../../__mocks__/network/firstTransactionsNemXem'
import {firstTransactionsCatCurrency, catNamespace} from '../../../__mocks__/network/firstTransactionsCatCurrency'
import {block29248} from '../../../__mocks__/network/block29248'
import {block1} from '../../../__mocks__/network/block1'
import {OnWalletChange} from '@/core/services/eventHandlers/onWalletChange'
import {setWalletsBalances} from '@/core/services/wallets/setWalletsBalances'

const {maxRollbackBlocks,maxDifficultyBlocks, defaultDynamicFeeMultiplier} = networkConfig

jest.mock('@/core/model/Notice')
jest.mock('@/core/services/eventHandlers/onWalletChange')
jest.mock('@/core/services/wallets/setWalletsBalances')

const mockDispatch = jest.fn()
const mockTriggerNotice = jest.fn()
const mockGetBlockByHeightCall = jest.fn()
const mockGetBlockTransactionsCall = jest.fn()
const mockGetBlockByHeightWithLimitCall = jest.fn()
Notice.trigger = mockTriggerNotice


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
const mockNetworkPropertiesSetLoadingTrue = jest.fn()
const mockNetworkPropertiesReset = jest.fn()
const mockNetworkPropertiesSetValuesFromFirstBlock = jest.fn()
const mockNetworkPropertiesSetValuesFromLatestBlocks = jest.fn()

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
    const endpoint = namespaceHttp.namespaceRoutesApi._basePath
    if (endpoint === 'http://cat.currency:3000') {
      return {namespace: mockCatNamespace}
    }
    return {namespace: mockNamespace}
  }),
}))

describe('Network properties', () => {
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
    mockNetworkPropertiesSetLoadingTrue.mockClear()
    mockNetworkPropertiesReset.mockClear()
    mockNetworkPropertiesSetValuesFromFirstBlock.mockClear()
    mockNetworkPropertiesSetValuesFromLatestBlocks.mockClear()
    // @ts-ignore
    OnWalletChange.mockClear()
    // @ts-ignore
    setWalletsBalances.mockClear()
  })

  const store = {dispatch: mockDispatch}

  it('Should dispatch SET_NETWORK_PROPERTIES with its default values when reset is called', () => {
    // @ts-ignore
    const networkProperties = NetworkProperties.create(store)
    networkProperties.reset('http://localhost:3000')
    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(mockDispatch.mock.calls[0][0]).toBe('SET_NETWORK_PROPERTIES')
    const commitCall = mockDispatch.mock.calls[0][1]
    expect(commitCall.endpoint).toBe('http://localhost:3000')
    expect(commitCall.NetworkProperties.generationHash).toBe(null)
    expect(commitCall.NetworkProperties.healthy).toBe(false)
    expect(commitCall.NetworkProperties.height).toBe(0)
    expect(commitCall.NetworkProperties.lastBlock).toBe(null)
    expect(commitCall.NetworkProperties.lastBlocks).toBe(null)
    expect(commitCall.NetworkProperties.lastBlockTimestamp).toBe(0)
    expect(commitCall.NetworkProperties.loading).toBe(false)
    expect(commitCall.NetworkProperties.networkType).toBe(null)
    expect(commitCall.NetworkProperties.numTransactions).toBe(0)
    expect(commitCall.NetworkProperties.signerPublicKey).toBe('')
    expect(commitCall.NetworkProperties.fee).toBe(defaultDynamicFeeMultiplier)
  })

  it('setLoadingToTrue should dispatch SET_NETWORK_PROPERTIES with the right values', () => {
    // @ts-ignore
    const networkProperties = NetworkProperties.create(store)
    networkProperties.setLoadingToTrue('http://localhost:3000')
    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(mockDispatch.mock.calls[0][0]).toBe('SET_NETWORK_PROPERTIES')
    const commitCall = mockDispatch.mock.calls[0][1]
    expect(commitCall.endpoint).toBe('http://localhost:3000')
    expect(commitCall.NetworkProperties.generationHash).toBe(null)
    expect(commitCall.NetworkProperties.healthy).toBe(true)
    expect(commitCall.NetworkProperties.height).toBe(0)
    expect(commitCall.NetworkProperties.lastBlock).toBe(null)
    expect(commitCall.NetworkProperties.lastBlocks).toBe(null)
    expect(commitCall.NetworkProperties.lastBlockTimestamp).toBe(0)
    expect(commitCall.NetworkProperties.loading).toBe(true)
    expect(commitCall.NetworkProperties.networkType).toBe(null)
    expect(commitCall.NetworkProperties.numTransactions).toBe(0)
    expect(commitCall.NetworkProperties.signerPublicKey).toBe('')
    expect(commitCall.NetworkProperties.fee).toBe(defaultDynamicFeeMultiplier)
  })

  it('setHealthyToFalse should dispatch SET_NETWORK_PROPERTIES with the right values', () => {
    // @ts-ignore
    const networkProperties = NetworkProperties.create(store)
    networkProperties.setHealthyToFalse('http://localhost:3000')
    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(mockDispatch.mock.calls[0][0]).toBe('SET_NETWORK_PROPERTIES')
    const commitCall = mockDispatch.mock.calls[0][1]
    expect(commitCall.endpoint).toBe('http://localhost:3000')
    expect(commitCall.NetworkProperties.generationHash).toBe(null)
    expect(commitCall.NetworkProperties.healthy).toBe(false)
    expect(commitCall.NetworkProperties.height).toBe(0)
    expect(commitCall.NetworkProperties.lastBlock).toBe(null)
    expect(commitCall.NetworkProperties.lastBlocks).toBe(null)
    expect(commitCall.NetworkProperties.lastBlockTimestamp).toBe(0)
    expect(commitCall.NetworkProperties.loading).toBe(false)
    expect(commitCall.NetworkProperties.networkType).toBe(null)
    expect(commitCall.NetworkProperties.numTransactions).toBe(0)
    expect(commitCall.NetworkProperties.signerPublicKey).toBe('')
    expect(commitCall.NetworkProperties.fee).toBe(defaultDynamicFeeMultiplier)
  })

  it('setValuesFromFirstBlock should dispatch SET_NETWORK_PROPERTIES with the right values', () => {
    // @ts-ignore
    const networkProperties = NetworkProperties.create(store)
    networkProperties.setValuesFromFirstBlock(block1, 'http://localhost:3000')
    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(mockDispatch.mock.calls[0][0]).toBe('SET_NETWORK_PROPERTIES')
    const commitCall = mockDispatch.mock.calls[0][1]
    expect(commitCall.endpoint).toBe('http://localhost:3000')
    expect(commitCall.NetworkProperties.generationHash).toBe('6C0350A10724FC325A1F06CEFC4CA14464BC472F566842D22418AEE0F8746B4C')
    expect(commitCall.NetworkProperties.healthy).toBe(true)
    expect(commitCall.NetworkProperties.height).toBe(0)
    expect(commitCall.NetworkProperties.lastBlock).toBe(null)
    expect(commitCall.NetworkProperties.lastBlocks).toBe(null)
    expect(commitCall.NetworkProperties.lastBlockTimestamp).toBe(0)
    expect(commitCall.NetworkProperties.loading).toBe(false)
    expect(commitCall.NetworkProperties.networkType).toBe(152)
    expect(commitCall.NetworkProperties.numTransactions).toBe(0)
    expect(commitCall.NetworkProperties.signerPublicKey).toBe('')
    expect(commitCall.NetworkProperties.fee).toBe(defaultDynamicFeeMultiplier)
  })

  it('initializeLatestBlocks should dispatch SET_NETWORK_PROPERTIES with the right values', () => {
    // @ts-ignore
    const networkProperties = NetworkProperties.create(store)
    networkProperties.initializeLatestBlocks([block29248], 'http://localhost:3000')
    expect(mockDispatch).toHaveBeenCalledTimes(2)
    expect(mockDispatch.mock.calls[0][0]).toBe('SET_NETWORK_PROPERTIES')
    const commitCall = mockDispatch.mock.calls[0][1]
    expect(commitCall.endpoint).toBe('http://localhost:3000')
    expect(commitCall.NetworkProperties.generationHash).toBe(null)
    expect(commitCall.NetworkProperties.healthy).toBe(true)
    expect(commitCall.NetworkProperties.height).toBe(29248)
    expect(commitCall.NetworkProperties.lastBlock).toBe(block29248)
    expect(commitCall.NetworkProperties.lastBlocks).toStrictEqual([block29248])
    expect(commitCall.NetworkProperties.lastBlockTimestamp).toBe(116060537287)
    expect(commitCall.NetworkProperties.loading).toBe(false)
    expect(commitCall.NetworkProperties.networkType).toBe(null)
    expect(commitCall.NetworkProperties.numTransactions).toBe(0)
    expect(commitCall.NetworkProperties.signerPublicKey).toBe('B70BBCE88F6471FF1E7D47E03ECAA3AD946C8AC4CF2A812E37853D6079563900')
    expect(commitCall.NetworkProperties.fee).toBe(defaultDynamicFeeMultiplier)
  })

  it('handleLastBlock should behave correctly when it has no lastBlocks', () => {
    // @ts-ignore
    const networkProperties = NetworkProperties.create(store)
    // @ts-ignore
    networkProperties.lastBlocks = []
    const newBlock = {
      height: UInt64.fromUint(1000),
      numTransactions: 6,
      signer: {publicKey: 'B70BBCE88F6471FF1E7D47E03ECAA3AD946C8AC4CF2A812E37853D6079563900'},
      timestamp: UInt64.fromUint(116060537287),
      feeMultiplier: 666,
    }

    // @ts-ignore
    networkProperties.handleLastBlock(newBlock, 'http://localhost:3000')
    expect(mockDispatch.mock.calls[0][0]).toBe('SET_NETWORK_PROPERTIES')
    const commitCall = mockDispatch.mock.calls[0][1]
    expect(commitCall.endpoint).toBe('http://localhost:3000')
    expect(commitCall.NetworkProperties.generationHash).toBe(null)
    expect(commitCall.NetworkProperties.healthy).toBe(true)
    expect(commitCall.NetworkProperties.height).toBe(1000)
    expect(commitCall.NetworkProperties.lastBlock).toBe(newBlock)
    expect(commitCall.NetworkProperties.lastBlocks).toStrictEqual([newBlock])
    expect(commitCall.NetworkProperties.lastBlockTimestamp).toBe(116060537287)
    expect(commitCall.NetworkProperties.loading).toBe(false)
    expect(commitCall.NetworkProperties.networkType).toBe(null)
    expect(commitCall.NetworkProperties.numTransactions).toBe(6)
    expect(commitCall.NetworkProperties.signerPublicKey).toBe('B70BBCE88F6471FF1E7D47E03ECAA3AD946C8AC4CF2A812E37853D6079563900')
    expect(commitCall.NetworkProperties.fee).toBe(666)
  })

  it('handleLastBlock should behave correctly when it has lastBlocks', () => {
    // @ts-ignore
    const networkProperties = NetworkProperties.create(store)
    // @ts-ignore
    const oldBlocks = {
      height: UInt64.fromUint(1000),
      numTransactions: 5,
      signer: {publicKey: 'AAAAACE88F6471FF1E7D47E03ECAA3AD946C8AC4CF2A812E37853D6079563900'},
      timestamp: UInt64.fromUint(1111111111),
      feeMultiplier: 10,
    }

    const newBlock = {
      height: UInt64.fromUint(1000),
      numTransactions: 6,
      signer: {publicKey: 'B70BBCE88F6471FF1E7D47E03ECAA3AD946C8AC4CF2A812E37853D6079563900'},
      timestamp: UInt64.fromUint(116060537287),
      feeMultiplier: 10,
    }
    // @ts-ignore
    networkProperties.lastBlocks = [...Array(maxDifficultyBlocks + 10)].map(() => oldBlocks)

    // @ts-ignore
    networkProperties.handleLastBlock(newBlock, 'http://localhost:3000')
    expect(mockDispatch.mock.calls[0][0]).toBe('SET_NETWORK_PROPERTIES')
    const commitCall = mockDispatch.mock.calls[0][1]
    expect(commitCall.endpoint).toBe('http://localhost:3000')
    expect(commitCall.NetworkProperties.generationHash).toBe(null)
    expect(commitCall.NetworkProperties.healthy).toBe(true)
    expect(commitCall.NetworkProperties.height).toBe(1000)
    expect(commitCall.NetworkProperties.lastBlock).toBe(newBlock)
    expect(commitCall.NetworkProperties.lastBlocks.length).toBe(maxDifficultyBlocks)
    expect(commitCall.NetworkProperties.lastBlocks[0]).toBe(newBlock)
    expect(commitCall.NetworkProperties.lastBlocks)
      .toStrictEqual([ newBlock, ...[...Array(maxDifficultyBlocks - 1)].map(() => oldBlocks) ])
    expect(commitCall.NetworkProperties.lastBlockTimestamp).toBe(116060537287)
    expect(commitCall.NetworkProperties.loading).toBe(false)
    expect(commitCall.NetworkProperties.networkType).toBe(null)
    expect(commitCall.NetworkProperties.numTransactions).toBe(6)
    expect(commitCall.NetworkProperties.signerPublicKey).toBe('B70BBCE88F6471FF1E7D47E03ECAA3AD946C8AC4CF2A812E37853D6079563900')
    expect(commitCall.NetworkProperties.fee).toBe(10)
  })

  it('handleLastBlock should set the correct median', () => {
    // @ts-ignore
    const networkProperties = NetworkProperties.create(store)
    // @ts-ignore
    const oldBlocks = {
      height: UInt64.fromUint(1000),
      numTransactions: 6,
      signer: {publicKey: 'B70BBCE88F6471FF1E7D47E03ECAA3AD946C8AC4CF2A812E37853D6079563900'},
      timestamp: UInt64.fromUint(11111111111),
      feeMultiplier: 15000,
    }

    const oldBlocksNoFee = {
      height: UInt64.fromUint(1000),
      numTransactions: 6,
      signer: {publicKey: 'B70BBCE88F6471FF1E7D47E03ECAA3AD946C8AC4CF2A812E37853D6079563900'},
      timestamp: UInt64.fromUint(2222222222222),
      feeMultiplier: 0,
    }

    const newBlock = {
      height: UInt64.fromUint(1000),
      numTransactions: 6,
      signer: {publicKey: 'B70BBCE88F6471FF1E7D47E03ECAA3AD946C8AC4CF2A812E37853D6079563900'},
      timestamp: UInt64.fromUint(3333333333333),
      feeMultiplier: 20000,
    }

    const mockLastBlocks = [
      ...[...Array(9)].map(() => oldBlocks),
      ...[...Array(10)].map(() => oldBlocksNoFee),
    ]

    // @ts-ignore
    networkProperties.lastBlocks = mockLastBlocks

    // @ts-ignore
    networkProperties.handleLastBlock(newBlock, 'http://localhost:3000')
    expect(mockDispatch.mock.calls[0][0]).toBe('SET_NETWORK_PROPERTIES')
    const commitCall = mockDispatch.mock.calls[0][1]
    expect(commitCall.endpoint).toBe('http://localhost:3000')
    expect(commitCall.NetworkProperties.generationHash).toBe(null)
    expect(commitCall.NetworkProperties.healthy).toBe(true)
    expect(commitCall.NetworkProperties.height).toBe(1000)
    expect(commitCall.NetworkProperties.lastBlock).toBe(newBlock)
    expect(commitCall.NetworkProperties.lastBlocks.length).toBe(20)
    expect(commitCall.NetworkProperties.lastBlocks[0]).toBe(newBlock)
    expect(commitCall.NetworkProperties.lastBlockTimestamp).toBe(3333333333333)
    expect(commitCall.NetworkProperties.loading).toBe(false)
    expect(commitCall.NetworkProperties.networkType).toBe(null)
    expect(commitCall.NetworkProperties.numTransactions).toBe(6)
    expect(commitCall.NetworkProperties.signerPublicKey)
      .toBe('B70BBCE88F6471FF1E7D47E03ECAA3AD946C8AC4CF2A812E37853D6079563900')
    expect(commitCall.NetworkProperties.fee).toBe(8000)
  })

  it('getTimeFromBlockNumber', () => {
    // @ts-ignore
    const networkProperties = NetworkProperties.create(store)
    networkProperties.initializeLatestBlocks([block29248], 'http://localhost:3000')
    expect(networkProperties.getTimeFromBlockNumber(29888)).not.toBeNull()
    expect(networkProperties.getTimeFromBlockNumber(29888).length > 0).toBeTruthy()
  })

  it('updateFromOfflineSettings', () => {
    // @ts-ignore
    const networkProperties = NetworkProperties.create(store)
    networkProperties.updateFromOfflineSettings(
      {generationHash: 'mockGenerationHash'},
      'mockEndpoint',
    )
    expect(mockDispatch.mock.calls[0][0]).toBe('SET_NETWORK_PROPERTIES')
    const commitCall = mockDispatch.mock.calls[0][1]
    expect(commitCall.endpoint).toBe('mockEndpoint')
    expect(commitCall.NetworkProperties.generationHash).toBe('mockGenerationHash')
  })
})
