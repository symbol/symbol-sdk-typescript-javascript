/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {StorageHelpers} from './StorageHelpers'

export class Electron {

  /**
   * Holds whether the app is maximized
   * @var {boolean}
   */
  public static isMaximized: boolean = false

  public static openFile = (fn) => {
    const electron = window['electron']
    electron['dialog'].showOpenDialog({
      properties: [ 'openFile', 'openDirectory' ],
    }, (files) => {
      if (files) {
        fn(files)
      }
    })
  }

  public static saveFile = (name, extensions, fn) => {
    const electron = window['electron']
    const options = {
      title: 'Save File',
      filters: [
        {name: name, extensions: [extensions]},
      ],
    }
    electron['dialog'].showSaveDialog(options, (filename) => {
      fn(filename)
    })
  }

  public static checkInstall = () => {
    const fs = window['node_fs']
    if (fs) {
      const root = fs.readdirSync('./')
      const isInstall = root.every((fileName) => {
        return fileName !== 'installed.config'
      })
      if (isInstall) {
        window.localStorage.clear()
        fs.writeFileSync('./installed.config', 'installed')
      }
    }
  }

  public static resetFontSize = () => {
    if (window['electron']) {
      const localZoom = StorageHelpers.sessionRead('zoomFactor') || 1
      const devInnerWidth = 1689
      const winWidth = window.innerWidth * Number(localZoom)
      let zoomFactor = winWidth / devInnerWidth
      if (winWidth > devInnerWidth && winWidth < 1920) {
        zoomFactor = 1
      } else if (winWidth >= 1920) {
        zoomFactor = winWidth / 1920
      }
      StorageHelpers.sessionSave('zoomFactor', zoomFactor)
      window['electron'].webFrame.setZoomFactor(zoomFactor)
    }
  }

  public static windowSizeChange = () => {
    if (window['electron']) {
      const electron = window['electron']
      const mainWindow = electron.remote.getCurrentWindow()
      mainWindow.on('resize', () => {
        Electron.resetFontSize()
      })
    }
  }

  public static minWindow = () => {
    if (window['electron']) {
      Electron.isMaximized = false
      const ipcRenderer = window['electron']['ipcRenderer']
      ipcRenderer.send('app', 'min')
    }
  }

  public static maxWindow = () => {
    if (window['electron']) {
      Electron.isMaximized = true
      const ipcRenderer = window['electron']['ipcRenderer']
      ipcRenderer.send('app', 'max')
    }
  }

  public static closeWindow = () => {
    if (window['electron']) {
      const ipcRenderer = window['electron']['ipcRenderer']
      ipcRenderer.send('app', 'quit')
    }
  }

  public static unMaximize = () => {
    if (window['electron']) {
      Electron.isMaximized = false
      const ipcRenderer = window['electron']['ipcRenderer']
      ipcRenderer.send('app', 'unMaximize')
    }
  }

  public static htmlRem = () => {
    const docEl = document.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function () {
        const clientWidth = docEl.clientWidth
        if (!clientWidth) return
        docEl.style.fontSize = `${10 * (clientWidth / 192)}px`
      }
    if (!document.addEventListener) return
    window.addEventListener(resizeEvt, recalc, false)
    document.addEventListener('DOMContentLoaded', recalc, false)
  }
}
