import i18n from './locale/index'
import Vue from 'vue'
import {AliasActionType} from 'nem2-sdk'

const vueInstance = new Vue({i18n})

export const localSave = (key, value) => {
  localStorage.setItem(key, value)
}

export const localRead = (key) => {
  return localStorage.getItem(key) || ''
}

export const localRemove = (key) => {
    localStorage.removeItem(key)
}

export const sessionSave = (key, value) => {
  sessionStorage.setItem(key, value)
}

export const sessionRead = (key) => {
  return sessionStorage.getItem(key) || ''
}

export const sessionRemove = (key) => {
  sessionStorage.removeItem(key)
}

export const formatDate = (timestamp) => {
  const now = new Date(Number(timestamp))
  let year = now.getFullYear()
  let month = now.getMonth() + 1
  month = month < 10 ? '0' + month : month
  let date = now.getDate()
  date = date < 10 ? '0' + date : date
  let hour = now.getHours()
  hour = hour < 10 ? '0' + hour : hour
  let minute = now.getMinutes()
  minute = minute < 10 ? '0' + minute : minute
  let second = now.getSeconds()
  second = second < 10 ? '0' + second : second
  return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
}

export const formatTime = (time) => {
  let oldDate = new Date(Number(time))
  let newDate = new Date()
  var dayNum = ''
  var getTime = (newDate.getTime() - oldDate.getTime()) / 1000

  if (getTime < 60 * 5) {
    dayNum = vueInstance.$t('just_now')
  } else if (getTime >= 60 * 5 && getTime < 60 * 60) {
    dayNum = parseInt(getTime / 60) + vueInstance.$t('m_ago')
  } else if (getTime >= 3600 && getTime < 3600 * 24) {
    dayNum = parseInt(getTime / 3600) + vueInstance.$t('h_ago')
  } else if (getTime >= 3600 * 24 && getTime < 3600 * 24 * 30) {
    dayNum = parseInt(getTime / 3600 / 24) + vueInstance.$t('d_ago')
  } else if (getTime >= 3600 * 24 * 30 && getTime < 3600 * 24 * 30 * 12) {
    dayNum = parseInt(getTime / 3600 / 24 / 30) + vueInstance.$t('month_ago')
  } else if (time >= 3600 * 24 * 30 * 12) {
    dayNum = parseInt(getTime / 3600 / 24 / 30 / 12) + vueInstance.$t('year_ago')
  }
  return dayNum
}
export const formatNamespaces = (namespacesInfo, blockHeight) => namespacesInfo.filter((ns, index, namespaces) => {
  for (let i = 0; i < index; i += 1) {
    if (ns === namespaces[i]) return false
  }
  return true
}).sort((a, b) => {
  const nameA = a.namespaceInfo.metaId
  const nameB = b.namespaceInfo.metaId
  if (nameA < nameB) {
    return -1
  }
  if (nameA > nameB) {
    return 1
  }
  return 0
}).map((ns, index, original) => {
  const name = ns.namespaceInfo.levels.map(level => original.find(n => n.namespaceInfo.id.equals(level))).map(n => {
    return n.namespaceName
  }).join('.')
  let aliasText
  let aliasType
  const expireWithin = ns.namespaceInfo.endHeight.compact() - blockHeight
  const expireText = expireWithin > 0 ? vueInstance.$t('after') + ` ${expireWithin.toLocaleString()} ` + vueInstance.$t('block_after') : vueInstance.$t('ago') + ` ${(-expireWithin).toLocaleString()} ` + vueInstance.$t('block_ago')
  return {
    name,
    hexId: ns.namespaceInfo.id.toHex().toUpperCase(),
    type: aliasType,
    alias: aliasText,
    expire: expireText,
    active: expireWithin > 0,
    expand: {
      isExpandMore: false,
      namespaceName: name,
      aliasActionType:
        ns.namespaceInfo.alias.type === 0 ? AliasActionType.Link : AliasActionType.Unlink,
      currentAliasType: ns.namespaceInfo.alias.type,
      currentAlias: ns.namespaceInfo.alias.type === 0 ? '' : aliasText
    }
  }
})

export const ActionType = {
  INCOMING: 'incoming',
  OUTGOING: 'outgoing'
}

export const TransferType = {
  MESSAGE: 'message',
  TRANSFER: 'transfer',
  MULTISIG: 'multisig'
}

export const PopupType = {
  TRANSACTION: 'transaction',
  MOSAIC: 'mosaic',
  MULTISIG: 'multisig'
}
