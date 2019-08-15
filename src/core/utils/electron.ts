import {sessionRead, sessionSave} from "@/core/utils/utils";

export const openFile = (fn) => {
    const electron = window['electron'];
    electron['dialog'].showOpenDialog({
        properties: ['openFile', 'openDirectory']
    }, (files) => {
        if (files) {
            fn(files)
        }
    })
}

export const saveFile = (name,extensions,fn) => {
    const electron = window['electron'];
    const options = {
        title: 'Save File',
        filters: [
            { name: name, extensions: [extensions] }
        ]
    }
    electron['dialog'].showSaveDialog(options, (filename) => {
        fn(filename)
    })
}

export const checkInstall = () => {
    const fs = window['node_fs']
    if(fs){
        const root = fs.readdirSync('./')
        const isInstall = root.every((fileName, index)=>{
            return fileName !== 'installed.config';
        })
        if(isInstall) {
            window.localStorage.clear()
            fs.writeFileSync('./installed.config','installed')
        }
    }
}

export const windowSizeChange = () => {
    if(window['electron']){
        const electron = window['electron'];
        const mainWindow =electron.remote.getCurrentWindow()
        mainWindow.on('resize',() => {
            resetFontSize()
        })
    }
}

export const resetFontSize = () => {
    if(window['electron']){
        const locaZomm = sessionRead('zoomFactor') || 1
        const devInnerWidth= 1689
        const winWidth = window.innerWidth * Number(locaZomm)
        const scaleFactor = window['electron'].screen.getPrimaryDisplay().scaleFactor;
        let zoomFactor =  winWidth/devInnerWidth;
        if(winWidth > devInnerWidth && winWidth < 1920){
            zoomFactor =  1
        }else if(winWidth >= 1920){
            zoomFactor =  winWidth/1920;
        }
        sessionSave('zoomFactor',zoomFactor)
        window['electron'].webFrame.setZoomFactor(zoomFactor);
    }
}

export const minWindow = () => {
    if(window['electron']) {
        const ipcRenderer = window['electron']['ipcRenderer'];
        ipcRenderer.send('app', 'min')
    }
}

export const maxWindow = () => {
    if(window['electron']) {
        const ipcRenderer = window['electron']['ipcRenderer'];
        ipcRenderer.send('app', 'max')
    }
}

export const closeWindow = () => {
    if(window['electron']) {
        const ipcRenderer = window['electron']['ipcRenderer'];
        ipcRenderer.send('app', 'quit')
    }
}
