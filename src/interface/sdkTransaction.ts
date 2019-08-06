import {
  TransactionHttp, AccountHttp, TransferTransaction, Deadline, Address, UInt64,
  Message, AggregateTransaction, TransactionType
} from 'nem2-sdk'
import {SdkV0} from "./sdkDefine";

export const transactionInterface: SdkV0.transaction = {

  announce: async (params) => {
    const signature = params.signature;
    const node = params.node;
    const announceStatus = await new TransactionHttp(node).announce(signature);
    return {
      result: {
        announceStatus: announceStatus
      }
    };
  },

  transferTransaction: async (params) => {
    const network = params.network;
    const transactionType = TransactionType.TRANSFER;
    const deadline = Deadline.create();
    const MaxFee = UInt64.fromUint(params.MaxFee);
    const receive = Address.createFromRawAddress(params.receive);
    const mosaics = params.mosaics;
    const MessageType = params.MessageType;
    // @ts-ignore
    const message = await new Message(MessageType,params.message);
    const transferTransaction = await TransferTransaction.create(deadline,receive,mosaics,message,network,MaxFee);
    return {
      result: {
        transferTransaction: transferTransaction
      }
    };
  },

  aggregateCompleteTransaction: async (params) => {
    const network = params.network;
    const deadline = Deadline.create();
    const maxFee = UInt64.fromUint(params.MaxFee);
    const transactions = params.transactions;
    const aggregateCompleteTransaction = await AggregateTransaction.createComplete(
      deadline,
      transactions,
      network,
      [],
      maxFee,
    );
    return {
      result: {
        aggregateCompleteTransaction: aggregateCompleteTransaction
      }
    };
  },


  aggregateBondedTransaction: async (params) => {
    const network = params.network
    const deadline = Deadline.create()
    const transactions = params.transactions;
    const aggregateBondedTransaction = await AggregateTransaction.createBonded(
      deadline,
      transactions,
      network,
    );
    return {
      result: {
        aggregateBondedTransaction: aggregateBondedTransaction
      }
    };
  },


  getTransaction:async (params) => {
    const id = params.transactionId;
    const node = params.node;
    const transactionInfoThen = await new TransactionHttp(node).getTransaction(id);
    return {
      result: {
        transactionInfoThen: transactionInfoThen
      }
    };
  },

  getTransactionStatus: async (params) => {
    const hash = params.hash;
    const node = params.node;
    const transactionStatusThen = await new TransactionHttp(node).getTransactionStatus(hash);
    return {
      result: {
        transactionStatus: transactionStatusThen
      }
    };
  },

  transactions: async (params) => {
    const publicAccount = params.publicAccount;
    const queryParams = params.queryParams;
    const node = params.node;
    const transactions = await new AccountHttp(node).transactions(publicAccount,queryParams);
    return {
      result: {
        transactions: transactions
      }
    };
  },

  incomingTransactions: async (params) => {
    const publicAccount = params.publicAccount;
    const queryParams = params.queryParams;
    const node = params.node;
    const incomingTransactions = await new AccountHttp(node).incomingTransactions(publicAccount,queryParams);
    return {
      result: {
        incomingTransactions: incomingTransactions
      }
    };
  },

  outgoingTransactions: async (params) => {
    const publicAccount = params.publicAccount;
    const queryParams = params.queryParams;
    const node = params.node;
    const outgoingTransactions = await new AccountHttp(node).outgoingTransactions(publicAccount,queryParams);
    return {
      result: {
        outgoingTransactions: outgoingTransactions
      }
    };
  },

  unconfirmedTransactions: async (params) => {
    const publicAccount = params.publicAccount;
    const queryParams = params.queryParams;
    const node = params.node;
    const unconfirmedTransactions = await new AccountHttp(node).unconfirmedTransactions(publicAccount,queryParams);
    return {
      result: {
        unconfirmedTransactions: unconfirmedTransactions
      }
    };
  },

  getAggregateBondedTransactions: async (params) => {
    const publicAccount = params.publicAccount;
    const queryParams = params.queryParams;
    const node = params.node;
    const aggregateBondedTransactions = await new AccountHttp(node).aggregateBondedTransactions(publicAccount,queryParams);
    return {
      result: {
        aggregateBondedTransactions: aggregateBondedTransactions
      }
    };
  },

  announceAggregateBonded: async (params) => {
    const signedTransaction = params.signedTransaction;
    const node = params.node;
    const aggregateBondedTx = await new TransactionHttp(node).announceAggregateBonded(signedTransaction);
    return {
      result: {
        aggregateBondedTx: aggregateBondedTx
      }
    };
  },





}
