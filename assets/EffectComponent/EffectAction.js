/* eslint-disable max-params */
import AC from "../Script/utils/AC";

let Transition = cc.Enum({
    none: 0,
    fadeIn: 1,
    fadeOut: 2,
    flicker: 3,
    popup: 4,
});

let effectHandle = cc.Class({
    name: 'effectHandle',

    properties: {
        eventName: '',
        effectName: {
            default: Transition.none,
            type: Transition,
        }
    },
});

cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Node
        },
        hide: false,
        effects: {
            default: [],
            type: [effectHandle],
            tooltip: '触发target自定义事件，传入要动画时间'
        },
    },

    onLoad () {
        let target = this.target;
        this.effects.forEach(ele => {
            target.on(ele.eventName, this[Transition[ele.effectName]].bind(this));
        });
        this.anim = this.node.getComponent(cc.Animation);
        this.hide && (this.node.active = false);
    },

    start () {
    },

    fadeOut (duration, callback, delay) {
        AC.hideNode(this.node, duration || 0.3, () => {
            this.node.stopAllActions();
            callback?.();
            this.anim?.stop();
        }, delay);
    },

    fadeIn (duration, callback, delay) {
        AC.showNode(this.node, duration || 0.3, () => {
            // this.anim && (this.anim.enabled = true);
            this.anim?.play();
            callback?.();
        }, delay);
    },

    flicker (from, to, duration, repeat) {
        AC.flickerNode(this.node, from || 0, to || 255, duration || 1.2, null, null, repeat);
    },

    popup (duration, ease) {
        AC.popup(this.node, duration, ease);
    }

    // update (dt) {},
});
