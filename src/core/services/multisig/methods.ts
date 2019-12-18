import {Store} from 'vuex'
import {AppState} from '@/core/model'
import {Address, MultisigHttp} from 'nem2-sdk'

export const setMultisigAccountMultisigAccountInfo = async (publicKey: string, store: Store<AppState>) => {
    const {node, wallet} = store.state.account
    const accountAddress = Address.createFromPublicKey(publicKey, wallet.networkType).plain()

    try {
        const multisigAccountInfo = await new MultisigHttp(node)
            .getMultisigAccountInfo(Address.createFromRawAddress(accountAddress))
            .toPromise()

        store.commit('SET_MULTISIG_ACCOUNT_INFO', {
            address: accountAddress, multisigAccountInfo,
        })
    } catch (error) {
        store.commit('SET_MULTISIG_ACCOUNT_INFO', {
            address: accountAddress, multisigAccountInfo: null,
        })
    }
}