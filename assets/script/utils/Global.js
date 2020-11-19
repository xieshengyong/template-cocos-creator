/* eslint-disable array-callback-return */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
export default {
    res: {},

    loadRes (dir, succback, processback) {
        // 资源容器
        let res = {};

        dir = dir || '';

        cc.loader.loadResDir(dir, (completedCount, totalCount, item) => {
            // 进度
            // console.log(completedCount, totalCount);
            processback && processback(completedCount, totalCount);
        }, (err, assets, urls) => {
            for (let i = 0; i < assets.length; i++) {
                let curAss = assets[i];
                let namePart = urls[i].split('/');
                let name = namePart[namePart.length - 1];
                if (typeof curAss === 'object' && curAss instanceof cc.Texture2D) {
                    res['texture_' + name] = curAss;
                } else if (typeof curAss === 'object' && curAss instanceof cc.BitmapFont) {
                    res['font_' + name] = curAss;
                } else if (typeof curAss === 'string') {
                    res['url_' + name] = curAss;
                } else if (curAss instanceof cc.SpriteAtlas) {
                    let frames = curAss.getSpriteFrames();
                    frames.forEach((element) => {
                        res[element.name] = element;
                    });
                } else if (typeof curAss === 'object' && typeof cc.AnimationClip !== 'undefined' && curAss instanceof cc.AnimationClip) {
                    res['anim_' + name] = curAss;
                } else if (typeof curAss === 'object' && curAss instanceof cc.AudioClip) {
                    res['audio_' + name] = curAss;
                } else {
                    res[name] = curAss;
                }
            }
            succback && succback(res, err);
        });
    },

    designToWXPos (x, y, w, h) {
        let winSize = cc.view.getCanvasSize();
        let ratio = winSize.width / 750;
        return {
            x: x * ratio / 2,
            y: (y + (winSize.height / ratio - 1640) / 2) * ratio / 2,
            w: w * ratio / 2,
            h: h * ratio / 2
        };
    },

    /**
     * 将设计稿相对于左上的坐标换算为cc的中心定位并返回；
     * @param {number} dx
     * @param {number} dy
     * @param {number} width 自定义node尺寸width
     * @param {number} height 自定义弄得尺寸height
     * @param {number} cw 外容器尺寸默认可见区域大小
     * @param {number} ch 外容器尺寸默认可见区域大小
     */
    designToCenter (dx, dy, width, height, cw, ch) {
        let visibleSize = cc.view.getVisibleSize();
        // let visibleSize = cc.view.getVisibleSizeInPixel();
        let vw = cw || visibleSize.width;
        let vh = ch || visibleSize.height;

        return cc.v2(dx - vw / 2 + width / 2, -(dy - vh / 2) - height / 2);
    },

    /**
     * 设置anchor，保持位置不变
     * @param {*} target 目标节点，支持节点数组
     * @param {*} anchorX anchorX
     * @param {*} anchorY anchorY
     */
    setAnchor (target, anchorX, anchorY) {
        if (target instanceof cc.Node) {
            target.setPosition(target.x + target.width * (anchorX - target.anchorX), target.y + target.height * (anchorY - target.anchorY));
            target.setAnchorPoint(anchorX, anchorY);
            return;
        }
        if (target instanceof Array) {
            target.forEach(element => {
                this.setAnchor(element, anchorX, anchorY);
            });
        }
    },

    /**
     * 改变目标节点Sprite的type类型
     * @param {*} targets 目标节点，支持节点数组
     * @param {*} type 普通：cc.Sprite.SIMPLE、九宫格：cc.Sprite.Type.SLICED、平铺：cc.Sprite.Type.TILED、填充：cc.Sprite.Type.FILLED
     */
    setFrameType (targets, type) {
        if (targets instanceof cc.Node) {
            targets.getComponent(cc.Sprite).type = type;
            return;
        }
        if (targets instanceof Array) {
            targets.forEach(element => {
                this.setFrameType(element, type);
            });
        }
    },

    /**
     * 为目标节点添加widget挂件；顺序上右下左
     * @param {*} target 目标节点
     * @param {*} top 上边距 0(number)值有效，false无效，下同
     * @param {*} right
     * @param {*} bottom
     * @param {*} left
     * @param {*} t widget挂件对象
     * @param {*} alignMode cc.Widget.AlignMode
     */
    setWidget (target, top, right, bottom, left, t, alignMode) {
        let widget = target.addComponent(cc.Widget);
        t && (widget.target = t);
        widget.alignMode = alignMode || alignMode === 0 ? alignMode : cc.Widget.AlignMode.ON_WINDOW_RESIZE;
        (top || top === 0) && (widget.isAlignTop = true, widget.top = top);
        (right || right === 0) && (widget.isAlignRight = true, widget.right = right);
        (bottom || bottom === 0) && (widget.isAlignBottom = true, widget.bottom = bottom);
        (left || left === 0) && (widget.isAlignLeft = true, widget.left = left);
    },

    /**
     * 为目标对象设置中心偏移定位，
     * @param {*} target
     * @param {*} v 竖直偏移 0(number)值有效，false无效，下同
     * @param {*} h 横向偏移
     * @param {*} t widget挂件对象 默认父元素
     */
    setWidgetCenter (target, v, h, t) {
        let widget = target.addComponent(cc.Widget);
        t && (widget.target = t);
        widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
        (v || v === 0) && (widget.isAlignVerticalCenter = true, widget.verticalCenter = v);
        (h || h === 0) && (widget.isAlignHorizontalCenter = true, widget.horizontalCenter = h);
    },

    setView (parent, option) {
        let node = new cc.Node(option.name);
        if (option.active === false) {
            node.active = false;
        }
        let script = node.addComponent(option.script);
        option.width = option.width || 750;
        option.height = option.height || 1640;
        node.setContentSize(option.width, option.height);
        let x = 0;
        let y = 0;
        if (option.zIndex) {
            node.zIndex = option.zIndex;
        }
        node.setPosition(x, y);
        if (option.bg) {
            let sp = node.addComponent(cc.Sprite);
            sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            sp.spriteFrame = this.res[option.bg];
        }
        node.parent = parent;
        return {
            node: node,
            script: script
        };
    },

    /**
     * 获取两节点在世界坐标系下之间的距离差，返回cc.v2
     * @param {*} node1
     * @param {*} node2
     */
    getNodeWorldDistance (node1, node2) {
        let s1 = node1.convertToWorldSpaceAR(cc.v2(0, 0));
        let s2 = node2.convertToWorldSpaceAR(cc.v2(0, 0));
        return s2.sub(s1);
    },

    /**
     * 创建单纯节点， 返回节点
     * @param {cc.Node} parent 父节点
     * @param {number} x 自定义node位置，默认为0
     * @param {number} y 自定义node位置，默认为0
     * @param {number} width 自定义node尺寸，默认为0
     * @param {number} height 自定义node尺寸，默认为0
     * @param {number} cw 外容器宽高，默认是父元素宽高
     * @param {number} ch 外容器宽高，默认是父元素宽高
     */
    setNode (parent, x, y, width, height, cw, ch) {
        let node = new cc.Node();
        parent.addChild(node);
        node.setContentSize(width || 0, height || 0);
        node.setPosition(this.designToCenter(x, y, width, height, cw || parent.width, ch || parent.height));
        return node;
    },

    /**
     * 创建UI节点，返回节点
     * @param {cc.Node} parent 父节点
     * @param {string} picName spriteFrame名称
     * @param {number} x X
     * @param {number} y Y
     * @param {number} width 自定义node尺寸，默认spriteFrame的尺寸
     * @param {number} height 自定义node尺寸，默认spriteFrame的尺寸
     * @param {number} cw 外容器宽高，默认是设计稿宽高
     * @param {number} ch 外容器宽高，默认是设计稿宽高
     */
    setUI (parent, picName, x, y, width, height, cw, ch) {
        let node = new cc.Node(picName);
        parent && parent.addChild(node);
        let sp = node.getComponent(cc.Sprite) || node.addComponent(cc.Sprite);
        sp.trim = false;
        sp.sizeMode = cc.Sprite.SizeMode.RAW;
        sp.spriteFrame = this.res[picName];
        // sp.srcBlendFactor = cc.macro.BlendFactor.ONE;
        // sp.dstBlendFactor = cc.macro.BlendFactor.ONE_MINUS_SRC_ALPHA;
        if (width && height) {
            sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            node.setContentSize(width, height);
            node.setPosition(this.designToCenter(x, y, width, height, cw, ch));
        } else {
            node.setPosition(this.designToCenter(x, y, node.width, node.height, cw, ch));
        }
        return node;
    },

    /**
     * 创建ScrollView，默认横向滑动，无滑动条
     * @param {*} parent
     * @param {*} x
     * @param {*} y
     * @param {*} width
     * @param {*} height
     */
    createScrollView (parent, x, y, width, height) {
        let scrollView = cc.instantiate(this.res['ScrollView']);
        parent.addChild(scrollView);
        scrollView.setPosition(x, y);
        scrollView.setContentSize(width, height);
        return {
            node: scrollView,
            scrollView: scrollView.getComponent(cc.ScrollView)
        };
    },

    /**
     * 创建纯色遮罩
     * @param {cc.Node} parent 父节点
     * @param {Number} x X
     * @param {Number} y Y
     * @param {Number} width
     * @param {Number} height
     * @param {cc.color} rgb 默认cc.color(255, 255, 255)
     * @param {Number} oty 默认opacity255
     */
    createSplash (parent, x, y, width, height, rgb, oty) {
        let splash = cc.instantiate(this.res['Splash']);
        parent.addChild(splash);
        splash.setPosition(this.designToCenter(x, y, width, height, parent.width, parent.height));
        splash.color = rgb || cc.color(255, 255, 255);
        typeof oty === 'number' ? (splash.opacity = oty) : (splash.opacity = 255);
        splash.setContentSize(width, height);
        return splash;
    },

    /**
     *
     * @param {*} parenet 父节点
     * @param {*} picName 帧前缀，如aa_(需补齐5位aa_00001)
     * @param {*} total 帧总数
     * @param {*} fps 帧率
     * @param {*} WrapMode WrapMode
     * @param {*} x x
     * @param {*} y y
     * @param {*} cw 外尺寸 w
     * @param {*} ch 外尺寸 h
     * @param {*} clipName 动画名称 clipName
     */
    createAnimation (parenet, picName, total, fps, WrapMode, x, y, cw, ch, clipName) {
        let node = this.setUI(parenet, picName + this.pad(0, 5), x, y, null, null, cw, ch);
        let animation = node.getComponent(cc.Animation) || node.addComponent(cc.Animation);
        let clip = this.addAnimationClip(animation, picName, total, fps, WrapMode, clipName);
        return {
            node: node,
            animation: animation,
            clip: clip,
            animationState: animation.getAnimationState(clipName || '0')
        };
    },

    /**
     * 添加AnimationClip
     * @param {cc.animation} animation 目标animation组件
     * @param {string} picName 帧前缀，如aa_(需补齐5位aa_00001)
     * @param {*} total 帧总数
     * @param {*} fps 帧率
     * @param {*} wrapMode cc.WrapMode
     * @param {*} clipName 动画名称 clipName
     */
    addAnimationClip (animation, picName, total, fps, wrapMode, clipName) {
        let animFrames = [];
        // for (let i = total - 1; i >= 0; i--) {
        //     animFrames.push(this.res[picName + this.pad(i, 5)]);
        // }
        for (let i = 0; i < total; i++) {
            animFrames.push(this.res[picName + this.pad(i, 5)]);
        }

        let clip = cc.AnimationClip.createWithSpriteFrames(animFrames, fps);
        wrapMode && (clip.wrapMode = wrapMode);
        animation.addClip(clip, clipName || '0');
        return clip;
    },

    // 简单封装的ajax
    // ajax({
    //     url : "a.php",  // url---->地址
    //     type : "POST",   // type ---> 请求方式
    //     async : true,   // async----> 同步：false，异步：true
    //     dataType: 'text', // 默认json
    //     data : {        //传入信息
    //         name : "张三",
    //         age : 18
    //     },
    //     success : function(data){   //返回接受信息
    //         console.log(data);
    //     },
    //     error : function() {
    //         console.log('err');
    //     }
    // });
    ajax (options) {
        let formsParams = (data) => {
            let arr = [];
            for (let prop in data) {
                arr.push(prop + '=' + data[prop]);
            }
            if (arr) {
                return arr.join('&');
            } else {
                return '';
            }
        };
        let async = options.async !== false || true;
        // 默认post
        let type = options.type || 'POST';
        let dataType = options.dataType || 'json';
        // 创建对象
        let xhr = new XMLHttpRequest();
        let params = formsParams(options.data);
        let ts = new Date().getTime();
        // 连接
        try {
            if (type === 'GET') {
                xhr.open(options.type, options.url + '?' + params, async);
                xhr.send(null);
            } else if (type === 'POST') {
                xhr.open(options.type, options.url + '?' + ts, async);
                xhr.setRequestHeader('X-AppId', this.app.appid);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                if (options.token) {
                    xhr.setRequestHeader('X-WXG-Token', options.token);
                }
                xhr.send(params);
            }
        } catch (error) {
            options.error && options.error();
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    if (dataType === 'json') {
                        let res = JSON.parse(xhr.responseText);
                        if (res.status === 1) {
                            options.success(res.data);
                        } else {
                            options.error && options.error(res);
                        }
                    } else {
                        options.success(xhr.responseText);
                    }
                } else {
                    options.error && options.error();
                }
            }
        };

        xhr.onerror = (e) => {
            console.log(e);
            options.error && options.error();
        };
    },

    /**
     * 返回资源的绝对路径
     * @param {String} url 资源相对于‘resources’的路径 el: cc.url.raw('resources/bgm/spriteBgm.mp3')
     */
    getResUrl (url) {
        let path = cc.url.raw(url);
        if (cc.loader.md5Pipe) {
            path = cc.loader.md5Pipe.transformURL(path);
        }
        return path;
    },
};