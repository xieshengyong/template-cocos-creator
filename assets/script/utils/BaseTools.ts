/* eslint-disable max-params */
/*
 * 基础通用工具方法集
 * @Author: xieshengyong
 * @Date: 2020-08-27 15:05:24
 * @LastEditTime: 2020-11-18 11:25:19
 * @LastEditors: xieshengyong
 */

/**
 * 补位函数
 * @param {Number} num 数字
 * @param {*} n 位数，默认5
 */
export const pad = (num: number, n = 5): string => {
    return (Array(n).join('0') + num).slice(-n);
};

/** 获取m~n的随机数, 取整方向floor or ceil 默认floor */
export const getRandom = (m: number, n: number, Integer = 'floor'): number => {
    return Math[Integer](Math.random() * (n - m) + m);
};

/**
 * 为数字添加千位分隔符
 * el: formatNum(10001) => 10,001
 *     formatNum(123456789) => 123,456,789
 *  @param {number} num
 *  @param {string} dot 分隔符，默认英文逗号
 */
export const formatNum = (num: number, dot = ','): string => {
    return num.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
        return s + dot;
    });
};

/**
 * delay
 * @param {number} time Unit seconds
 */
export const delay = (time: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time * 1000);
    });
};

/**
 * 打乱数组，返回打乱后的新数组，不改变原数组
 * @param {array} arr 目标
 * @param {number} count 指定返回数量 默认全部
 */
export const shuffleArr = (arr: Array<any>, count: number) => {
    let m = arr.length;
    let i: number;
    let min = count ? (m - count) : 0;
    while (m) {
        i = (Math.random() * m--) >>> min;
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr.slice(min);
};

/**
 * 获取在一定范围内不重复的坐标，默认只计算500次，需合理指定范围
 * @param {array} start 起始坐标 [0, 0]
 * @param {array} end 结束坐标 [100, 100]
 * @param {array} notSamePool 不重复坐标数组 [[1, 1], [1, 2]]
 * @param {number} xRange x方向不重合范围`
 * @param {number} yRange y不重合范围
 */
export const getNotSamePosition = (start: number[], end: number[], notSamePool: any[], xRange: number, yRange: number) => {
    let isSame = true;
    let pos: number[];
    let time = 0;
    while (isSame && (time < 500)) {
        pos = [getRandom(start[0], end[0]), getRandom(start[1], end[1])];
        isSame = notSamePool.find(ele => {
            if (Math.abs(pos[0] - ele[0]) < xRange || Math.abs(pos[1] - ele[1]) < yRange) {
                return true;
            }
            return false;
        });
        time++;
    }
    time === 500 && console.error('范围指定不合理！运算超过500次');
    return pos;
};

export function isWx () {
    return typeof wx !== 'undefined';
}

export function getWinSize ():{width:number, height:number} {
    if (isWx()) {
        let winSize = wx.getSystemInfoSync();
        return {
            width: winSize.windowWidth,
            height: winSize.windowHeight
        };
    } else {
        let winSize = document.documentElement;
        return {
            width: winSize.clientWidth,
            height: winSize.clientHeight
        };
    }
}

export function saveLocalData (key, data) {
    isWx() ? wx.setStorage({ key: key, data: data }) : localStorage[key] = data;
}

export function getLocalData (key) {
    return isWx() ? wx.getStorageSync(key) : localStorage[key];
}

export function getQuery (target, name) {
    let m = target.match(new RegExp('(\\?|&)' + name + '=([^&]*)(&|$)'));
    return !m ? '' : m[2];
}

export function getLaunchQuery (query) {
    return wx.getLaunchOptionsSync().query[query];
};

export function addWxOnShow (cb, remove = false) {
    console.log('cb :>> ', cb);
    let wxOnShowCbs = [];
    // wx.onShow((res) => {
    //     wxOnShowCbs.forEach(ele => {
    //         ele?.(res);
    //     });
    // });

    return ((cb, remove) => {
        let cbIdx = wxOnShowCbs.findIndex(val => val === cb);
        if (cbIdx > -1) {
            remove && wxOnShowCbs.splice(cbIdx, 1);
            console.log('remove');
        } else {
            wxOnShowCbs.push(cb);
            console.log('push');
        }
        console.log('wxOnShowCbs :>> ', wxOnShowCbs);
    })(cb, remove);
}

export function getCanvas (width: number, height: number): [WechatMinigame.Canvas, CanvasRenderingContext2D] {
    let canvas = isWx() ? wx.createCanvas() : document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext('2d');
    // @ts-ignore
    return [canvas, ctx];
};


export function getImg (src: string): any {
    return new Promise((resolve, reject) => {
        let img = isWx() ? wx.createImage() : new Image();
        img.src = src;
        img.onload = () => {
            resolve(img);
        };
        img.onerror = () => reject;
    });
};
