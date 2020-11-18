declare namespace WechatMinigame {
    interface Wx{
        aldShareAppMessage(arg0: { title: string; imageUrl: string; });
        aldOnShareAppMessage(arg0: () => { title: string; imageUrl: string; });
        onShareTimeline(arg0: () => { title: string; imageUrl: string; });
        /** 阿拉丁统计 */
        aldSendEvent: any;
    }
};

interface Window {
    TGMiniApp: any
    wx: WechatMinigame.Wx
}