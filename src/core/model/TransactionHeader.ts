import {Transaction, TransferTransaction, Address, TransactionType} from "nem2-sdk"
import {transactionTag} from "@/config"
import {formatNemDeadline, getRelativeMosaicAmount} from '@/core/utils'
import {transferIcons, transactionTypeToIcon} from '@/common/img/monitor/icons'

/**
 * Custom properties built from transaction headers
 */
export class TransactionHeader {
   /**
   * Active account is the recipient
   */
  isReceipt: boolean
  /**
   * Transaction tag
   */ 
  tag: string
  /**
   * Transaction blockTime
   */
  time: string // @TODO: make extrapolation method from blockNumber
  /**
   * Transaction date
   */
  date: Date
  /**
   * Absolute fee
   */
  fee: number
  /**
   * BlockNumber
   */
  block: number
  /**
   * Transaction Hash
   */
  hash: string

  /**
   * icon
   */
  icon:any

  constructor(transaction: Transaction, address: Address, currentXem: string, xemDivisibility: number) {
     this.isReceipt = transaction instanceof TransferTransaction
        && transaction.recipient instanceof Address // @TODO: handle namespaceId
        && transaction.recipient.plain()  === address.plain()
      
     this.tag = this.getTag(transaction)
     this.time = formatNemDeadline(transaction.deadline) 
     this.date = new Date(this.time)
     this.block = transaction.transactionInfo.height.compact()
     this.hash = transaction.transactionInfo.hash
     this.fee = getRelativeMosaicAmount(transaction.maxFee.compact(), xemDivisibility)
     this.icon = this.getIcon(transaction)
  }

  getTag(tx: Transaction) {
      if(tx.type === TransactionType.TRANSFER && this.isReceipt) return transactionTag.RECEIPT
      if(tx.type === TransactionType.TRANSFER && !this.isReceipt) return transactionTag.PAYMENT
      return transactionTag[tx.type]
  }

  getIcon(tx: Transaction) {
     if (tx.type === TransactionType.TRANSFER) {
         return this.isReceipt ? transferIcons.transferReceived : transferIcons.transferSent
     }

     return transactionTypeToIcon[tx.type]
  }
}