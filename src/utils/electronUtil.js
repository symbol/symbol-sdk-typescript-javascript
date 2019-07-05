const {dialog} = require('electron')

export const openFile = (fn) => {
    dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory']
    }, (files) => {
        if (files) {
            fn(files)
        }
    })
}

export const saveFile = (name,extensions,fn) => {
    const options = {
        title: 'Save File',
        filters: [
            { name: name, extensions: [extensions] }
        ]
    }
    dialog.showSaveDialog(options, (filename) => {
        fn(filename)
    })
}
