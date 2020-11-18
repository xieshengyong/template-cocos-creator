/*
 * Cocos Creator工具方法集
 * @Author: xieshengyong
 * @Date: 2020-08-27 15:30:54
 * @LastEditTime: 2020-11-17 18:26:36
 * @LastEditors: xieshengyong
 */

/**
 * 返回资源的绝对路径
 * @param {string} url 资源相对于‘resources’的路径 el: cc.url.raw('resources/bgm/spriteBgm.mp3')
 */
export const getResUrl = (url: string) => {
    let path = cc.url.raw(url);
    if (cc.loader.md5Pipe) {
        path = cc.loader.md5Pipe.transformURL(path);
    }
    return path;
};
