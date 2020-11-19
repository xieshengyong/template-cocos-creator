/*
 * @Author: xieshengyong
 * @Date: 2019-12-10 01:01:51
 * @LastEditTime: 2020-11-19 16:54:31
 * @LastEditors: xieshengyong
 */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */

// TODO: 固化动画设置

const { ccclass, property, executeInEditMode } = cc._decorator;

let item = cc.Enum({});

interface FramesPool {
    [propName: string]: {
        [propName: string]: cc.SpriteFrame
    }
}

@ccclass('FrameAnim')
export class FrameAnim {
    @property()
    _animList = 0;
    @property({ type: item })
    get animList () {
        return this._animList;
    }
    set animList (value) {
        this._animList = value;
    };

    @property()
    fps = 25;

    @property({ type: cc.WrapMode })
    wrapMode = cc.WrapMode.Default;
};

@ccclass
@executeInEditMode
export default class AddAnimation extends cc.Component {
    sprite: cc.Sprite;
    animation: cc.Animation;
    _array = [];
    _framesPool: FramesPool = {};
    _framesNamePool = {};

    @property
    _atlas = [];
    @property([cc.SpriteAtlas])
    set atlas (value) {
        this.testFrame();
    }
    get atlas () { return this._atlas; }

    @property
    _test = false;
    @property
    set refreshFrame (value: any) {
        this.testFrame();

        cc.log('检测出' + this._array.length + '组动画');
    }
    get refreshFrame () {
        return this._test;
    }

    // 枚举帧动画程序
    @property()
    _frameAnims = [];
    @property([FrameAnim])
    get frameAnims () {
        return this._frameAnims;
    }
    set frameAnims (value) {
        this._frameAnims = value;
        this.updatePreviewList();
    }

    @property
    playOnLoad = false;

    onLoad () {
        this.sprite = this.node.getComponent(cc.Sprite) || this.node.addComponent(cc.Sprite);
        if (CC_EDITOR) return;

        this.testFrame();

        this.animation = this.node.getComponent(cc.Animation) || this.node.addComponent(cc.Animation);

        this.readFrameList();
    }

    start () {
        if (CC_EDITOR) return;
        this.playOnLoad && this.animation.play(this._array[this._frameAnims[0]._animList].name);
    }

    readFrameList () {
        this._frameAnims.forEach((ele) => {
            this.createClip(ele);
        });
    }

    createClip (anim) {
        let fName = this._array[anim._animList].name;
        let framsObj = this._framesPool[fName];

        let frams = Object.keys(framsObj).sort((a: any, b: any) => {
            return a.replace(/[^0-9]/ig,"") - b.replace(/[^0-9]/ig,"");
        }).map(ele => {
            return framsObj[ele];
        });

        let clip = cc.AnimationClip.createWithSpriteFrames(frams, anim.fps);
        clip.wrapMode = anim.wrapMode;
        clip.name = fName;
        this.animation.addClip(clip, fName);
    }

    updatePreviewList () {
        let sf = this._framesPool[this._array[this._frameAnims[0]._animList].name];
        this.sprite.spriteFrame = Object.values(sf)[0];
    }

    // TODO: 待完成refreshFrameSheet
    refreshFrameSheet () {

    }

    // TODO: 待完成changePreview
    changePreview () {
        // this.animation.play(this.frameName);
    }

    testFrame () {
        this.atlas.forEach(ele => {
            let frams = ele.getSpriteFrames();
            frams.forEach((ele: any) => {
                let sName = ele.name.split('_')[0];
                !this._framesPool[sName] && (this._framesPool[sName] = {});
                this._framesPool[sName][ele.name] = ele;
            });
        });

        this._array = Object.keys(this._framesPool).sort().map((value, i) => {
            return { name: value, value: i };
        });

        this.setCCAttr(FrameAnim, 'animList', this._array);
    }

    setCCAttr (target, para, array) {
        // @ts-ignore
        cc.Class.Attr.setClassAttr(target, para, 'enumList', array);

        // @ts-ignore
        cc.Class.Attr.setClassAttr(target, para, 'visible', false);
        setTimeout(() => {
            // @ts-ignore
            cc.Class.Attr.setClassAttr(target, para, 'visible', true);
        }, 500);
    }

    update (dt) {}
}
