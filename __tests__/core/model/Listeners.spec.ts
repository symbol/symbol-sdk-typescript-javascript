import {Listeners} from '@/core/model/Listeners.ts'
import {Listener} from 'nem2-sdk/dist/src/infrastructure/Listener'
import {Address} from 'nem2-sdk'
import flushPromises from 'flush-promises'
import {of} from 'rxjs'
import {tap, mapTo} from 'rxjs/operators'
import {block1} from '../../../__mocks__/network/block1'
import {Notice, TRANSACTIONS_CATEGORIES, NoticeType, NetworkProperties} from '@/core/model'
import {formatAndSave} from '@/core/services'
import {Message, APP_PARAMS} from '@/config'
jest.mock('@/core/services/transactions')
jest.mock('@/core/model/Notice')

const mockListenerOpenCall = jest.fn()
const mockNewBlockCall = jest.fn()
const mockStatusCall = jest.fn()
const mockCosignatureAddedCall = jest.fn()
const mockAggregateBondedAddedCall = jest.fn()
const mockConfirmedCall = jest.fn()
const mockUnconfirmedAddedCall = jest.fn()
const mockTriggerNotice = jest.fn()
const mockListenerClose = jest.fn()
const mockCommit = jest.fn()
const mockNetworkPropertiesSetLastBlock = jest.fn()
const mockNetworkProperties = jest.fn().mockImplementation(function() {
  return {
    handleLastBlock: mockNetworkPropertiesSetLastBlock,
  }
})

const mockListenerOpen = () => {
 mockListenerOpenCall()
 return Promise.resolve()
}

const mockListenerOpenThrow = () => {
 mockListenerOpenCall()
 return Promise.reject()
}

Notice.trigger = mockTriggerNotice

const mockNewBlock = (args) => of(args).pipe(
 tap((args) => mockNewBlockCall(args)),
 mapTo(block1),
)

const mockStatus = (args) => of(args).pipe(
 tap((args) => mockStatusCall(args)),
 mapTo({status: 'this_is_a_transaction_error'}),
)

const mockCosignatureAdded = (args) => of(args).pipe(
 tap((args) => mockCosignatureAddedCall(args)),
 mapTo('mock'),
)

const mockAggregateBondedAdded = (args) => of(args).pipe(
 tap((args) => mockAggregateBondedAddedCall(args)),
 mapTo('mock'),
)

const mockConfirmedTransaction = {mock: 'a confirmed transaction', transactionInfo: 'mock'}

const mockConfirmed = (args) => of(args).pipe(
 tap((args) => mockConfirmedCall(args)),
 mapTo(mockConfirmedTransaction),
)

const mockUnconfirmedTransaction = {mock: 'an unconfirmed transaction', transactionInfo: 'mock'}

const mockUnconfirmedAdded = (args) => of(args).pipe(
 tap((args) => mockUnconfirmedAddedCall(args)),
 mapTo(mockUnconfirmedTransaction),
)

const {MAX_LISTENER_RECONNECT_TRIES} = APP_PARAMS

jest.mock('nem2-sdk/dist/src/infrastructure/Listener', () => ({
 Listener: jest.fn().mockImplementation((endpoint) => {
  if (endpoint === 'ws://errored.endpoint:3000') {
   return {
    open: mockListenerOpenThrow,
    close: mockListenerClose,
    confirmed: mockConfirmed,
    newBlock: mockNewBlock,
    status: mockStatus,
    cosignatureAdded: mockCosignatureAdded,
    aggregateBondedAdded: mockAggregateBondedAdded,
    unconfirmedAdded: mockUnconfirmedAdded,
   }
  }
  return {
   open: mockListenerOpen,
   close: mockListenerClose,
   confirmed: mockConfirmed,
   newBlock: mockNewBlock,
   status: mockStatus,
   cosignatureAdded: mockCosignatureAdded,
   aggregateBondedAdded: mockAggregateBondedAdded,
   unconfirmedAdded: mockUnconfirmedAdded,
  }
 })
}))

describe('Listeners', () => {
 beforeEach(() => {
  // @ts-ignore
  Listener.mockClear()
  // @ts-ignore
  mockNewBlockCall.mockClear()
  // @ts-ignore
  Notice.mockClear()
  mockStatusCall.mockClear()
  mockCosignatureAddedCall.mockClear()
  mockAggregateBondedAddedCall.mockClear()
  mockConfirmedCall.mockClear()
  mockUnconfirmedAddedCall.mockClear()
  mockCommit.mockClear()
  mockListenerClose.mockClear()
  mockListenerOpenCall.mockClear()
  mockNetworkPropertiesSetLastBlock.mockClear()
  mockNetworkProperties.mockClear()
 })

 const address = Address.createFromRawAddress('TCBIA24P5GO4QNI6H2TIRPXALWF7UKHPI6QOOVDM')
 const httpEndpoint = 'http://endpoint.com:3000'
 const wsEndpoint = 'ws://endpoint.com:3000'
 const httpsEndpoint = 'https://endpoint.com:3000'
 const wssEndpoint = 'wss://endpoint.com:3000'

 const store = {
  commit: mockCommit
 }

 it('switch endpoint should not call Listener if address is not set', () => {
  // @ts-ignore
      const listeners = Listeners.create(store, new mockNetworkProperties())
  listeners.switchEndpoint(httpEndpoint)
  // @ts-ignore
  expect(listeners.address).toBeUndefined()
  // @ts-ignore
  expect(listeners.wsEndpoint).toBe(wsEndpoint)
  expect(Listener).not.toHaveBeenCalled()
 });

 it('switch endpoint should handle https endpoints', () => {
  // @ts-ignore
      const listeners = Listeners.create(store, new mockNetworkProperties())
  listeners.switchEndpoint(httpsEndpoint)
  // @ts-ignore
  expect(listeners.wsEndpoint).toBe(wssEndpoint)
 });

 it('switch address should not call Listener if address is not set', () => {
  // @ts-ignore
      const listeners = Listeners.create(store, new mockNetworkProperties())
  listeners.switchAddress(address)
  // @ts-ignore
  expect(listeners.address).toEqual(address)
  // @ts-ignore
  expect(listeners.wsEndpoint).toBeUndefined()
  expect(Listener).not.toHaveBeenCalled()
 });

 it('switch address should not call Listener if address is not set', () => {
  // @ts-ignore
      const listeners = Listeners.create(store, new mockNetworkProperties())
  listeners.switchAddress(address)
  // @ts-ignore
  expect(listeners.address).toEqual(address)
  // @ts-ignore
  expect(listeners.wsEndpoint).toBeUndefined()
  expect(Listener).not.toHaveBeenCalled()
 });

 it('switchEndpoint should call stop and start if address is set', () => {
  // @ts-ignore
      const listeners = Listeners.create(store, new mockNetworkProperties())
  const mockStop = jest.fn()
  const mockStart = jest.fn()

  // @ts-ignore
  listeners.stop = mockStop
  // @ts-ignore
  listeners.start = mockStart
  // @ts-ignore

  listeners.switchAddress(address)
  listeners.switchEndpoint(httpEndpoint)
  // @ts-ignore
  expect(listeners.address).toEqual(address)
  // @ts-ignore
  expect(listeners.wsEndpoint).toEqual(wsEndpoint)
  expect(mockStop).toHaveBeenCalledTimes(1)
  expect(mockStart).toHaveBeenCalledTimes(1)
  expect(Listener).not.toHaveBeenCalled()
 });

 it('all listeners should make the proper calls', async (done) => {
  // @ts-ignore
  const listeners = Listeners.create(store, new mockNetworkProperties())
  listeners.switchEndpoint(httpEndpoint)
  listeners.switchAddress(address)
  await flushPromises()

  // @ts-ignore
  expect(listeners.address).toEqual(address)
  // @ts-ignore
  expect(listeners.wsEndpoint).toEqual(wsEndpoint)
  expect(Listener).toHaveBeenCalledTimes(1)

  setTimeout(() => {
   // @ts-ignore
   expect(Listener.mock.calls[0][0]).toBe(wsEndpoint)

   expect(mockNetworkProperties).toHaveBeenCalledTimes(1)
   expect(mockNetworkPropertiesSetLastBlock).toHaveBeenCalledTimes(1)
   expect(mockNetworkPropertiesSetLastBlock.mock.calls[0][0]).toBe(block1)

   expect(mockStatusCall).toHaveBeenCalledTimes(1)
   expect(mockStatusCall.mock.calls[0][0]).toEqual(address)
   expect(mockTriggerNotice.mock.calls[0][0]).toEqual('this is a transaction error')
   expect(mockTriggerNotice.mock.calls[0][1]).toEqual(NoticeType.error)


   expect(mockCosignatureAddedCall).toHaveBeenCalledTimes(1)
   expect(mockCosignatureAddedCall.mock.calls[0][0]).toEqual(address)
   expect(mockTriggerNotice.mock.calls[1][0]).toEqual(Message.NEW_COSIGNATURE)
   expect(mockTriggerNotice.mock.calls[1][1]).toEqual(NoticeType.success)


   expect(mockAggregateBondedAddedCall).toHaveBeenCalledTimes(1)
   expect(mockAggregateBondedAddedCall.mock.calls[0][0]).toEqual(address)
   expect(mockTriggerNotice.mock.calls[2][0]).toEqual(Message.NEW_AGGREGATE_BONDED)
   expect(mockTriggerNotice.mock.calls[2][1]).toEqual(NoticeType.success)

   expect(mockUnconfirmedAddedCall).toHaveBeenCalledTimes(1)
   expect(mockUnconfirmedAddedCall.mock.calls[0][0]).toEqual(address)
   expect(mockConfirmedCall).toHaveBeenCalledTimes(1)
   expect(mockConfirmedCall.mock.calls[0][0]).toEqual(address)

   expect(formatAndSave).toHaveBeenCalledTimes(2)
   // @ts-ignore
   expect(formatAndSave.mock.calls[0][0]).toEqual({...mockConfirmedTransaction, isTxConfirmed: true})
   // @ts-ignore
   expect(formatAndSave.mock.calls[0][1]).toEqual(store)
   // @ts-ignore
   expect(formatAndSave.mock.calls[0][2]).toBe(true)
   // @ts-ignore
   expect(formatAndSave.mock.calls[0][3]).toBe(TRANSACTIONS_CATEGORIES.NORMAL)
   // @ts-ignore
   expect(formatAndSave.mock.calls[1][0]).toEqual({...mockUnconfirmedTransaction, isTxConfirmed: false})
   // @ts-ignore
   expect(formatAndSave.mock.calls[1][1]).toEqual(store)
   // @ts-ignore
   expect(formatAndSave.mock.calls[1][2]).toBe(false)
   // @ts-ignore
   expect(formatAndSave.mock.calls[1][3]).toBe(TRANSACTIONS_CATEGORIES.NORMAL)
   expect(formatAndSave).toHaveBeenCalledTimes(2)
   done()
  }, 1);
 });

 it('stop should close the listener if listener is defined', () => {
  // @ts-ignore
  const listeners = Listeners.create(store, new mockNetworkProperties())

  listeners.switchEndpoint(httpEndpoint)
  listeners.switchAddress(address)
  // @ts-ignore
  listeners.stop()
  expect(mockListenerClose).toHaveBeenCalledTimes(1)
 })

 it('retry should call stop and start, and increment restartTimes by 1', async (done) => {
  // @ts-ignore
  const listeners = Listeners.create(store, new mockNetworkProperties())
  const mockStop = jest.fn()
  // @ts-ignore
  listeners.wsEndpoint = wsEndpoint
  // @ts-ignore
  listeners.address = address
  // @ts-ignore
  listeners.stop = mockStop
  // @ts-ignore
  expect(listeners.restartTimes).toBe(0)

  // @ts-ignore
  listeners.retry()

  await flushPromises()
  expect(mockStop).toHaveBeenCalledTimes(1)
  expect(mockListenerOpenCall).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(listeners.restartTimes).toBe(1)
  done()
 })

 it('retry should have no effect when MAX_LISTENER_RECONNECT_TRIES is reached', async (done) => {
  // @ts-ignore
  const listeners = Listeners.create(store, new mockNetworkProperties())
  const mockStop = jest.fn()
  // @ts-ignore
  listeners.wsEndpoint = wsEndpoint
  // @ts-ignore
  listeners.address = address
  // @ts-ignore
  listeners.stop = mockStop
  // @ts-ignore
  listeners.restartTimes = MAX_LISTENER_RECONNECT_TRIES
  // @ts-ignore
  expect(listeners.restartTimes).toBe(MAX_LISTENER_RECONNECT_TRIES)
  // @ts-ignore
  listeners.retry()

  await flushPromises()
  expect(mockStop).toHaveBeenCalledTimes(1)
  expect(mockListenerOpenCall).toHaveBeenCalledTimes(0)
  // @ts-ignore
  expect(listeners.restartTimes).toBe(MAX_LISTENER_RECONNECT_TRIES + 1)
  done()
 })

 it('retry should be called if the listener throws', async (done) => {
  const mockRetry = jest.fn()

  // @ts-ignore
  const listeners = Listeners.create(store, new mockNetworkProperties())
  // @ts-ignore
  listeners.retry = mockRetry
  listeners.switchAddress(address)
  listeners.switchEndpoint('ws://errored.endpoint:3000')
  await flushPromises()
  expect(mockRetry).toHaveBeenCalledTimes(1)
  done()
 })
});