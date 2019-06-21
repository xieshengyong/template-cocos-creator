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
            for (var i = 0; i < assets.length; i++) {
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
                    var frames = curAss.getSpriteFrames();
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

    setSlicedUI (parent, option) {
        let node = new cc.Node(option.name);
        let sp = node.addComponent(cc.Sprite);
        sp.trim = false;
        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        sp.type = cc.Sprite.Type.SLICED;
        node.setContentSize(option.width, option.height);
        let pos = null;
        if (option.cw && option.ch) {
            pos = this.designToCenter(option.x, option.y, option.cw, option.ch);
        } else {
            pos = this.designToCenter(option.x, option.y);
        }
        node.setPosition(pos.x + option.width / 2, pos.y - option.height / 2);
        sp.spriteFrame = this.res[option.picName];
        // [上、右、下、左]
        sp.insetTop = option.sliced[0];
        sp.insetRight = option.sliced[1];
        sp.insetBottom = option.sliced[2];
        sp.insetLeft = option.sliced[3];
        node.parent = parent;
        node.sp = sp;
        return node;
    },
    /*
    parent: this.node,
    option: {
        name: 'friendTitle',
        text: '= 好友榜 =',
        fontSize: 32,
        lineHeight: 36,
        // 坐标系是设计稿坐标系
        x: 272,
        y: 640,
        width: 210,
        // 外容器宽高，默认是设计稿宽高
        cw: 100,
        ch: 100
    }
    retrun {
        node,
        label
    };
    */

    /**
     *
     * @param {*} parent
     * @param {*} option
     * @example
     * {name: 'friendTitle',
        text: '好友榜',
        fontSize: 32,
        lineHeight: 36,
        color: [200, 200, 200]
        // 坐标系是设计稿坐标系
        x: 272,
        y: 640,
        width: 210,
        height: 11,
        }
     */
    setUIText (parent, option) {
        let node = new cc.Node();
        parent.addChild(node);
        let label = node.addComponent(cc.Label);
        label.string = option.text;
        label.verticalAlign = cc.Label.VerticalAlign.CENTER;
        label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        label.fontSize = option.fontSize || 34;
        label.lineHeight = option.lineHeight || 34;
        if (option.font) {
            label.font = this.res['font_' + option.font];
        }
        let pos = this.designToCenter(option.x || 0, option.y || 0, option.width || node.width, option.height || node.height, parent.width, parent.height);
        if (option.color) {
            node.color = cc.color(option.color[0], option.color[1], option.color[2]);
        }
        if (option.align === cc.Label.HorizontalAlign.LEFT) {
            node.anchorX = 0;
        } else if (option.align === cc.Label.HorizontalAlign.RIGHT) {
            node.anchorX = 1;
        }
        node.setPosition(pos.x + option.width / 2, pos.y - option.lineHeight / 2);
        return {
            node: node,
            label: label
        };
    },

    setUIRichText (parent, option) {
        let node = new cc.Node(option.name);
        let label = node.addComponent(cc.RichText);
        label.string = option.text;
        label.horizontalAlign = option.align || cc.Label.HorizontalAlign.CENTER;
        label.fontSize = option.fontSize;
        label.lineHeight = option.lineHeight;
        label.handleTouchEvent = true;
        let pos = null;
        if (option.cw && option.ch) {
            pos = this.designToCenter(option.x, option.y, option.cw, option.ch);
        } else {
            pos = this.designToCenter(option.x, option.y);
        }
        node.setPosition(pos.x + option.width / 2, pos.y - option.lineHeight / 2);
        if (option.align === cc.Label.HorizontalAlign.LEFT) {
            node.anchorX = 0;
        }
        node.parent = parent;
        return {
            node: node,
            label: label
        };
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

    clone (source) {
        if (typeof source !== 'object') return source;

        let res;

        if (source instanceof Array) {
            res = [];
            for (let i = 0; i < source.length; i++) {
                // 避免一层死循环 a.b = a
                res[i] = source[i] === source ? res : Global.clone(source[i]);
            }
        } else if (source instanceof Object) {
            res = {};
            for (let key in source) {
                if (source.hasOwnProperty(key)) {
                    // 避免一层死循环 a.b = a
                    res[key] = source[key] === source ? res : Global.clone(source[key]);
                }
            }
        }

        return res;
    },

    /**
     * 深层合并对象，相同属性时，后面的覆盖前面的；
     * @example
     * const obj1 = {
     *  a: {b: 1},
     *  b: [1,1]
     * }
     * const obj2 = {
     *  a: {c: 3, d: 3},
     *  b : [3]
     * }
     * merge(obj1, obj2) // {a: {b: 1, c:3, d: 3}, b: [3]};
     */
    merge (obj1, obj2) {
        let newObj1 = Global.clone(obj1);
        let newObj2 = Global.clone(obj2);

        for (let key in newObj2) {
            if (newObj2.hasOwnProperty(key)) {
                if (Object.prototype.toString.call(newObj2[key]) === '[object Object]') {
                    newObj1[key] = Global.merge(newObj1[key], newObj2[key]);
                } else if (Object.prototype.toString.call(newObj2[key]) === '[object Array]') {
                    if (newObj1[key]) {
                        newObj1[key] = Global.merge(newObj1[key], newObj2[key]);
                    } else {
                        newObj1[key] = newObj2[key];
                    }
                } else {
                    newObj1[key] = newObj2[key];
                }
            }
        }

        return newObj1;
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

    /**
     * 获取m~n的随机数
     * @param {Number} m
     * @param {Number} n
     * @param {String} round 取整方向floor OR ceil 默认floor
     */
    getRandom (m, n, round) {
        return Math[round || 'floor'](Math.random() * (n - m) + m);
    },

    /**
     * 补位函数
     * @param {*} num 数字
     * @param {*} n 位数
     */
    pad (num, n) {
        let tbl = [];
        n = n || 5;
        let len = n - num.toString().length;
        if (len <= 0) return num;
        if (!tbl[len]) tbl[len] = (new Array(len + 1)).join('0');
        return tbl[len] + num;
    },

    /**
     * 打乱数组，返回打乱后的新数组，不改变原数组
     * @param {*} arr 目标
     * @param {*} count 指定返回数量 默认全部
     */
    shuffleArr (arr, count) {
        let m = arr.length;
        let i;
        let min = count ? (m - count) : 0;
        while (m) {
            i = (Math.random() * m--) >>> min;
            [arr[m], arr[i]] = [arr[i], arr[m]];
        }
        return arr.slice(min);
    },

    /**
     * 获取在一定范围内不重复的坐标，默认只计算500次，需合理指定范围
     * @param {*} start 起始坐标
     * @param {*} end 结束坐标
     * @param {*} notSamePool 不重复坐标数组
     * @param {*} xRange x方向不重合范围
     * @param {*} yRange y不重合范围
     */
    getNotSamePosition (start, end, notSamePool, xRange, yRange) {
        let isSame = true;
        let pos;
        let time = 0;
        while (isSame && (time < 500)) {
            pos = cc.v2(this.getRandom(start.x, end.x), this.getRandom(start.y, end.y));
            isSame = notSamePool.find(ele => {
                if (Math.abs(pos.x - ele.x) < xRange || Math.abs(pos.y - ele.y) < yRange) {
                    return true;
                }
            });
            time++;
        }
        time === 500 && console.error('范围指定不合理！运算超过500次');
        return pos;
    }
};
