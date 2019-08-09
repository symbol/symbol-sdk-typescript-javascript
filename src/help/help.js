import Vue from 'vue';
import QRCode from 'qrcode';
import i18n from '../language/index';
import { AliasActionType, TransactionType } from 'nem2-sdk';
var vueInstance = new Vue({ i18n: i18n });
var getHandledValue = function (num) {
    return num < 10 ? '0' + num : num;
};
var isEarly = function (timeStamp, currentTime) {
    return timeStamp <= currentTime;
};
export var getUnion = function (arr1, arr2) {
    return Array.from(new Set(arr1.concat(arr2)));
};
var isMillisecond = function (timeStamp) {
    var timeStr = String(timeStamp);
    return timeStr.length > 10;
};
var getDate = function (timeStamp, startType) {
    var d = new Date(timeStamp * 1000);
    var year = d.getFullYear();
    var month = getHandledValue(d.getMonth() + 1);
    var date = getHandledValue(d.getDate());
    var hours = getHandledValue(d.getHours());
    var minutes = getHandledValue(d.getMinutes());
    var second = getHandledValue(d.getSeconds());
    var resStr = '';
    if (startType === 'year') {
        resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second;
    }
    else {
        resStr = month + '-' + date + ' ' + hours + ':' + minutes;
    }
    return resStr;
};
export var getRelativeTime = function (timeStamp) {
    var IS_MILLISECOND = isMillisecond(timeStamp);
    if (IS_MILLISECOND)
        Math.floor(timeStamp /= 1000);
    timeStamp = Number(timeStamp);
    var currentTime = Math.floor(Date.parse(new Date() + '') / 1000);
    var IS_EARLY = isEarly(timeStamp, currentTime);
    var diff = currentTime - timeStamp;
    if (!IS_EARLY)
        diff = -diff;
    var resStr = '';
    var dirStr = IS_EARLY ? vueInstance.$t('time_ago') : vueInstance.$t('time_after');
    if (diff <= 59) {
        resStr = diff + '' + vueInstance.$t('time_second') + dirStr;
    }
    else if (diff > 59 && diff <= 3599) {
        resStr = Math.floor(diff / 60) + '' + vueInstance.$t('time_minute') + dirStr;
    }
    else if (diff > 3599 && diff <= 86399) {
        resStr = Math.floor(diff / 3600) + '' + vueInstance.$t('time_hour') + dirStr;
    }
    else if (diff > 86399 && diff <= 2623859) {
        resStr = Math.floor(diff / 86400) + '' + vueInstance.$t('time_day') + dirStr;
    }
    else if (diff > 2623859 && diff <= 31567859 && IS_EARLY) {
        resStr = getDate(timeStamp, '');
    }
    else {
        resStr = getDate(timeStamp, 'year');
    }
    return resStr;
};
export var createQRCode = function (txt) {
    return new Promise(function (resolve) {
        QRCode.toDataURL(txt, { errorCorrectionLevel: 'H' }, function (err, url) {
            if (err) {
                resolve({
                    created: false,
                    url: ''
                });
            }
            else {
                resolve({
                    created: true,
                    url: url
                });
            }
        });
    });
};
export var copyTxt = function (txt) {
    return new Promise(function (resolve) {
        var input = document.createElement('input');
        input.setAttribute('readonly', 'readonly');
        input.setAttribute('value', txt);
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        resolve();
    });
};
export var formatNumber = function (number) {
    {
        if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(number)) {
            alert("wrong!");
            return number;
        }
        var a = RegExp.$1, b = RegExp.$2, c = RegExp.$3;
        // @ts-ignore
        var re = new RegExp('').compile("(\\d)(\\d{3})(,|$)");
        while (re.test(b))
            b = b.replace(re, "$1,$2$3");
        return a + "" + b + "" + c;
    }
};
export var strToHexCharCode = function (str) {
    if (str === "")
        return "";
    var hexCharCode = [];
    for (var i = 0; i < str.length; i++) {
        hexCharCode.push((str.charCodeAt(i)).toString(16));
    }
    return hexCharCode.join("");
};
export var hexCharCodeToStr = function (hexCharCodeStr) {
    var trimedStr = hexCharCodeStr.trim();
    var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x"
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
export var localSave = function (key, value) {
    localStorage.setItem(key, value);
};
export var localRead = function (key) {
    return localStorage.getItem(key) || '';
};
export var localRemove = function (key) {
    localStorage.removeItem(key);
};
export var sessionSave = function (key, value) {
    sessionStorage.setItem(key, value);
};
export var sessionRead = function (key) {
    return sessionStorage.getItem(key) || '';
};
export var sessionRemove = function (key) {
    sessionStorage.removeItem(key);
};
export var formatDate = function (timestamp) {
    var now = new Date(Number(timestamp));
    var year = now.getFullYear();
    var month = now.getMonth() + 1 + '';
    month = Number(month) < 10 ? '0' + month : month;
    var date = now.getDate() + '';
    date = Number(date) < 10 ? '0' + date : date;
    var hour = now.getHours() + '';
    hour = Number(hour) < 10 ? '0' + hour : hour;
    var minute = now.getMinutes() + '';
    minute = Number(minute) < 10 ? '0' + minute : minute;
    var second = now.getSeconds() + '';
    second = Number(second) < 10 ? '0' + second : second;
    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
};
export var formatTime = function (time) {
    var oldDate = new Date(Number(time));
    var newDate = new Date();
    var dayNum = '';
    var getTime = (newDate.getTime() - oldDate.getTime()) / 1000;
    if (getTime < 60 * 5) {
        dayNum = vueInstance.$t('just_now') + '';
    }
    else if (getTime >= 60 * 5 && getTime < 60 * 60) {
        dayNum = Number(getTime / 60).toFixed(0) + vueInstance.$t('m_ago');
    }
    else if (getTime >= 3600 && getTime < 3600 * 24) {
        dayNum = Number(getTime / 3600).toFixed(0) + vueInstance.$t('h_ago');
    }
    else if (getTime >= 3600 * 24 && getTime < 3600 * 24 * 30) {
        dayNum = Number(getTime / 3600 / 24).toFixed(0) + vueInstance.$t('d_ago');
    }
    else if (getTime >= 3600 * 24 * 30 && getTime < 3600 * 24 * 30 * 12) {
        dayNum = Number(getTime / 3600 / 24 / 30).toFixed(0) + vueInstance.$t('month_ago');
    }
    else if (time >= 3600 * 24 * 30 * 12) {
        dayNum = Number(getTime / 3600 / 24 / 30 / 12).toFixed(0) + vueInstance.$t('year_ago');
    }
    return dayNum;
};
export var formatNamespaces = function (namespacesInfo, blockHeight) { return namespacesInfo.filter(function (ns, index, namespaces) {
    for (var i = 0; i < index; i += 1) {
        if (ns === namespaces[i])
            return false;
    }
    return true;
}).sort(function (a, b) {
    var nameA = a.namespaceInfo.metaId;
    var nameB = b.namespaceInfo.metaId;
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
}).map(function (ns, index, original) {
    var name = ns.namespaceInfo.levels.map(function (level) { return original.find(function (n) { return n.namespaceInfo.id.equals(level); }); }).map(function (n) {
        return n.namespaceName;
    }).join('.');
    var aliasText;
    var aliasType;
    var expireWithin = ns.namespaceInfo.endHeight.compact() - blockHeight;
    var expireText = expireWithin > 0 ? vueInstance.$t('after') + (" " + expireWithin.toLocaleString() + " ") + vueInstance.$t('block_after') : vueInstance.$t('ago') + (" " + (-expireWithin).toLocaleString() + " ") + vueInstance.$t('block_ago');
    return {
        name: name,
        hexId: ns.namespaceInfo.id.toHex().toUpperCase(),
        type: aliasType,
        alias: aliasText,
        expire: expireText,
        active: expireWithin > 0,
        expand: {
            isExpandMore: false,
            namespaceName: name,
            aliasActionType: ns.namespaceInfo.alias.type === 0 ? AliasActionType.Link : AliasActionType.Unlink,
            currentAliasType: ns.namespaceInfo.alias.type,
            currentAlias: ns.namespaceInfo.alias.type === 0 ? '' : aliasText
        }
    };
}); };
export var addZero = function (number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
};
export var formatNemDeadline = function (deadline) {
    var dateTime = deadline.value._date;
    var dayTime = deadline.value._time;
    var date = addZero(dateTime._year) + "-" + addZero(dateTime._month) + "-" + addZero(dateTime._day) + " ";
    var time = " " + addZero(dayTime._hour) + ":" + addZero(dayTime._minute) + ":" + addZero(dayTime._second);
    return date + time;
};
export var formatTransactions = function (transactionList, accountAddress) {
    var that = this;
    var transferTransaction = [];
    transactionList.map(function (item) {
        if (item.type == TransactionType.TRANSFER) {
            item.isReceipt = item.recipient.address == accountAddress ? true : false;
            item.signerAddress = item.signer.address.address;
            item.recipientAddress = item.recipient.address;
            item.oppositeAddress = item.isReceipt ? item.signerAddress : item.recipient.address;
            item.target = 'my wallet name';
            item.time = formatNemDeadline(item.deadline);
            item.mosaic = item.mosaics.length == 0 ? false : item.mosaics[0];
            item.date = new Date(item.time);
            transferTransaction.push(item);
        }
    });
    return transferTransaction;
};
export var formatAddress = function (address) {
    var txt = '';
    var formatAress = [];
    address.split('').map(function (item, index) {
        if ((index + 1) % 6 === 0) {
            txt += item + '-';
            formatAress.push(txt);
            txt = '';
        }
        else if (index === address.length - 1) {
            txt += item;
            formatAress.push(txt);
        }
        else {
            txt += item;
        }
    });
    return formatAress.join('');
};
export var getCurrentMonthFirst = function (date) {
    date.setDate(1);
    return date;
};
export var getCurrentMonthLast = function (date) {
    var currentMonth = date.getMonth();
    var nextMonth = ++currentMonth;
    var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    var oneDay = 1000 * 60 * 60 * 24;
    return new Date(Number(nextMonthFirstDay) - oneDay);
};
export var isRefreshData = function (localstorageName, refreshTime, borderlineTime) {
    if (!localRead(localstorageName)) {
        return true;
    }
    var currentTime = new Date();
    var currentTimestamp = currentTime.getTime();
    var marketPriceDataList = JSON.parse(localRead(localstorageName));
    var timeDifference = Number(currentTimestamp) - Number(marketPriceDataList.timestamp);
    if (refreshTime < timeDifference || borderlineTime == 0) {
        return true;
    }
    return false;
};
export var formatSeconds = function (second) {
    var d = 0, h = 0, m = 0;
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
    var result = second + ' s ';
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
export var formatXEMamount = function (XEMamount) {
    if (XEMamount.includes('.')) {
        var decimal = XEMamount.split('.')[1];
        if (decimal.length > 2) {
            return Number(XEMamount).toFixed(2);
        }
        else {
            return XEMamount;
        }
    }
    else {
        return XEMamount;
    }
};
//# sourceMappingURL=help.js.map