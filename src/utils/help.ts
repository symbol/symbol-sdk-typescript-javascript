/**
 * tools
 */
import * as nodeuuid from "node-uuid";
import * as crypto from 'crypto';
import "reflect-metadata";


export const help = {

    //时间相关
    timeUnixMS: timeUnixMS,					//时间戳，单位：毫秒。示例：help.timeUnixMS();
	timeUnix: timeUnix,						//时间戳，单位：秒。可以和timeMan相互转换。示例：help.timeUnix(); 或者 help.timeUnix(help.timeMan());
	timeMan: timeMan,						//文本型时间戳，单位：秒。 可以和timeUnix相互转换。示例：help.timeMan(); 或者 help.timeMan(help.timeUnix());
	timeDay0MS: timeDay0MS,					//获取某日的第0毫秒
	timeDay0S: timeDay0S,
	timeHour: timeHour,						//获取时间小时
	waitForMS: waitForMS,    				//延迟毫秒
	nextDay0MS:nextDay0MS,                  //时间戳，下一天的时间戳
	nextDay0S:nextDay0S,
	isToday: isToday,						//判断给出时间是否今日
	timeMonthUnix0MS:getFirstDayOfMonth0MS, //获取当月第一天0毫秒的时间戳
	timeLastMonthUnix0MS:getLastMathDayOMS,//获取上个月第一天0毫秒的时间戳
	getFirstDayOfWeekMS:getFirstDayOfWeekMS,//获取这周周一的时间戳

	//数据类型扩展
	objExtend: objExtend,					//扩展object，示例：help.objExtend({a:1},{b:1},{c:1}); 结果：{a:1}将会变为{a:1,b:1,c:1}
	objClone: objClone,						//深度拷贝对象
	objCount: objCount,						//object的键值对数量【注意尽量不要在循环中使用，可以在遍历前先获取到】
	objValues: objValues, 					//object的值构成的数组
	subArrByKey: subArrByKey,				//提取数组中的子数组, 例: 取数组中以a为key的子数组 [{a:1},{a:2,b:5},{a:3}] => [1,2,3]

	//数据类型校验方法
	isArray: isArray,						//判断是否是数组
	isObj: isObj,							//判断是否是对象
	isString: isString,						//判断是否是文本
	isNumber: isNumber,						//判断是否是数字
	isFunction: isFunction,					//判断是否是方法
	isBoolean: isBoolean,    				//判断是否是bool
	isChineseString: isChineseString, 		//判断是否是中文字符串
	isClass: isClass, 						//判断是否为某个class
	isNullOrUndefined: isNullOrUndefined,	//判断是否为null或undefined
	isNullString: isNullString,				//判断是否空字符串
	isNullArray: isNullArray,				//判断是否空字符串

	//数学相关
	toFixed: toFixed,						//精确到的小数位数, 向下取整


	//并发
	uuid: uuid,			//全球唯一码

	//密码学
	md5: md5,		//md5加密 小写
	sha: sha,		//sha加密 小写
	hmac: hmac,		//hmac加密 小写

	//字符串处理
	hideString: hideString, //隐藏字符串
}

type helpTemp = typeof help;
//挂载到全局
global.help = help;
declare global{
    namespace NodeJS{
        interface Global{
            help: helpTemp;
        }
    }
    const help: helpTemp;
}




function timeUnixMS(timeMan?: string): number {
	if (undefined !== timeMan) {
		return new Date(timeMan).getTime();
	}
	return Date.now();
}

// unix时间戳，例：1442499067
// 调用方式：timeUnix()或者timeUnix(timeMan)
function timeUnix(timeMan?: string, timeZone?:number): number {
	if (undefined !== timeMan) {
		if(undefined !== timeZone){
			//TODO: 处理时区
		}
		return Math.floor(new Date(timeMan).getTime() / 1000);
	}
	return Math.floor(Date.now() / 1000);
}

function timeMan(timeUnix?: number): string {
	const style = 'yyyy-MM-dd hh:mm:ss';
	if (timeUnix == undefined) {
		return formatDate(new Date(), style);
	} else {
		return formatDate(new Date(timeUnix * 1000), style);
	}
}


const oneHourMS = 60*60*1000;
const oneDayMS = 24 * oneHourMS;

//获取当月第一天0毫秒的时间戳
function getFirstDayOfMonth0MS (date:Date,timeZone:number = 8):number{
	date.setDate(1);
	return date.getTime() - ((date.getTime()+timeZone*oneHourMS) % oneDayMS);
}
//获取上个月第一天0秒的时间戳
function getLastMathDayOMS(timeZone:number = 8):number{
	const timeMS=  new Date(new Date().getFullYear(), new Date().getMonth()-1, 1).getTime();
	return timeMS - ((timeMS+timeZone*oneHourMS) % oneDayMS);
}
//获取这周的周一时间戳
function getFirstDayOfWeekMS (date:Date,timeZone:number=8):number {
	var day = date.getDay() || 7;
	const timeMS  = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day).getTime();
    return timeMS - ((timeMS+timeZone*oneHourMS) % oneDayMS);
};

/**
 * 获取某日的第0毫秒
 * @param timeInDayMS 当天的任意时间戳
 * @param timeZone 时区, 默认+8
 */
function timeDay0MS(timeInDayMS:number, timeZone:number = 8): number {
	return timeInDayMS - ((timeInDayMS+timeZone*oneHourMS) % oneDayMS);
}
function timeDay0S(timeInDayS:number, timeZone:number = 8): number {
	return timeDay0MS(timeInDayS*1000, timeZone)/1000;
}
/**
 * 获取某日时间是第几小时
 * @param timeInDayS
 * @param timeZone
 * @returns 返回当地第几小时, 0-23
 */
function timeHour(timeInDayS:number,  timeZone:number = 8){
	return Math.floor( (timeInDayS - timeDay0S(timeInDayS,timeZone))/3600 );
}

/**
 * 获取某日的明天的第0毫秒
 * @param curDay0MS 当天的任意时间戳
 * @param timeZone 时区, 默认+8
 */
function nextDay0MS(curDay0MS:number, timeZone:number = 8): number{
	return curDay0MS+oneDayMS - ((curDay0MS+timeZone*oneHourMS) % oneDayMS);
}
function nextDay0S(curDay0S:number, timeZone:number = 8): number{
	return nextDay0MS(curDay0S*1000, timeZone)/1000;
}

/**
 * 判断给出的时间是否今天时间
 * @param timeMS
 * @param timeZone
 */
function isToday(timeMS:number, timeZone:number = 8){
	return timeDay0MS(timeUnixMS(),timeZone) == timeDay0MS(timeMS,timeZone);
}

//等待x毫秒后执行回调
function waitForMS(timeMS:number) {
	return new Promise((resolve,reject)=>{
		if(timeMS <= 0){
			return resolve();
		}
		//设置定时器
		return setTimeout(() => {
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
function formatDate(date: Date, style: string): string {
	let y = date.getFullYear();
	let M = "0" + (date.getMonth() + 1);
	M = M.substring(M.length - 2);
	let d = "0" + date.getDate();
	d = d.substring(d.length - 2);
	let h = "0" + date.getHours();
	h = h.substring(h.length - 2);
	let m = "0" + date.getMinutes();
	m = m.substring(m.length - 2);
	let s = "0" + date.getSeconds();
	s = s.substring(s.length - 2);
	return style.replace("yyyy", y.toString())
		.replace('MM', M.toString())
		.replace('dd', d.toString())
		.replace('hh', h.toString())
		.replace('mm', m.toString())
		.replace('ss', s.toString());
}



function objExtend<TType>(target: TType, ...objs:object[]): TType {
	if (target == null) {
		return target;
	}
	for (let i = 0; i < objs.length; i++) {
		const source = objs[i];
		for (let key in source) {
			target[key] = source[key];
		}
	}
	return target;
}

//深度拷贝对象
function objClone<TType>(obj: TType): TType {
	if (!obj || 'object' != typeof obj) {
		return obj;
	}
	const newObj:any = Object.prototype.toString.call(obj) == '[object Array]' ? [] : {};

	for (const key in obj) {
		const value = obj[key];
		if (value && 'object' == typeof value) {
			//递归clone
			newObj[key] = objClone(value);
		} else {
			newObj[key] = value;
		}
	}
	return newObj;
}

function objCount(dic: object): number {

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

function objValues(dic): any[] {
	var values = [];
	for (var key in dic) {
		var value = dic[key];
		values.push(value);
	}
	return values;
}

function subArrByKey<TObj, TKey extends keyof TObj>(arr: TObj[], key: TKey, popNull:boolean = true): TObj[TKey][] {
	const subArr:TObj[TKey][] = [];
	for (let i = 0; i < arr.length; i++) {
		if (null == arr[i]) {
			//如果不pop null对象, 则push一个null
			if(!popNull){
				subArr.push(null);
			}
			continue;
		}
		subArr.push(arr[i][key]);
	}
	return subArr;
}

function isArray(obj): boolean {
	if (obj == null) {
		return false;
	}
	return obj.constructor === Array;
}

function isObj(obj): boolean {
	if (obj == null) {
		return false;
	}
	return obj.constructor === Object;
}

function isString(obj): boolean {
	if (obj == null) {
		return false;
	}
	return obj.constructor === String;
}

function isNumber(obj): boolean {
	if (obj == null) {
		return false;
	}
	return typeof (obj) == "number";
}

function isFunction(obj): boolean {
	if (obj == null) {
		return false;
	}
	return typeof (obj) == 'function';
}

function isBoolean(obj): boolean {
	if (null == obj) {
		return false;
	}
	return typeof (obj) == "boolean";
}

const regForChineseString = [
	/[\u3220-\uFA29]+/g,
	/[\u4E00-\u9FFF]+/g
];
function isChineseString(str:string):boolean {
	for(let i=0; i<regForChineseString.length; i++)
	if(regForChineseString[i].test(str)){
		return true;
	}
	return false;
}

function isClass(obj:object, className:string):boolean {
	if (!obj) {
		return false;
	}
	return className == obj.constructor.name;
}

function isNullOrUndefined(data:any){
	return null === data || undefined === data;
}

function isNullString(str:string){
	return null == str || '' == str;
}

function isNullArray(arr:any[]){
	return null == arr || 0>arr.findIndex(item=>{
		return !isNullOrUndefined(item);
	});
}

function toFixed(num:number, fractionDigits:number):number{
	return parseFloat(num.toFixed(fractionDigits));
}


function uuid(): string {
	return nodeuuid.v4();
}

function md5(data:string){
	return crypto.createHash('md5').update(data).digest('hex').toLowerCase();
}

function sha(data:string, algorithm:'sha1'|'sha256'|'sha512' = 'sha1'){
	return crypto.createHash(algorithm).update(data).digest('hex').toLowerCase();
}

function hmac(data:string, key:string, algorithm:'sha1'|'sha256'|'sha512' = 'sha1'){
	return crypto.createHmac(algorithm, key).update(data).digest('hex').toLowerCase();
}

/**
 * 隐藏字符串, 将起止区间的字符替换成另一个字符串
 * @param str
 * @param st 起始下标
 * @param len 区间长度, 默认到尾端
 * @param flag 替换字符
 */
function hideString(str:string, st:number, len?:number, flag = '*'){
	if(null == len){
		len = str.length - st;
	}
	return `${str.substr(0,st)}${flag.repeat(len)}${str.substr(st+len)}`;
}
