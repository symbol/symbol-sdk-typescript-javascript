export const mosaicTransactionTypeConfig: Array<{
    name: string,
    isSelected: boolean
}> = [
    {
        name: 'ordinary_account',
        isSelected: true
    }, {
        name: 'multi_sign_account',
        isSelected: false
    }
]

export const mosaicButtonConfig: Array<{
    name: string,
    isSelected: boolean
}> = [
    {
        name: 'mosaic_list',
        isSelected: true
    },
    {
        name: 'create_mosaic',
        isSelected: false
    }
]

export const mosaicSortType = {
    byId: 1,
    bySupply: 2,
    byDivisibility: 3,
    byTransferable: 4,
    bySupplyMutable: 5,
    byDuration: 6,
    byRestrictable: 7,
    byAlias: 8

}
