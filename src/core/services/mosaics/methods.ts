import {
    AccountHttp,
    Address,
    MosaicAmountView,
    MosaicService,
    MosaicHttp,
    MosaicId,
    Mosaic,
    MosaicInfo
} from 'nem2-sdk'
import {AppMosaic, AppWallet} from '@/core/model'
import {AccountApiRxjs} from "@/core/api/AccountApiRxjs"
import {MosaicApiRxjs} from "@/core/api/MosaicApiRxjs"

/**
 * Custom implementation for performance gains
 * @TODO: replace by SDK method when updated
 * https://github.com/nemtech/nem2-sdk-typescript-javascript/issues/247
 */
export const mosaicsAmountViewFromAddress = (node: string, address: Address): Promise<MosaicAmountView[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const accountHttp = new AccountHttp(node)
            const mosaicHttp = new MosaicHttp(node)
            const mosaicService = new MosaicService(accountHttp, mosaicHttp)

            const accountInfo = await accountHttp.getAccountInfo(address).toPromise()
            if (!accountInfo.mosaics.length) return []

            const mosaics = accountInfo.mosaics.map(mosaic => mosaic)
            const mosaicIds = mosaics.map(({id}) => new MosaicId(id.toHex()))
            const mosaicViews = await mosaicService.mosaicsView(mosaicIds).toPromise()

            const mosaicAmountViews = mosaics
                .map(mosaic => {
                    const mosaicView = mosaicViews
                        .find(({mosaicInfo}) => mosaicInfo.mosaicId.toHex() === mosaic.id.toHex())

                    if (mosaicView === undefined) throw new Error('A MosaicView was not found')
                    return new MosaicAmountView(mosaicView.mosaicInfo, mosaic.amount)
                })

            resolve(mosaicAmountViews)
        } catch (error) {
            reject(error)
        }
    })
}

export const initMosaic = (wallet, that) => {
    const {node, mosaicList, currentXEM1} = that
    const store = that.$store
    const address = Address.createFromRawAddress(wallet.address)

    return new Promise(async (resolve, reject) => {
        console.log('initMosaic called')
        try {
            const mosaicAmountViews = await mosaicsAmountViewFromAddress(node, address)
            const appMosaics = mosaicAmountViews.map(x => AppMosaic.fromMosaicAmountView(x))
            await store.commit('UPDATE_MOSAICS', appMosaics)
            new AppWallet(wallet).updateAccountBalance(mosaicList[currentXEM1].balance, store)
            await Promise.all([
                store.commit('SET_BALANCE_LOADING', false),
                store.commit('SET_MOSAICS_LOADING', false),
            ])
            resolve(true)
        } catch (error) {
            store.commit('SET_MOSAICS_LOADING', false)
            reject(error)
        }
    })
}

export const getMosaicList = async (address: string, node: string) => {
    let mosaicList: Mosaic[] = []
    await new AccountApiRxjs().getAccountInfo(address, node).toPromise().then(accountInfo => {
        mosaicList = accountInfo.mosaics
    }).catch((_) => {
        return
    })
    return mosaicList
}

export const getMosaicInfoList = async (node: string, mosaicList: Mosaic[], currentHeight: any, isShowExpired: boolean = true) => {
    let mosaicInfoList: MosaicInfo[] = []


    let mosaicIds: any = mosaicList.map((item) => {
        return item.id
    })
    await new MosaicApiRxjs().getMosaics(node, mosaicIds).toPromise().then(mosaics => {
        if (!isShowExpired) {
            mosaics.map((mosaic) => {
                const duration = mosaic['properties'].duration.compact()
                const createHeight = mosaic.height.compact()
                if (duration === 0 || duration + createHeight > Number(currentHeight)) {
                    mosaicInfoList.push(mosaic)
                }
            })
            return
        } else {
            mosaicInfoList = mosaics
        }
    }).catch((_) => {
        return
    })
    return mosaicInfoList
}

export const buildMosaicList = (mosaicList: Mosaic[], coin1: string, currentXem: string): any => {
    const mosaicListRst = mosaicList.map((mosaic: any) => {
        mosaic._amount = mosaic.amount.compact()
        mosaic.value = mosaic.id.toHex()
        if (mosaic.value == coin1) {
            mosaic.label = currentXem + ' (' + mosaic._amount + ')'
        } else {
            mosaic.label = mosaic.id.toHex() + ' (' + mosaic._amount + ')'
        }
        return mosaic
    })
    let isCoinExist = mosaicListRst.every((mosaic) => {
        if (mosaic.value == coin1) {
            return false
        }
        return true
    })
    if (isCoinExist) {
        mosaicListRst.unshift({
            value: coin1,
            label: 'nem.xem'
        })
    }
    return mosaicListRst
}
