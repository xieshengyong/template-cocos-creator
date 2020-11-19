/*
 * Cocos Creator工具方法集
 * @Author: xieshengyong
 * @Date: 2020-08-27 15:30:54
 * @LastEditTime: 2020-11-19 16:28:51
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

/**
* 获取两节点在世界坐标系下之间的距离差，返回cc.v2
*/
export const getNodeWorldDistance = (nodeA: cc.Node, nodeB: cc.Node): cc.Vec2 => {
    let pos1 = nodeA.convertToWorldSpaceAR(cc.v2(0, 0));
    let pos2 = nodeB.convertToWorldSpaceAR(cc.v2(0, 0));
    return pos2.sub(pos1);
};
