// import * as nodeuuid from "node-uuid";
// import * as crypto from 'crypto';
// import "reflect-metadata";
//
export var help = {
    //时间相关
    timeUnixMS: timeUnixMS,
    timeUnix: timeUnix,
    timeMan: timeMan,
    timeDay0MS: timeDay0MS,
    timeDay0S: timeDay0S,
    timeHour: timeHour,
    waitForMS: waitForMS,
    nextDay0MS: nextDay0MS,
    nextDay0S: nextDay0S,
    isToday: isToday,
    timeMonthUnix0MS: getFirstDayOfMonth0MS,
    timeMonthLastDayUnix0MS: getLastDayOfMonth0MS,
    timeLastMonthUnix0MS: getLastMathDayOMS,
    getFirstDayOfWeekMS: getFirstDayOfWeekMS,
    //数据类型扩展
    objExtend: objExtend,
    objClone: objClone,
    objCount: objCount,
    objValues: objValues,
    subArrByKey: subArrByKey,
    //数据类型校验方法
    isArray: isArray,
    isObj: isObj,
    isString: isString,
    isNumber: isNumber,
    isFunction: isFunction,
    isBoolean: isBoolean,
    isChineseString: isChineseString,
    isClass: isClass,
    isNullOrUndefined: isNullOrUndefined,
    isNullString: isNullString,
    isNullArray: isNullArray,
    //数学相关
    toFixed: toFixed,
    //字符串处理
    hideString: hideString,
};
function timeUnixMS(timeMan) {
    if (undefined !== timeMan) {
        return new Date(timeMan).getTime();
    }
    return Date.now();
}
// unix时间戳，例：1442499067
// 调用方式：timeUnix()或者timeUnix(timeMan)
function timeUnix(timeMan, timeZone) {
    if (undefined !== timeMan) {
        if (undefined !== timeZone) {
            //TODO: 处理时区
        }
        return Math.floor(new Date(timeMan).getTime() / 1000);
    }
    return Math.floor(Date.now() / 1000);
}
function timeMan(timeUnix) {
    var style = 'yyyy-MM-dd hh:mm:ss';
    if (timeUnix == undefined) {
        return formatDate(new Date(), style);
    }
    else {
        return formatDate(new Date(timeUnix * 1000), style);
    }
}
var oneHourMS = 60 * 60 * 1000;
var oneDayMS = 24 * oneHourMS;
//获取当月第一天0毫秒的时间戳
function getFirstDayOfMonth0MS(date, timeZone) {
    if (timeZone === void 0) { timeZone = 8; }
    date.setDate(1);
    return date.getTime() - ((date.getTime() + timeZone * oneHourMS) % oneDayMS);
}
//获取当月最后1天0毫秒的时间戳
function getLastDayOfMonth0MS(date, timeZone) {
    if (timeZone === void 0) { timeZone = 8; }
    var currentMonth = date.getMonth();
    var nextMonth = ++currentMonth;
    var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1).getTime();
    var oneDay = 1000 * 60 * 60 * 24;
    return new Date(nextMonthFirstDay - oneDay).getTime();
}
//获取上个月第一天0秒的时间戳
function getLastMathDayOMS(timeZone) {
    if (timeZone === void 0) { timeZone = 8; }
    var timeMS = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).getTime();
    return timeMS - ((timeMS + timeZone * oneHourMS) % oneDayMS);
}
//获取这周的周一时间戳
function getFirstDayOfWeekMS(date, timeZone) {
    if (timeZone === void 0) { timeZone = 8; }
    var day = date.getDay() || 7;
    var timeMS = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day).getTime();
    return timeMS - ((timeMS + timeZone * oneHourMS) % oneDayMS);
}
;
/**
 * 获取某日的第0毫秒
 * @param timeInDayMS 当天的任意时间戳
 * @param timeZone 时区, 默认+8
 */
function timeDay0MS(timeInDayMS, timeZone) {
    if (timeZone === void 0) { timeZone = 8; }
    return timeInDayMS - ((timeInDayMS + timeZone * oneHourMS) % oneDayMS);
}
function timeDay0S(timeInDayS, timeZone) {
    if (timeZone === void 0) { timeZone = 8; }
    return timeDay0MS(timeInDayS * 1000, timeZone) / 1000;
}
/**
 * 获取某日时间是第几小时
 * @param timeInDayS
 * @param timeZone
 * @returns 返回当地第几小时, 0-23
 */
function timeHour(timeInDayS, timeZone) {
    if (timeZone === void 0) { timeZone = 8; }
    return Math.floor((timeInDayS - timeDay0S(timeInDayS, timeZone)) / 3600);
}
/**
 * 获取某日的明天的第0毫秒
 * @param curDay0MS 当天的任意时间戳
 * @param timeZone 时区, 默认+8
 */
function nextDay0MS(curDay0MS, timeZone) {
    if (timeZone === void 0) { timeZone = 8; }
    return curDay0MS + oneDayMS - ((curDay0MS + timeZone * oneHourMS) % oneDayMS);
}
function nextDay0S(curDay0S, timeZone) {
    if (timeZone === void 0) { timeZone = 8; }
    return nextDay0MS(curDay0S * 1000, timeZone) / 1000;
}
/**
 * 判断给出的时间是否今天时间
 * @param timeMS
 * @param timeZone
 */
function isToday(timeMS, timeZone) {
    if (timeZone === void 0) { timeZone = 8; }
    return timeDay0MS(timeUnixMS(), timeZone) == timeDay0MS(timeMS, timeZone);
}
//等待x毫秒后执行回调
function waitForMS(timeMS) {
    return new Promise(function (resolve, reject) {
        if (timeMS <= 0) {
            return resolve();
        }
        //设置定时器
        return setTimeout(function () {
            return resolve();
        }, timeMS);
    });
}
/**
 * 格式化日期
 * @param date {Date}
 * @param style {string} 'yyyy-MM-dd hh:mm:ss';
 * @returns {*}
 */
function formatDate(date, style) {
    var y = date.getFullYear();
    var M = "0" + (date.getMonth() + 1);
    M = M.substring(M.length - 2);
    var d = "0" + date.getDate();
    d = d.substring(d.length - 2);
    var h = "0" + date.getHours();
    h = h.substring(h.length - 2);
    var m = "0" + date.getMinutes();
    m = m.substring(m.length - 2);
    var s = "0" + date.getSeconds();
    s = s.substring(s.length - 2);
    return style.replace("yyyy", y.toString())
        .replace('MM', M.toString())
        .replace('dd', d.toString())
        .replace('hh', h.toString())
        .replace('mm', m.toString())
        .replace('ss', s.toString());
}
function objExtend(target) {
    var objs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        objs[_i - 1] = arguments[_i];
    }
    if (target == null) {
        return target;
    }
    for (var i = 0; i < objs.length; i++) {
        var source = objs[i];
        for (var key in source) {
            target[key] = source[key];
        }
    }
    return target;
}
//深度拷贝对象
function objClone(obj) {
    if (!obj || 'object' != typeof obj) {
        return obj;
    }
    var newObj = Object.prototype.toString.call(obj) == '[object Array]' ? [] : {};
    for (var key in obj) {
        var value = obj[key];
        if (value && 'object' == typeof value) {
            //递归clone
            newObj[key] = objClone(value);
        }
        else {
            newObj[key] = value;
        }
    }
    return newObj;
}
function objCount(dic) {
    if (dic == null) {
        console.error(null, "传入参数为null！");
        return 0;
    }
    if (!isObj(dic)) {
        console.error(null, "传入参数不是object类型！参数：" + dic);
        return 0;
    }
    //1万个元素，耗时1ms内
    return Object.getOwnPropertyNames(dic).length;
}
function objValues(dic) {
    var values = [];
    for (var key in dic) {
        var value = dic[key];
        values.push(value);
    }
    return values;
}
function subArrByKey(arr, key, popNull) {
    if (popNull === void 0) { popNull = true; }
    var subArr = [];
    for (var i = 0; i < arr.length; i++) {
        if (null == arr[i]) {
            //如果不pop null对象, 则push一个null
            if (!popNull) {
                subArr.push(null);
            }
            continue;
        }
        subArr.push(arr[i][key]);
    }
    return subArr;
}
function isArray(obj) {
    if (obj == null) {
        return false;
    }
    return obj.constructor === Array;
}
function isObj(obj) {
    if (obj == null) {
        return false;
    }
    return obj.constructor === Object;
}
function isString(obj) {
    if (obj == null) {
        return false;
    }
    return obj.constructor === String;
}
function isNumber(obj) {
    if (obj == null) {
        return false;
    }
    return typeof (obj) == "number";
}
function isFunction(obj) {
    if (obj == null) {
        return false;
    }
    return typeof (obj) == 'function';
}
function isBoolean(obj) {
    if (null == obj) {
        return false;
    }
    return typeof (obj) == "boolean";
}
var regForChineseString = [
    /[\u3220-\uFA29]+/g,
    /[\u4E00-\u9FFF]+/g
];
function isChineseString(str) {
    for (var i = 0; i < regForChineseString.length; i++)
        if (regForChineseString[i].test(str)) {
            return true;
        }
    return false;
}
function isClass(obj, className) {
    if (!obj) {
        return false;
    }
    return className == obj.constructor.name;
}
function isNullOrUndefined(data) {
    return null === data || undefined === data;
}
function isNullString(str) {
    return null == str || '' == str;
}
function isNullArray(arr) {
    return null == arr || 0 > arr.findIndex(function (item) {
        return !isNullOrUndefined(item);
    });
}
function toFixed(num, fractionDigits) {
    return parseFloat(num.toFixed(fractionDigits));
}
/**
 * 隐藏字符串, 将起止区间的字符替换成另一个字符串
 * @param str
 * @param st 起始下标
 * @param len 区间长度, 默认到尾端
 * @param flag 替换字符
 */
function hideString(str, st, len, flag) {
    if (flag === void 0) { flag = '*'; }
    if (null == len) {
        len = str.length - st;
    }
    return "" + str.substr(0, st) + flag.repeat(len) + str.substr(st + len);
}
//# sourceMappingURL=help.js.map