import {signAndAnnounce} from '@/core/services/transactions/signAndAnnounce.ts'
import {TransferTransaction, NetworkType, Deadline, Address, Mosaic, MosaicId, PlainMessage, UInt64} from 'nem2-sdk'
import {LockParams, SignTransaction} from '@/core/model'
import {transactionConfirmationObservable} from '@/core/services/transactions'

const mockSignAndAnnounce = jest.fn()
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
    mockSignAndAnnounce.mockClear();
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
    expect(commitMock.mock.calls[1][1]).toStrictEqual({
      transactionToSign: null,
      isAwaitingConfirmation: false,
      lockParams: LockParams.default(),
    })
    done()
  })


  it('should call announceTransaction when signing succeeds', async (done) => {
    const commitMock = jest.fn()
    const mockAnnounceTransaction = jest.fn()

    const store = {
      commit: commitMock,
      state: {
        account: {
          wallet: {
            announceTransaction: (...args) => mockAnnounceTransaction(args),
          }
        }
      }
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

    expect(success).toBeTruthy()
    expect(signedTransaction).toBe('a signed transaction')
    expect(error).toBe(null)
    expect(mockAnnounceTransaction.mock.calls[0][0]).toStrictEqual([
      'a signed transaction',
      store,
      undefined,
    ])
    done()
  })


  it('should call announceTransaction when signing succeeds, with signedLock', async (done) => {
    const commitMock = jest.fn()
    const mockAnnounceTransaction = jest.fn()

    const store = {
      commit: commitMock,
      state: {
        account: {
          wallet: {
            announceTransaction: (...args) => mockAnnounceTransaction(args),
          }
        }
      }
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

    expect(success).toBeTruthy()
    expect(signedTransaction).toBe('a signed transaction')
    expect(error).toBe(null)
    expect(signedLock).toBe('a signed lock')
    expect(mockAnnounceTransaction.mock.calls[0][0]).toStrictEqual([
      'a signed transaction',
      store,
      'a signed lock',
    ])
    done()
  })
})