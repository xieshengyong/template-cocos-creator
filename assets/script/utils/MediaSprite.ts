/*
 雪碧视频&雪碧音
 var newMediaSprite = new MediaSprite({
    wrap: '#videoWrap',   //如果没有wrap,直接添加到body
    type: 'video',        //如果是雪碧音可以填audio, 也可以不填
    fps: 25,              // 视频帧率；
    src: 'http://hymm.treedom.cn/sound/bg.mp3',
    timeline: {
        'first': {
            begin: 0.0,
            end: 6.0
        },
        'second': {
            begin: 10.0,
            end: 15.0
        }
    }
 });
接口：
newMediaSprite.play(string,function,bool)       {string} 雪碧音的命名
                                                {function} 回调函数
                                                {bool} 是否循环播放
newMediaSprite.started(function)  media开始播放时触发function一次，视频项目时利器；
newMediaSprite.view       返回当前media的dom节点；
el:
mediaSprite.play('first', function (name) {
    console.log(name + ' end');
}, true);
 */

export default class MediaSprite {
    [propName: string]: any;
    private config: any;
    private media: HTMLMediaElement;
    private firstUpdate = false;
    private isStarted = false;
    private updateSpace = 0.25;
    private view = {};
    private startedCallback = [];

    public constructor (config) {
        this.config = config;

        this.media = null;

        this.firstUpdate = false;

        this.isStarted = false;

        this.updateSpace = 0.25;

        this.createMedia();

        this.view = this.media;

        this.startedCallback = [];

        this.startedCtr();

        this.autoFireMedia();
    }

    /** name */
    public play (param) {
        let media = this.media;

        this.playParam = param;

        this.prettyKeyFram(param.name);

        this.firstUpdate = false;

        if (!this.isStarted) {
            this.onStart(() => {
                this.play(param);
            });
            return;
        }

        this.pauseTimer && clearTimeout(this.pauseTimer);

        media.currentTime = this.beginTime;

        this.normalPause = false;

        if (this.config.checkoutSelf) {
            this.onPause();
        }

        media.play();
    }

    /**
     * on
     */
    public on (time, cb) {
        let spaceTime = 1 / this.config.fps;
        let beginInt = time | 0;
        let thisTime = beginInt + Math.abs(beginInt - time) * spaceTime * 100;
        let watch = () => {
            if (this.currentTime >= thisTime) {
            cb?.();
            this.media.removeEventListener('timeupdate', watch);
            }
        };

        this.media.addEventListener('timeupdate', watch);
    }

    /**
     * pause
     */
    public pause () {
        // this.pauseTimer && clearTimeout(this.pauseTimer);
        this.normalPause = true;
        this.mPause = true;
        // this.onPauseTimer && clearInterval(this.onPauseTimer);
        this.media.pause();
    }

    /**
     * continue
     */
    public continue () {
        if (this.mPause) {
            this.media.play();
            this.mPause = false;
        }
    }

    /**
     * onStart
     */
    public onStart (callback) {
        this.startedCallback.push(callback);
    }

    private createMedia () {
        let config = this.config;
        let media = this.media;

        if (config.type === 'video') {
            media = document.createElement('video');

            media.setAttribute('webkit-playsinline', '');

            media.setAttribute('playsinline', '');

            media.setAttribute('preload', 'preload');

            // 没播放前最小化，防止部分机型闪现微信原生播放按钮
            media.style.width = '1px';
            media.style.height = 'auto';
        } else {
            media = document.createElement('audio');
        }

        config.loop && (media.loop = true);

        media.src = config.src;

        if (config.wrap) {
            document.querySelector(config.wrap).appendChild(media);
        } else {
            document.body.appendChild(media);
        }

        media.addEventListener('timeupdate', this.onTimeupdate.bind(this));

        this.normalPause = true;

        // media.addEventListener('pause', this.onPause.bind(this));

        this.media = media;
    }

    /**
     * prettyKeyFram 格式化关键帧时间
     */
    private prettyKeyFram (name) {
        let config = this.config;
        let thispart = config.timeline[name];

        let spaceTime = 1 / config.fps;

        let begin = thispart.begin;
        let beginInt = begin | 0;
        // 将后两位由帧数转化为秒数
        this.beginTime = beginInt + Math.abs(beginInt - begin) * spaceTime * 100 + 0.08;

        // 不设置开始时间时接上次时间
        if (!begin) {
            this.beginTime = this.lastEnd || 0;
        }

        let end = thispart.end;
        // 安卓上暂停时会少播一帧，那就多加一帧
        // var u = navigator.userAgent;
        // if ((u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) && navigator.platform !== 'Win32') {
        //     end += 0.01;
        // }
        let endInt = end | 0;
        // 将后两位由帧数转化为秒数
        this.endTime = endInt + Math.abs(endInt - end) * spaceTime * 100 - 0.12;

        // 记录上次播放结尾
        this.lastEnd = end;
    }

    private onTimeupdate () {
        let endT = this.endTime;
        let media = this.media;

        // this.normalPause = false;

        if (!this.firstUpdate && (media.currentTime > this.beginTime)) {
            this.playParam.onBegin?.();
            this.firstUpdate = true;
        }

        // 在低性能机器上过长的间隔不足以触发定时计时，以常规方式
        if (media.currentTime >= endT) {
            this.normalPause = true;
            media.pause();
            this.pauseTimer && clearTimeout(this.pauseTimer);
            this.playParam.onComplete?.();
            return;
        }
        let space = endT - media.currentTime;

        // 在距离指定点两个间隔处设置setTimeout定时暂停，以达到精准暂停效果
        if (space <= this.updateSpace * 2 && !this.pauseTimer) {
            let time = space * 1000 | 0;
            time = time > 0 ? time : 0;
            this.pauseTimer = setTimeout(() => {
                if (this.playParam.loop) {
                    media.currentTime = this.beginTime;
                } else {
                    this.normalPause = true;
                    media.pause();
                    // clearInterval(this.onPauseTimer);
                    this.playParam.onComplete?.();
                }
                this.pauseTimer = null;
            }, time);
        }
    }

    // 因网络卡顿暂停的也暂停定时器
    private onPause () {
        this.onPauseTimer && clearInterval(this.onPauseTimer);
        this.onPauseTimer = setInterval(() => {
            if (this.media.paused && !this.normalPause) {
                this.media.play();
            }
        }, 1000 + Math.random() * 300); // 随机数防止播放共振
    }

    private startedCtr () {
        let media = this.media;

        let onStarted = () => {
            if (this.currentTime > 0) {
            // 开始播放后最大化
                media.style.width = '100%';

                this.normalPause = true;

                media.pause();

                this.isStarted = true;

                this.startedCallback.forEach(ele => {
                    ele?.();
                });

                this.startedCallback = [];

                media.removeEventListener('timeupdate', onStarted);
            }
        };

        media.addEventListener('timeupdate', onStarted);
    }

    private autoFireMedia () {
        let autoFire = this.config.autoFire;
        if (autoFire || autoFire === 0) {
            const videoCtrInit = () => {
                this.media.play();
                document.body.removeEventListener('touchend', videoCtrInit);
            };
            document.body.addEventListener('touchend', videoCtrInit);
            const videoCtrInit2 = () => {
                this.media.play();
                document.body.removeEventListener('click', videoCtrInit2);
            };
            document.body.addEventListener('click', videoCtrInit2);
        }
    }
};
