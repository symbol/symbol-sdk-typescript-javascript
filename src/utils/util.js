import i18n from '../locale/index'
import Vue from 'vue'
import {AliasActionType, TransactionType} from 'nem2-sdk'

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
  let dayNum = ''
  let getTime = (newDate.getTime() - oldDate.getTime()) / 1000

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


export const addZero = function (number) {
  if (number < 10) {
    return '0' + number
  }
  return number
}

export const formatNemDeadline = function (deadline) {
  const dateTime = deadline.value._date
  const dayTime = deadline.value._time
  const date = `${addZero(dateTime._year)}-${addZero(dateTime._month)}-${addZero(dateTime._day)} `
  const time = ` ${addZero(dayTime._hour)}:${addZero(dayTime._minute)}:${addZero(dayTime._second)}`
  return date + time
}


export const formatTransactions = function (transactionList, accountPublicKey) {
  const that = this
  let transferTransaction = []
  transactionList.map((item) => {
    if (item.type == TransactionType.TRANSFER) {
      item.isReceipt = item.recipient.address == accountPublicKey ? true : false
      item.oppositeAddress = item.recipient.address == accountPublicKey ? item.signer.address : item.recipient.address
      item.target = 'my wallet name'
      item.time = formatNemDeadline(item.deadline)
      item.mosaic = item.mosaics.length == 0 ? false : item.mosaics[0]
      item.date = new Date(item.time)
      transferTransaction.push(item)
    }
  })
  return transferTransaction
}

export const getCurrentMonthFirst = function (date) {

  date.setDate(1);
  return date;
}

export const getCurrentMonthLast = function (date) {
  let currentMonth = date.getMonth();
  let nextMonth = ++currentMonth;
  let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
  let oneDay = 1000 * 60 * 60 * 24;
  return new Date(nextMonthFirstDay - oneDay);
}

export const isRefreshData = function (localstorageName, refreshTime, borderlineTime) {
  if (!localRead(localstorageName)) {
    return true
  }
  const currentTime = new Date()
  const currentTimestamp = currentTime.getTime()
  const marketPriceDataList = JSON.parse(localRead(localstorageName))
  const timeDifference = currentTimestamp - marketPriceDataList
  if (refreshTime < timeDifference || borderlineTime == 0) {
    return true
  }
  return false
}
export const formatSeconds = function (second) {
  let d = 0, h = 0, m = 0;

  if (second > 86400) {
    d = Math.floor(second / 86400);
    second = second % 86400;
  }
  if (second > 3600) {
    h = Math.floor(second / 3600);
    second = second % 3600;
  }
  if (second > 60) {
    m = Math.floor(second / 60);
    second = second % 60;
  }
  // let result = second + vueInstance.$t('time_second');
  let result = second + ' s '
  if (m > 0 || h > 0 || d > 0 ) {
    // result = m + vueInstance.$t('time_minute') + result;
    result = m + ' m ' + result;
  }
  if ( h > 0 || d > 0 ) {
    // result = h + vueInstance.$t('time_hour') + result;
    result = h + ' h ' + result;
  }
  if (d > 0 ) {
    // result = d + vueInstance.$t('time_day') + result;
    result = d + ' d ' + result;
  }

  return result;

}

