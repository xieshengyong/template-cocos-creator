const { ccclass, property } = cc._decorator;

/**
 * 游戏场景基类
 */
@ccclass
export default class BaseGame extends cc.Component {
    /** 当前激活的画布组件 */
    public canvas: cc.Node;
    /** UI节点引用 */
    public ui: UIContainer;

    private _updateCbs = [];

    public __init__ (): void {
        this.ui = UIUtils.seekAllSubView(this.node);
        this.ui.setTarget(this);
        this.canvas = cc.Canvas.instance.node;
    }

    /**
     * 添加函数到update中，回调函数传参dt
     * @param cb 回调
     * @param remove 默认false是添加，为true时是删除此cb
     */
    public updateCb (cb: Function, remove: Boolean = false) {
        const isCbHad = this._updateCbs?.some((val, idx) => {
            if (cb === val) {
                remove && this._updateCbs.splice(idx, 1);
                return true;
            }
        });

        !remove && !isCbHad && this._updateCbs.push(cb);
    }

    public update (dt: any) {
        this._updateCbs?.length &&
            this._updateCbs.forEach((ele) => {
                ele?.(dt);
            });
    }
}

class UIUtils {
    /***
     * 生成子节点的唯一标识快捷访问
     * @param node
     * @param map
     */
    public static createSubNodeMap (node: cc.Node, map: Map<string, cc.Node>) {
        let children = node.children;
        if (!children) {
            return;
        }
        for (let t = 0, len = children.length; t < len; ++t) {
            let subChild = children[t];
            map.set(subChild.name, subChild);
            UIUtils.createSubNodeMap(subChild, map);
        }
    }

    /**
     * 返回当前节点所有节点,一唯一标识存在
     * @param node 父节点
     * @return {Object} 所有子节点的映射map
     */
    public static seekAllSubView (node: cc.Node): UIContainer {
        let map = new Map<string, cc.Node>();
        UIUtils.createSubNodeMap(node, map);
        return new UIContainer(map);
    }
}

class UIContainer {
    /** 所有节点集合 */
    private _uiNodesMap: Map<string, cc.Node>;

    private _target: BaseGame;

    public constructor (nodesMap: Map<string, cc.Node>) {
        this._uiNodesMap = nodesMap;
    }

    public setTarget (t: BaseGame): void {
        this._target = t;
    }

    /**
     * 根据节点名字获取节点
     * @param {string}name 节点名字
     * @return {cc.Node}
     */
    public getNode (name: string): cc.Node {
        return this._uiNodesMap.get(name);
    }

    /**
     * 根据节点名字和组件类型获取组件对象
     * @param {string}name 节点名字
     * @param {{prototype: cc.Component}}com 组建类型
     * @return {cc.Component}
     */
    public getComponent<T extends cc.Component> (name: string, com: { prototype: T }): T {
        let node = this._uiNodesMap.get(name);
        if (node) {
            return node.getComponent(com);
        }
        return null;
    }
}
