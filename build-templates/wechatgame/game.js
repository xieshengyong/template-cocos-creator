/* eslint-disable @typescript-eslint/no-require-imports */
require('utils/ald-game.js');

require('adapter-min.js');

__globalAdapter.init();

requirePlugin('cocos');

__globalAdapter.adaptEngine();

require('./ccRequire');

require('./src/settings'); // Introduce Cocos Service here


require('./main');
// Adjust devicePixelRatio

cc.view._maxPixelRatio = 4;

if (cc.sys.platform !== cc.sys.WECHAT_GAME_SUB) {
    // Release Image objects after uploaded gl texture
    cc.macro.CLEANUP_IMAGE_CACHE = true;
} // sub context need to boot after SubContextView component enabled in main context


if (!__globalAdapter.isSubContext) {
    window.boot();
}