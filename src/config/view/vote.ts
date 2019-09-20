export const voteFilterConfig: Array<{
    value: number,
    label: string
}> = [
        {
            value: 0,
            label: 'all'
        },
        {
            value: 1,
            label: 'processing'
        },
        {
            value: 2,
            label: 'already_involved'
        },
        {
            value: 3,
            label: 'finished'
        }
    ]

export const voteSelectionConfig = [
    {
        description: '1'
    }, {
        description: '2'
    }
]

export const voteActionConfig: Array<{
    name: string
    isSelect: boolean
}> = [
        {
            name: 'choose_to_vote',
            isSelect: true
        }, {
            name: 'create_a_vote',
            isSelect: false
        }
    ]
