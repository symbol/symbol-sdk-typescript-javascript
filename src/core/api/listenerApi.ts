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
                        // console.log(block)
                        const {currentBlockInfo, preBlockInfo} = pointer.$store.state.app.chainStatus
                        // console.log(pointer.$store.state.app.chainStatus)
                        // console.log(block.timestamp.compact())
                        pointer.$store.state.app.chainStatus.preBlockInfo = currentBlockInfo   //pre
                        pointer.$store.state.app.chainStatus.numTransactions = block.numTransactions ? block.numTransactions : 0   //num
                        pointer.$store.state.app.chainStatus.signerPublicKey = block.signer.publicKey
                        pointer.$store.state.app.chainStatus.currentHeight = block.height.compact()    //height
                        pointer.$store.state.app.chainStatus.currentBlockInfo = block

                        if (preBlockInfo.timestamp) {
                            let currentGenerateTime = (block.timestamp.compact() - preBlockInfo.timestamp.compact()) / 1000    //time
                            pointer.$store.state.app.chainStatus.currentGenerateTime = currentGenerateTime.toFixed(0)
                            return
                        }
                        pointer.$store.state.app.chainStatus.currentGenerateTime = 12
                    },
                    err => {
                        // console.log(err)
                    }
                );
        }).catch((e) => {
            // console.log(e)
        })

        return {
            result: {
                blockInfo: ''
            }
        }
    }
}
