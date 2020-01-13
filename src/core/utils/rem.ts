const htmlRem = function () {
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

export default htmlRem
