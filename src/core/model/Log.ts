import {AppState} from '@/core/model'
import {Store} from 'vuex'

export class Log {
    data: string
    date: Date

    constructor(
        public from: string,
        data: string | object,
    ) {
        this.data = data instanceof Object ? JSON.stringify(data) : JSON.stringify({data})
        this.date = new Date
    }

    static create(from: string, data: string | object, store: Store<AppState>) {
        store.commit('ADD_LOG', new Log(from, data))
    }
}
