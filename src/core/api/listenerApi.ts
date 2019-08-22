import {sdkApi} from "@/core/api/apis";
import {filter, mergeMap} from 'rxjs/operators'
import {TransactionHttp} from 'nem2-sdk'

export const listenerApi: sdkApi.ws = {
    openWs: async (params) => {
        const Observable = params.listener.open().catch((e) => {
            console.log(e)
        });
        return {
            result: {
                ws: Observable
            }
        }
    },
    listenerUnconfirmed: async (params) => {
        const listener = params.listener;
        listener.open().then(() => {
            listener
                .unconfirmedAdded(params.address)
                .pipe(
                    filter((transaction: any) => transaction.transactionInfo !== undefined)
                )
                .subscribe(transactionInfo => {
                    params.fn(transactionInfo)
                })
        }, err => {
            // console.log(err)
        }).catch((e) => {
            // console.log(e)
        })
        return {
            result: {
                ws: 'Ok'
            }
        }
    },
    listenerConfirmed: async (params) => {
        const listener = params.listener;
        listener.open().then(() => {
            listener
                .confirmed(params.address)
                .pipe(
                    filter((transaction: any) => transaction.transactionInfo !== undefined)
                )
                .subscribe(transactionInfo => {
                    params.fn(transactionInfo)
                })
        }, err => {
            // console.log(err)
        }).catch((e) => {
            // console.log(e)
        })
        return {
            result: {
                ws: 'Ok'
            }
        }
    },
    listenerTxStatus: async (params) => {
        const listener = params.listener;
        listener.open().then(() => {
            listener
                .status(params.address)
                .subscribe(transactionInfo => {
                    params.fn(transactionInfo)
                })
        }, err => {
            // console.log(err)
        }).catch((e) => {
            // console.log(e)
        })
        return {
            result: {
                ws: 'Ok'
            }
        }
    },
    sendMultisigWs: async (params) => {
        const listener = params.listener
        const transactionHttp = new TransactionHttp(params.node)
        listener.open().then(() => {
            transactionHttp
                .announce(params.signedLockTx)
            listener
                .confirmed(params.account.address)
                .pipe(
                    filter((transaction: any) => transaction.transactionInfo !== undefined
                        && transaction.transactionInfo.hash === params.signedLockTx.hash),
                    mergeMap(ignored => transactionHttp.announceAggregateBonded(params.signedBondedTx))
                )
                .subscribe(announcedAggregateBonded => {
                    },

                    // err =>
                    // console.error(err)
                )
        }).catch((e) => {
            // console.log(e)
        })
        return {
            result: {
                ws: 'hellow'
            }
        }
    },

    newBlock: async (params) => {
        const listener = params.listener
        const pointer = params.pointer
        listener.open().then(() => {
            listener
                .newBlock()
                .subscribe(
                    (block) => {
                        const {currentBlockInfo, preBlockInfo} = pointer.$store.state.app.chainStatus
                        const chainStatus = {
                            preBlockInfo: currentBlockInfo,
                            numTransactions: block.numTransactions ? block.numTransactions : 0,
                            signerPublicKey: block.signer.publicKey,
                            currentHeight: block.height.compact(),
                            currentBlockInfo: block,
                            currentGenerateTime: 12
                        }
                        if (preBlockInfo.timestamp) {
                            let currentGenerateTime = (block.timestamp.compact() - preBlockInfo.timestamp.compact()) / 1000    //time
                            chainStatus.currentGenerateTime = Number(currentGenerateTime.toFixed(0))
                        }
                        pointer.$store.commit('SET_CHAIN_STATUS', chainStatus)
                    },
                    err => {
                        // console.log(err)
                    }
                );
        }).catch((e) => {
        })

        return {
            result: {
                blockInfo: ''
            }
        }
    }
}
