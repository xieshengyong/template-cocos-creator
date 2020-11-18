// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        distance: {
            default: 10,
            displayName: '抖动幅度',
            type: cc.Float
        },
        speed: {
            default: 1,
            displayName: '抖动速率',
            type: cc.Float,
        },
        repeatInterval: {
            default: 0,
            displayName: '抖动间隔',
            type: cc.Float,
            tooltip: '两次抖动的时间间隔'
        },
        playOnLoad: {
            default: false,
            displayName: '立即开始',
            tooltip: '是否在组件加载后自动运行'
        },
        repeatTimes: {
            default: 1,
            displayName: '重复次数',
            type: cc.Integer,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (this.playOnLoad) this.shakeStart();
    },

    start () {
    },

    shakeStart () {
        var sv = cc.v2(0, this.distance);
        let time = 0.02 * 1 / this.speed;
        if (this.isAtion) {
            this.node.stopAllActions();
            this.isAtion = false;
            return;
        }
        this.isAtion = true;
        this.node.runAction(cc.sequence(
            cc.repeat(
                cc.sequence(
                    cc.moveTo(time, sv.rotate(Math.PI / 4 * (0 * 3) % 8)),
                    cc.moveTo(time, sv.rotate(Math.PI / 4 * (1 * 3) % 8)),
                    cc.moveTo(time, sv.rotate(Math.PI / 4 * (2 * 3) % 8)),
                    cc.moveTo(time, sv.rotate(Math.PI / 4 * (3 * 3) % 8)),
                    cc.moveTo(time, sv.rotate(Math.PI / 4 * (4 * 3) % 8)),
                    cc.moveTo(time, sv.rotate(Math.PI / 4 * (5 * 3) % 8)),
                    cc.moveTo(time, sv.rotate(Math.PI / 4 * (6 * 3) % 8)),
                    cc.moveTo(time, sv.rotate(Math.PI / 4 * (7 * 3) % 8)),
                    cc.delayTime(this.repeatInterval),
                ),
            this.repeatTimes),
            cc.callFunc(() => {
                this.isAtion = false;
            })
        ));
    }

    // update (dt) {},
});
