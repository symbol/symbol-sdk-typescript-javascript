import Vue from 'vue'
import QRCode from 'qrcode'
import i18n from '../../language'
import {AliasActionType, TransactionType} from 'nem2-sdk'

const vueInstance = new Vue({i18n});

const getHandledValue = num => {
    return num < 10 ? '0' + num : num;
};
const isEarly = (timeStamp, currentTime) => {
    return timeStamp <= currentTime;
};
export const getUnion = (arr1, arr2) => {
    return Array.from(new Set([...arr1, ...arr2]))
};


const isMillisecond = timeStamp => {
    const timeStr = String(timeStamp);
    return timeStr.length > 10
};

const getDate = (timeStamp, startType) => {
    const d = new Date(timeStamp * 1000);
    const year = d.getFullYear();
    const month = getHandledValue(d.getMonth() + 1);
    const date = getHandledValue(d.getDate());
    const hours = getHandledValue(d.getHours());
    const minutes = getHandledValue(d.getMinutes());
    const second = getHandledValue(d.getSeconds());
    let resStr = '';
    if (startType === 'year') {
        resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second
    } else {
        resStr = month + '-' + date + ' ' + hours + ':' + minutes
    }
    return resStr
};

export const getRelativeTime = timeStamp => {
    const IS_MILLISECOND = isMillisecond(timeStamp);
    if (IS_MILLISECOND) Math.floor(timeStamp /= 1000);
    timeStamp = Number(timeStamp);
    const currentTime = Math.floor(Date.parse(new Date() + '') / 1000);
    const IS_EARLY = isEarly(timeStamp, currentTime);
    let diff = currentTime - timeStamp;
    if (!IS_EARLY) diff = -diff;
    let resStr = '';
    const dirStr = IS_EARLY ? vueInstance.$t('time_ago') : vueInstance.$t('time_after');
    if (diff <= 59) {
        resStr = diff + '' + vueInstance.$t('time_second') + dirStr
    } else if (diff > 59 && diff <= 3599) {
        resStr = Math.floor(diff / 60) + '' + vueInstance.$t('time_minute') + dirStr
    } else if (diff > 3599 && diff <= 86399) {
        resStr = Math.floor(diff / 3600) + '' + vueInstance.$t('time_hour') + dirStr
    } else if (diff > 86399 && diff <= 2623859) {
        resStr = Math.floor(diff / 86400) + '' + vueInstance.$t('time_day') + dirStr
    } else if (diff > 2623859 && diff <= 31567859 && IS_EARLY) {
        resStr = getDate(timeStamp, '')
    } else {
        resStr = getDate(timeStamp, 'year')
    }
    return resStr
};

export const copyTxt = (txt) => {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.setAttribute('readonly', 'readonly');
        input.setAttribute('value', txt);
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        resolve()
    })
};

export const formatNumber = (number) => {
    {
        if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(number)) {
            alert("wrong!");
            return number;
        }
        var a = RegExp.$1, b = RegExp.$2, c = RegExp.$3;
        // @ts-ignore
        var re = new RegExp('').compile("(\\d)(\\d{3})(,|$)");
        while (re.test(b)) b = b.replace(re, "$1,$2$3");
        return a + "" + b + "" + c;
    }
};

export const strToHexCharCode = (str) => {
    if (str === "")
        return "";
    var hexCharCode = [];
    for (var i = 0; i < str.length; i++) {
        hexCharCode.push((str.charCodeAt(i)).toString(16));
    }
    return hexCharCode.join("");
};

export const hexCharCodeToStr = (hexCharCodeStr) => {
    var trimedStr = hexCharCodeStr.trim();
    var rawStr =
        trimedStr.substr(0, 2).toLowerCase() === "0x"
            ?
            trimedStr.substr(2)
            :
            trimedStr;
    var len = rawStr.length;
    if (len % 2 !== 0) {
        alert("Illegal Format ASCII Code!");
        return "";
    }
    var curCharCode;
    var resultStr = [];
    for (var i = 0; i < len; i = i + 2) {
        curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
        resultStr.push(String.fromCharCode(curCharCode));
    }
    return resultStr.join("");
};


export const localSave = (key, value) => {
    localStorage.setItem(key, value)
};

export const localRead = (key) => {
    return localStorage.getItem(key) || ''
};

export const localRemove = (key) => {
    localStorage.removeItem(key)
};

export const sessionSave = (key, value) => {
    sessionStorage.setItem(key, value)
};

export const sessionRead = (key) => {
    return sessionStorage.getItem(key) || ''
};

export const sessionRemove = (key) => {
    sessionStorage.removeItem(key)
};

export const formatDate = (timestamp) => {
    const now = new Date(Number(timestamp));
    let year = now.getFullYear();
    let month = now.getMonth() + 1 + '';
    month = Number(month) < 10 ? '0' + month : month;
    let date = now.getDate() + '';
    date = Number(date) < 10 ? '0' + date : date;
    let hour = now.getHours() + '';
    hour = Number(hour) < 10 ? '0' + hour : hour;
    let minute = now.getMinutes() + '';
    minute = Number(minute) < 10 ? '0' + minute : minute;
    let second = now.getSeconds() + '';
    second = Number(second) < 10 ? '0' + second : second;
    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
};

export const formatTime = (time) => {
    let oldDate = new Date(Number(time));
    let newDate = new Date();
    let dayNum = '';
    let getTime = (newDate.getTime() - oldDate.getTime()) / 1000;

    if (getTime < 60 * 5) {
        dayNum = vueInstance.$t('just_now') + ''
    } else if (getTime >= 60 * 5 && getTime < 60 * 60) {
        dayNum = Number(getTime / 60).toFixed(0) + vueInstance.$t('m_ago')
    } else if (getTime >= 3600 && getTime < 3600 * 24) {
        dayNum = Number(getTime / 3600).toFixed(0) + vueInstance.$t('h_ago')
    } else if (getTime >= 3600 * 24 && getTime < 3600 * 24 * 30) {
        dayNum = Number(getTime / 3600 / 24).toFixed(0) + vueInstance.$t('d_ago')
    } else if (getTime >= 3600 * 24 * 30 && getTime < 3600 * 24 * 30 * 12) {
        dayNum = Number(getTime / 3600 / 24 / 30).toFixed(0) + vueInstance.$t('month_ago')
    } else if (time >= 3600 * 24 * 30 * 12) {
        dayNum = Number(getTime / 3600 / 24 / 30 / 12).toFixed(0) + vueInstance.$t('year_ago')
    }
    return dayNum
};
export const formatNamespaces = (namespacesInfo, blockHeight) => namespacesInfo.filter((ns, index, namespaces) => {
    for (let i = 0; i < index; i += 1) {
        if (ns === namespaces[i]) return false
    }
    return true
}).sort((a, b) => {
    const nameA = a.namespaceInfo.metaId;
    const nameB = b.namespaceInfo.metaId;
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
    }).join('.');
    let aliasText;
    let aliasType;
    const expireWithin = ns.namespaceInfo.endHeight.compact() - blockHeight;
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
});


export const addZero = function (number) {
    if (number < 10) {
        return '0' + number
    }
    return number
};

export const formatNemDeadline = function (deadline) {
    const dateTime = deadline.value._date;
    const dayTime = deadline.value._time;
    const date = `${addZero(dateTime._year)}-${addZero(dateTime._month)}-${addZero(dateTime._day)} `;
    const time = ` ${addZero(dayTime._hour)}:${addZero(dayTime._minute)}:${addZero(dayTime._second)}`;
    return date + time
};


export const formatTransactions = function (transactionList, accountAddress, currentXEM) {
    const that = this;
    let transferTransaction = [];
    transactionList.map((item) => {
        if (item.type == TransactionType.TRANSFER) {
            item.isReceipt = item.recipient.address == accountAddress;
            item.signerAddress = item.signer.address.address;
            item.recipientAddress = item.recipient.address;
            item.oppositeAddress = item.isReceipt ? item.signerAddress : item.recipient.address;
            item.time = formatNemDeadline(item.deadline);
            item.mosaic = item.mosaics.length == 0 ? false : item.mosaics[0];
            item.mosaicName = !item.mosaic || !item.mosaic.id || item.mosaic.id.id.toHex().toUpperCase() == currentXEM.toUpperCase() ? 'nem.xem' : item.mosaic.id.id.toHex().toUpperCase().slice(0, 8) + '...'
            item.date = new Date(item.time);
            transferTransaction.push(item)
        }
    });
    return transferTransaction
};

export const formatAddress = function (address) {
    let txt = '';
    let formatAress = [];
    address.split('').map((item, index) => {
        if ((index + 1) % 6 === 0) {
            txt += item + '-';
            formatAress.push(txt);
            txt = ''
        } else if (index === address.length - 1) {
            txt += item;
            formatAress.push(txt)
        } else {
            txt += item
        }

    });
    return formatAress.join('')
};

export const getCurrentMonthFirst = function (date) {

    date.setDate(1);
    return date;
};

export const getCurrentMonthLast = function (date) {
    let currentMonth = date.getMonth();
    let nextMonth = ++currentMonth;
    let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    let oneDay = 1000 * 60 * 60 * 24;
    return new Date(Number(nextMonthFirstDay) - oneDay);
};

export const isRefreshData = function (localstorageName, refreshTime, borderlineTime) {
    if (!localRead(localstorageName)) {
        return true
    }
    const currentTime = new Date();
    const currentTimestamp = currentTime.getTime();
    const marketPriceDataList = JSON.parse(localRead(localstorageName));
    const timeDifference = Number(currentTimestamp) - Number(marketPriceDataList.timestamp);
    if (refreshTime < timeDifference || borderlineTime == 0) {
        return true
    }
    return false
};
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
    if (m > 0 || h > 0 || d > 0) {
        // result = m + vueInstance.$t('time_minute') + result;
        result = m + ' m ' + result;
    }
    if (h > 0 || d > 0) {
        // result = h + vueInstance.$t('time_hour') + result;
        result = h + ' h ' + result;
    }
    if (d > 0) {
        // result = d + vueInstance.$t('time_day') + result;
        result = d + ' d ' + result;
    }

    return result;

};
export const formatXEMamount = (XEMamount) => {
    if (XEMamount.includes('.')) {
        const decimal = XEMamount.split('.')[1];
        if (decimal.length > 2) {
            return Number(XEMamount).toFixed(2)
        } else {
            return XEMamount
        }
    } else {
        return XEMamount
    }
};
