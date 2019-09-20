export const subNamespaceTypeConfig: Array<{
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

export const rootNamespaceTypeConfig = [
    {
        name: 'ordinary_account',
        isSelected: true
    }, {
        name: 'multi_sign_account',
        isSelected: false
    }
]

export const namespaceButtonConfig = [
    {
        name: 'Create_namespace',
        isSelected: true
    }, {
        name: 'Create_subNamespace',
        isSelected: false
    }, {
        name: 'Namespace_list',
        isSelected: false
    }
]
