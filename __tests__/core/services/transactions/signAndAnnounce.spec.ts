import {signAndAnnounce} from '@/core/services/transactions/signAndAnnounce.ts'
import {TransferTransaction, NetworkType, Deadline, Address, Mosaic, MosaicId, PlainMessage, UInt64} from 'nem2-sdk'
import {LockParams, SignTransaction, AppWallet} from '@/core/model'
import {transactionConfirmationObservable} from '@/core/services/transactions'
jest.mock('@/core/model/AppWallet')

const transaction = TransferTransaction.create(
 Deadline.create(),
 Address.createFromRawAddress('SBIWHDWZMPIXXM2BINCRXAK3H3MGA5VHB3D2PO5W'),
 [new Mosaic(new MosaicId([2429385668, 814683207]), new UInt64([0, 0]))],
 PlainMessage.create(''),
 NetworkType.TEST_NET,
)

describe('signAndAnnounce', () => {
 beforeEach(() => {
   // @ts-ignore
  AppWallet.mockClear();
 });


 it('should commit a staged transaction', () => {
  const commitMock = jest.fn()
  const store = {commit: commitMock}

  signAndAnnounce({
   transaction,
   // @ts-ignore
   store,
  })

  expect(commitMock.mock.calls).toHaveLength(1)
  expect(commitMock.mock.calls[0][0]).toEqual('SET_STAGED_TRANSACTION')
  expect(commitMock.mock.calls[0][1]).toStrictEqual({
   transactionToSign: transaction,
   isAwaitingConfirmation: true,
   lockParams: LockParams.default(),
  })
 })


 it('should resolve with proper values when signing fails', async (done) => {
  const commitMock = jest.fn()
  const store = {commit: commitMock}

  const result: SignTransaction = {
   success: false,
   signedTransaction: null,
   error: 'error message',
  }

  setImmediate(() => {
   transactionConfirmationObservable.next(result)
  })

  const {success, signedTransaction, error} = await signAndAnnounce({
   transaction,
   // @ts-ignore
   store,
  })

  expect(success).toBeFalsy()
  expect(signedTransaction).toBe(null)
  expect(error).toEqual('error message')
  expect(commitMock.mock.calls).toHaveLength(2)
  expect(commitMock.mock.calls[1][0]).toEqual('SET_STAGED_TRANSACTION')
  expect(AppWallet).not.toHaveBeenCalled();
  expect(commitMock.mock.calls[1][1]).toStrictEqual({
   transactionToSign: null,
   isAwaitingConfirmation: false,
   lockParams: LockParams.default(),
  })
  done()
 })


 it('should call announceTransaction when signing succeeds', async (done) => {
  const commitMock = jest.fn()
  const store = {
   commit: commitMock,
   state: {account: {wallet: 'mock wallet'}}
  }

  const result: SignTransaction = {
   success: true,
   // @ts-ignore
   signedTransaction: 'a signed transaction',
   error: null,
  }

  setImmediate(() => {
   transactionConfirmationObservable.next(result)
  })

  const {success, signedTransaction, error} = await signAndAnnounce({
   transaction,
   // @ts-ignore
   store,
  })

  expect(AppWallet).toHaveBeenCalledTimes(1);
   // @ts-ignore
  const announceTransactionMock = AppWallet.mock.instances[0].announceTransaction
  expect(success).toBeTruthy()
  expect(signedTransaction).toBe('a signed transaction')
  expect(error).toBe(null)
  expect(announceTransactionMock.mock.calls[0][0]).toBe('a signed transaction')
  expect(announceTransactionMock.mock.calls[0][1]).toEqual(store)
  expect(announceTransactionMock.mock.calls[0][2]).toBe(undefined)
  done()
 })


 it('should call announceTransaction when signing succeeds, with signedLock', async (done) => {
  const commitMock = jest.fn()
  const store = {
   commit: commitMock,
   state: {account: {wallet: 'mock wallet'}}
  }

  const result: SignTransaction = {
   success: true,
   // @ts-ignore
   signedTransaction: 'a signed transaction',
   error: null,
   // @ts-ignore
   signedLock: 'a signed lock',
  }

  setImmediate(() => {
   transactionConfirmationObservable.next(result)
  })

  const {success, signedTransaction, error, signedLock} = await signAndAnnounce({
   transaction,
   // @ts-ignore
   store,
   lockParams: new LockParams(true, 3)
  })

  expect(AppWallet).toHaveBeenCalledTimes(1);
   // @ts-ignore
  const announceTransactionMock = AppWallet.mock.instances[0].announceTransaction
  expect(success).toBeTruthy()
  expect(signedTransaction).toBe('a signed transaction')
  expect(error).toBe(null)
  expect(signedLock).toBe('a signed lock')
  expect(announceTransactionMock.mock.calls[0][0]).toBe('a signed transaction')
  expect(announceTransactionMock.mock.calls[0][1]).toEqual(store)
  expect(announceTransactionMock.mock.calls[0][2]).toBe('a signed lock')
  done()
 })
})