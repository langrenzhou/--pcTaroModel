"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const lodash_1 = require("lodash");
const os_1 = require("os");
const isEmptyObject = function (obj) {
    if (obj == null) {
        return true;
    }
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};
exports.isEmptyObject = isEmptyObject;
const getRootPath = function () {
    return path.resolve(__dirname, '../../');
};
exports.getRootPath = getRootPath;
const zeroPad = function (num, places) {
    const zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join('0') + num;
};
exports.zeroPad = zeroPad;
const formatTime = function (date) {
    if (!date) {
        date = new Date();
    }
    else if (!(date instanceof Date)) {
        date = new Date(date);
    }
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${year}-${zeroPad(month, 2)}-${zeroPad(day, 2)} ${zeroPad(hour, 2)}:${zeroPad(minute, 2)}`;
};
exports.formatTime = formatTime;
const emptyObj = {};
exports.emptyObj = emptyObj;
const emptyTogglableObj = {
    enable: false,
    config: {}
};
exports.emptyTogglableObj = emptyTogglableObj;
const recursiveMerge = (src, ...args) => {
    return lodash_1.mergeWith(src, ...args, (value, srcValue, key, obj, source) => {
        const typeValue = typeof value;
        const typeSrcValue = typeof srcValue;
        if (typeValue !== typeSrcValue)
            return;
        if (Array.isArray(value) && Array.isArray(srcValue)) {
            return value.concat(srcValue);
        }
        if (typeValue === 'object') {
            return recursiveMerge(value, srcValue);
        }
    });
};
exports.recursiveMerge = recursiveMerge;
const isNpmPackage = (name) => !/^(\.|\/)/.test(name);
exports.isNpmPackage = isNpmPackage;
const addLeadingSlash = (url) => url.charAt(0) === '/' ? url : '/' + url;
exports.addLeadingSlash = addLeadingSlash;
const addTrailingSlash = (url) => url.charAt(url.length - 1) === '/' ? url : url + '/';
exports.addTrailingSlash = addTrailingSlash;
const formatOpenHost = host => {
    let result = host;
    // 配置host为0.0.0.0时,可以转换为ip打开, 其他以配置host默认打开
    if (result === '0.0.0.0') {
        // 设置localhost为初值, 防止没正确获取到host时以0.0.0.0打开
        result = 'localhost';
        const interfaces = os_1.networkInterfaces();
        for (const devName in interfaces) {
            const isEnd = interfaces[devName].some(item => {
                // 取IPv4, 不为127.0.0.1的内网ip
                if (item.family === 'IPv4' && item.address !== '127.0.0.1' && !item.internal) {
                    result = item.address;
                    return true;
                }
                return false;
            });
            // 若获取到ip, 结束遍历
            if (isEnd) {
                break;
            }
        }
    }
    return result;
};
exports.formatOpenHost = formatOpenHost;
