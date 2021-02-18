/* eslint-disable max-params */
/*
 * @Author: xieshengyong
 * @Date: 2019-05-29 16:10:46
 * @LastEditTime: 2020-12-30 20:03:47
 * @LastEditors: xieshengyong
 */

export default {
    /**
     * 隐藏
     * @param {*} para 节点或节点集合
     * @param {*} dur duration in seconds; default: 0
     * @param {*} callback callback
     */
    hideNode (para: cc.Node | cc.Node[], dur: number, callback?: Function, delay = 0) {
        return new Promise<void>((resolve, reject) => {
            let cb = callback;
            this._orderly(para, (node) => {
                cc.tween(node)
                    .delay(delay)
                    .to(dur, {opacity: 0})
                    .call(() => {
                        node.active = false;
                        cb?.();
                        cb = null;
                        resolve();
                    })
                    .start();
            });
        });
    },

    /**
     * 显示
     * @param {*} para 节点或节点集合
     * @param {*} dur duration in seconds
     * @param {*} callback callback
     */
    showNode (para: cc.Node[] | cc.Node, dur: number, callback?: Function, delay = 0) {
        return new Promise<void>((resolve, reject) => {
            let cb = callback;
            this._orderly(para, (node) => {
                node.opacity = 0;
                node.active = true;
                cc.tween(node)
                    .delay(delay)
                    .to(dur, {opacity: 255})
                    .call(() => {
                        cb?.();
                        cb = null;
                        resolve();
                    })
                    .start();
            });
        });
    },

    /**
     * 闪烁一个节点
     * @param {*} nodes 节点或节点数组
     * @param {number} from opacity开始值
     * @param {number} to opacity结束值
     * @param {number} dur 总时间
     * @param {*} ease1 前半段缓动函数
     * @param {*} ease2 后半段缓动函数
     * @param {*} repeat 重复次数 默认1000
     */
    flickerNode (nodes: cc.Node[] | cc.Node, from: number, to: number, dur: number, ease1 = 'sineIn', ease2 = 'sineOut', repeat = 1000) {
        this._orderly(nodes, (node) => {
            node.active = true;
            node.opacity = from;
            cc.tween(node)
                .repeat(
                    repeat,
                    cc.tween()
                        .to(dur / 2, { opacity: to }, { easing: ease1 })
                        .to(dur / 2, { opacity: from }, { easing: ease2 })
                )
                .start();
        });
    },

    /**
     * 上下左右浮动动画
     * @param {*} nodes 目标
     * @param {*} mx X浮动距离
     * @param {*} my Y浮动距离
     * @param {*} dur 时间 默认0.5
     * @param {*} ease1 缓动函数 默认cc.easeInOut(2)
     * @param {*} ease2 缓动函数 默认cc.easeInOut(2)
     * @param {*} delayTime 循环之间延时 默认0
     */
    runFloatAni (nodes: cc.Node[] | cc.Node, mx: number, my: number, dur = 0.5, ease1 = 'sineInOut', ease2 = 'sineInOut', delayTime = 0) {
        this._orderly(nodes, (node) => {
            cc.tween(node)
                .delay(delayTime)
                .repeatForever(
                    cc.tween()
                        .by(dur, {x: -mx, y: -my}, {easing: ease1})
                        .by(dur, {x: mx, y: my}, {easing: ease2})
                )
                .start();
        });
    },

    /**
     * 下落动画，下落到原本的位置，
     * @param {*} target
     * @param {*} danceY 下落的距离
     * @param {*} dur
     * @param {*} callback
     * @param {*} ease
     * @param {*} delayTime
     */
    dropAni (target: cc.Node, danceY: number, dur = 0.5, callback?: Function, ease = 'backOut', delayTime = 0) {
        target.y -= danceY;
        cc.tween(target)
            .delay(delayTime)
            .by(dur, { y: danceY }, { easing: ease })
            .call(callback)
            .start();
    },

    /** 弹出动画 */
    popup (target: cc.Node, duration = 0.4, cb?: Function, from = 0, to = 1, ease = 'backOut') {
        target.scale = from;
        target.active = true;
        target.opacity = 255;
        cc.tween(target)
            .to(duration, {scale: to}, {easing: ease})
            .call(() => {
                cb?.();
            })
            .start();
    },

    /** 点击播放动画 */
    playWithTap (node, animation, animationState, name, Reverse) {
        node.on('touchstart', () => {
            animation.play(name || '0');
        });
        animationState.repeatCount = 1;
        // if (Reverse) {
        // animationState.WrapMode = cc.
        // }
    },

    /**
     * 点击反馈动画
     * @param {*} para 节点或节点集合
     * @param {*} dur 时间default：0.1*2
     * @param {*} imd 是否立即执行
     */
    tapAni (para, dur, imd) {
        if (para instanceof cc.Node) {
            let action = cc.sequence(
                cc.scaleTo(0.1, 0.8),
                cc.scaleTo(0.1, 1)
            );
            if (!imd) {
                para.on('touchstart', () => {
                    para.runAction(action);
                });
            } else {
                para.runAction(action);
            }
            return;
        }
        if (para instanceof Array) {
            para.forEach(element => {
                this.tapAni(element, dur, imd);
            });
        }
    },

    /**
     * 仿3D旋转
     * @param {*} nodes 节点或集合
     * @param {*} dur 一圈的时间
     */
    turnPlan (nodes: cc.Node[] | cc.Node, dur: number) {
        this._orderly(nodes, (node: cc.Node) => {
            node.runAction(cc.repeatForever(cc.sequence(
                cc.scaleTo(dur / 2, -1, 1).easing(cc.easeInOut(2)),
                cc.scaleTo(dur / 2, 1, 1).easing(cc.easeInOut(2)),
            )));
        });
    },

    /**
     * 统一参数类型
     * @param {*} nodes
     * @param {*} callback
     */
    _orderly (nodes: cc.Node[] | cc.Node, callback: Function) {
        let nodeArr = nodes instanceof Array ? nodes : [nodes];
        nodeArr.forEach((ele: cc.Node) => {
            callback?.(ele);
        });
    }
};
