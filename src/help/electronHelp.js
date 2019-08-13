import { sessionRead, sessionSave } from "@/help/help";
export var openFile = function (fn) {
    var electron = window['electron'];
    electron['dialog'].showOpenDialog({
        properties: ['openFile', 'openDirectory']
    }, function (files) {
        if (files) {
            fn(files);
        }
    });
};
export var saveFile = function (name, extensions, fn) {
    var electron = window['electron'];
    var options = {
        title: 'Save File',
        filters: [
            { name: name, extensions: [extensions] }
        ]
    };
    electron['dialog'].showSaveDialog(options, function (filename) {
        fn(filename);
    });
};
export var checkInstall = function () {
    var fs = window['node_fs'];
    if (fs) {
        var root = fs.readdirSync('./');
        var isInstall = root.every(function (fileName, index) {
            return fileName !== 'installed.config';
        });
        if (isInstall) {
            window.localStorage.clear();
            fs.writeFileSync('./installed.config', 'installed');
        }
    }
};
export var windowSizeChange = function () {
    if (window['electron']) {
        var electron = window['electron'];
        var mainWindow = electron.remote.getCurrentWindow();
        mainWindow.on('resize', function () {
            resetFontSize();
        });
    }
};
export var resetFontSize = function () {
    if (window['electron']) {
        var locaZomm = sessionRead('zoomFactor') || 1;
        var devInnerWidth = 1689;
        var winWidth = window.innerWidth * Number(locaZomm);
        var scaleFactor = window['electron'].screen.getPrimaryDisplay().scaleFactor;
        var zoomFactor = winWidth / devInnerWidth;
        if (winWidth > devInnerWidth && winWidth < 1920) {
            zoomFactor = 1;
        }
        else if (winWidth >= 1920) {
            zoomFactor = winWidth / 1920;
        }
        sessionSave('zoomFactor', zoomFactor);
        window['electron'].webFrame.setZoomFactor(zoomFactor);
    }
};
export var minWindow = function () {
    if (window['electron']) {
        var ipcRenderer = window['electron']['ipcRenderer'];
        ipcRenderer.send('app', 'min');
    }
};
export var maxWindow = function () {
    if (window['electron']) {
        var ipcRenderer = window['electron']['ipcRenderer'];
        ipcRenderer.send('app', 'max');
    }
};
export var closeWindow = function () {
    if (window['electron']) {
        var ipcRenderer = window['electron']['ipcRenderer'];
        ipcRenderer.send('app', 'quit');
    }
};
//# sourceMappingURL=electronHelp.js.map