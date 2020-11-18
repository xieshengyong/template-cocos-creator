/* eslint-disable @typescript-eslint/prefer-for-of */


window.boot = function () {
    let settings = window._CCSettings;
    window._CCSettings = undefined;

    let onStart = function onStart () {
        cc.view.enableRetina(true);
        cc.view.resizeWithBrowserSize(true);
        let launchScene = settings.launchScene; // load scene

        cc.director.loadScene(launchScene, null, function () {
            console.log('Success to load scene: ' + launchScene);
        });
    };

    let isSubContext = cc.sys.platform === cc.sys.WECHAT_GAME_SUB;
    let option = {
        id: 'GameCanvas',
        debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
        showFPS: !isSubContext && settings.debug,
        frameRate: 60,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix
    };
    cc.assetManager.init({
        bundleVers: settings.bundleVers,
        subpackages: settings.subpackages,
        remoteBundles: settings.remoteBundles,
        server: settings.server,
        subContextRoot: settings.subContextRoot
    });
    let _cc$AssetManager$Buil = cc.AssetManager.BuiltinBundleName;
    let RESOURCES = _cc$AssetManager$Buil.RESOURCES;
    let INTERNAL = _cc$AssetManager$Buil.INTERNAL;
    let MAIN = _cc$AssetManager$Buil.MAIN;
    let START_SCENE = _cc$AssetManager$Buil.START_SCENE;
    let bundleRoot = [INTERNAL, MAIN];
    settings.hasStartSceneBundle && bundleRoot.push(START_SCENE);
    settings.hasResourcesBundle && bundleRoot.push(RESOURCES);
    let count = 0;

    function cb (err) {
        if (err) return console.error(err.message, err.stack);
        count++;

        if (count === bundleRoot.length + 1) {
            cc.macro.ENABLE_TRANSPARENT_CANVAS = true;
            // cc.director.setClearColor(new cc.Color(0, 0, 0, 0));
            cc.game.run(option, onStart);
        }
    } // load plugins


    cc.assetManager.loadScript(settings.jsList.map(function (x) {
        return 'src/' + x;
    }), cb); // load bundles

    for (let i = 0; i < bundleRoot.length; i++) {
        cc.assetManager.loadBundle(bundleRoot[i], cb);
    }
};