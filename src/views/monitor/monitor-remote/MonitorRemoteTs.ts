import {Component, Vue, Watch} from 'vue-property-decorator';


@Component
export class MonitorRemoteTs extends Vue {
    modal1 = false
    modalMark = false
    switchMark = false
    switchState = false
    tableColumns = [

    ]
    aliasList = [

    ]

    changePage() {

    }

    modalOk() {

    }

    modalCancel() {
        this.modalMark = false
    }

    switchChan() {
        if (this.switchMark == false) {
            this.modalMark = true
        }
    }
}
