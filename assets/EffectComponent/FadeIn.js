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
        duration: {
            default: 1,
            displayName: '动画时间（s）',
            type: cc.Float
        },
        clickEvents: {
            default: [],
            type: cc.Component.EventHandler,
            tooltip: CC_DEV && 'i18n:COMPONENT.button.click_events',
        },
        // designResolution: {
        //     get: function () {
        //         return cc.v2(1, 1);
        //     },
        //     set: function (value) {
        //         // this._designResolution.width = value.width;
        //         // this._designResolution.height = value.height;
        //         // this._designResolution.height1 = value.height1;
        //         // this.applySettings();
        //         // this.alignWithScreen();
        //     },
        //     tooltip: CC_DEV && 'i18n:COMPONENT.canvas.design_resolution'
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // console.log(this.clickEvents);
        // cc.Component.EventHandler.emitEvents(this.clickEvents, this);
    },

    fadeIn () {
        cc.Component.EventHandler.emitEvents(this.clickEvents, this);
        this.node.runAction(cc.fadeIn(this.duration));
    }

    // update (dt) {},
});
