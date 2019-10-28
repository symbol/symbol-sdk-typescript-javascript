import {localRead, localSave} from '.'

export const saveLocalAlias = (
    address: string,
    aliasObject: {
        tag: string,
        alias: string,
        address: string
    }) => {
    const addressBookData = localRead('addressBook')
    let addressBook = addressBookData ? JSON.parse(addressBookData) : {}
    addressBook[address] = addressBook[address] || {}
    addressBook[address]['aliasMap'] = addressBook[address]['aliasMap'] || {}
    addressBook[address]['aliasMap'][aliasObject.alias] = aliasObject

    addressBook[address]['tagMap'] = addressBook[address]['tagMap'] || {}
    addressBook[address]['tagMap'][aliasObject.tag] = addressBook[address]['tagMap'][aliasObject.tag] || []
    addressBook[address]['tagMap'][aliasObject.tag].push(aliasObject.alias)

    localSave('addressBook', JSON.stringify(addressBook))
}


export const readLocalAliasInAddressBook = (address: string) => {
    const addressBookData = localRead('addressBook')
    if (!addressBookData) return {}
    return JSON.parse(addressBookData)[address]
}

export const removeLinkInAddressBook = (aliasObject, address) => {
    const {alias, tag} = aliasObject
    const addressBook = JSON.parse(localRead('addressBook'))
    delete addressBook[address].aliasMap[alias]
    addressBook[address].tagMap[tag].splice(addressBook[address].tagMap[tag].indexOf(alias), 1)
    localSave('addressBook', JSON.stringify(addressBook))
}
