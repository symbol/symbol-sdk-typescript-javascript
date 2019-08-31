import {AccountHttp, Address} from 'nem2-sdk'
import {from as observableFrom} from 'rxjs'

export class RestrictionApiRxjs {
    getRestrictionInfo(node: string, address: string) {
        return observableFrom(new AccountHttp(node).getAccountRestrictions(Address.createFromRawAddress(address)))
    }

}
