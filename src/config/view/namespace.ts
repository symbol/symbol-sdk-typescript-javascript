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
        name: 'Namespace_list',
        isSelected: true
    }, {
        name: 'Create_namespace',
        isSelected: false
    }, {
        name: 'Create_subNamespace',
        isSelected: false
    }
]
