let SpriteFrameHandler = cc.Class({
    name: 'cc.spriteFrames',

    properties: {
        alias: '',
        spriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
    },
});

cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Node
        },
        eventName: '',
        SpriteFrames: {
            default: [],
            type: [SpriteFrameHandler],
            tooltip: '触发target自定义事件，传入要改变的alias'
        }
    },

    onLoad () {
        let spr = this.node.getComponent(cc.Sprite) || this.node.addComponent(cc.Sprite);
        this.target.on(this.eventName, (alias) => {
            this.SpriteFrames.some((sf, index, arr) => {
                if (sf.alias === alias) {
                    if (sf.spriteFrame) {
                        this.node.active = true;
                        spr.spriteFrame = sf.spriteFrame;
                    } else {
                        this.node.active = false;
                    }
                    return true;
                }
                return false;
            });
        });
    },

    // update (dt) {},
});
