export const monitorPanelNavigatorConfig: Array<{
    name: string,
    isSelect: boolean,
    path: string
}> = [
        {
            name: 'dash_board',
            isSelect: true,
            path: 'dashBoard'
        },
        {
            name: 'transfer',
            isSelect: false,
            path: 'transfer'
        },
        {
            name: 'Invoice',
            isSelect: false,
            path: 'invoice'
        },
        // {
        //     name: 'remote',
        //     isSelect: false,
        //     path: 'remote',
        // },
        {
            name: 'market',
            isSelect: false,
            path: 'market'
        },
    ]

export const monitorReceiptTransferTypeConfig = [
    {
        name: 'ordinary_transfer',
        isSelect: true,
        disabled: false
    }, {
        name: 'Multisig_transfer',
        isSelect: false,
        disabled: false
    }, {
        name: 'cross_chain_transfer',
        isSelect: false,
        disabled: true
    }, {
        name: 'aggregate_transfer',
        isSelect: false,
        disabled: true
    }
]

export const monitorTransferTransferTypeConfig = [
    {
        name: 'ordinary_transfer',
        isSelect: true,
        disabled: false
    }, {
        name: 'Multisig_transfer',
        isSelect: false,
        disabled: false
    }, {
        name: 'cross_chain_transfer',
        isSelect: false,
        disabled: true
    }, {
        name: 'aggregate_transfer',
        isSelect: false,
        disabled: true
    }
]
