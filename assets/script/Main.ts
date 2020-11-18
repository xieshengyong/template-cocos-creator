import { getWinSize } from './utils/BaseTools';

const { ccclass, property } = cc._decorator;

let canvas: cc.Node;

@ccclass
export default class Main extends cc.Component {
    public onLoad () {
        console.log('load');
        this.initProject();

        canvas = cc.Canvas.instance.node;
    }

    public start () {}

    private initProject () {
        // const manager = cc.director.getCollisionManager();
        // manager.enabled = true;
        // 开启绘制显示
        // manager.enabledDebugDraw = true;

        // 设置为横屏模式
        // cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);

        // 画布背景透明 需设置在cc.game.run方法（main.js）之前
        // cc.macro.ENABLE_TRANSPARENT_CANVAS = true;

        // 画布背景透明 需设置在cc.game.run方法（main.js）之后
        // cc.game.canvas.getContext('webgl', { alpha: true });

        // 横竖屏适配
        const resetFit = () => {
            let winSize = getWinSize();
            if (winSize.width / winSize.height > 1700 / 750) {
                cc.Canvas.instance.fitHeight = false;
                cc.Canvas.instance.fitWidth = true;
            } else {
                cc.Canvas.instance.fitHeight = true;
                cc.Canvas.instance.fitWidth = false;
            }
        };
        resetFit();
        cc.view.setResizeCallback(resetFit);
    }
}
