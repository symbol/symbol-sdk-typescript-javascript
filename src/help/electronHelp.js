var dialog = require('electron').dialog;
export var openFile = function (fn) {
    dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory']
    }, function (files) {
        if (files) {
            fn(files);
        }
    });
};
export var saveFile = function (name, extensions, fn) {
    var options = {
        title: 'Save File',
        filters: [
            { name: name, extensions: [extensions] }
        ]
    };
    dialog.showSaveDialog(options, function (filename) {
        fn(filename);
    });
};
//# sourceMappingURL=electronHelp.js.map