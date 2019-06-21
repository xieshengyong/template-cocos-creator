/*
 * @Author: xieshengyong
 * @Date: 2019-05-29 16:10:46
 * @Last Modified by: xieshengyong
 * @Last Modified time: 2019-06-09 13:04:38
 */
export default {
    /**
     * 隐藏
     * @param {*} para 节点或节点集合
     * @param {*} dur duration in seconds
     * @param {*} callback callback
     */
    hideNode (para, dur, callback) {
        if (para instanceof cc.Node) {
            if (dur) {
                para.runAction(cc.sequence(
                    cc.fadeOut(dur),
                    cc.callFunc(() => {
                        para.active = false;
                        callback && callback();
                    })
                ));
            } else {
                para.active = false;
                callback && callback();
            }
            return;
        }
        if (para instanceof Array) {
            para.forEach(element => {
                this.hideNode(element, dur);
            });
            setTimeout(() => {
                callback && callback();
            }, dur * 1000);
        }
    },

    /**
     * 显示
     * @param {*} para 节点或节点集合
     * @param {*} dur duration in seconds
     * @param {*} callback callback
     */
    showNode (para, dur, callback) {
        if (para instanceof cc.Node) {
            para.active = true;
            if (dur) {
                para.opacity = 0;
                para.runAction(cc.sequence(cc.fadeIn(dur), cc.callFunc(() => {
                    callback && callback();
                })));
            } else {
                para.opacity = 255;
                callback && callback();
            }
            return;
        }
        if (para instanceof Array) {
            para.forEach(element => {
                this.showNode(element, dur);
            });
            setTimeout(() => {
                callback && callback();
            }, dur * 1000);
        }
    },

    /**
     * 闪烁一个节点
     * @param {*} nodes 节点或节点数组
     * @param {*} from opacity开始值
     * @param {*} to opacity结束值
     * @param {*} dur 总时间
     * @param {*} ease1 前半段缓动函数
     * @param {*} ease2 后半段缓动函数
     * @param {*} repeat 重复次数 默认1000
     */
    flickerNode (nodes, from, to, dur, ease1, ease2, repeat) {
        if (nodes instanceof cc.Node) {
            nodes.active = true;
            nodes.opacity = from;
            nodes.runAction(cc.repeat(cc.sequence(
                cc.fadeTo(dur / 2, to).easing(ease1 || cc.easeIn(1.2)),
                cc.fadeTo(dur / 2, from).easing(ease2 || ease1 || cc.easeOut(1.1))
            ), repeat || 1000));
            return;
        }
        if (nodes instanceof Array) {
            nodes.forEach(element => {
                this.flickerNode(element, from, to, dur, ease1, ease2);
            });
        }
    },

    /**
     * 上下左右浮动动画
     * @param {*} target 目标
     * @param {*} mx X浮动距离
     * @param {*} my Y浮动距离
     * @param {*} dur 时间 默认0.5
     * @param {*} ease1 缓动函数 默认cc.easeInOut(2)
     * @param {*} ease2 缓动函数 默认cc.easeInOut(2)
     * @param {*} delayTime 循环之间延时 默认0
     */
    runFloatAni (target, mx, my, dur, ease1, ease2, delayTime) {
        target.runAction(cc.repeat(cc.sequence(
            cc.delayTime(delayTime || 0),
            cc.moveBy(dur || 0.5, -mx, -my).easing(ease1 || cc.easeInOut(2)),
            cc.moveBy(dur || 0.5, mx, my).easing(ease2 || cc.easeInOut(2))
        ), 1000));
    },

    // 点击播放动画
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
    }
};
