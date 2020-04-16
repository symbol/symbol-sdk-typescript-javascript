// eslint-disable-next-line @typescript-eslint/no-var-requires
const {notarize} = require('electron-notarize')

exports.default = async function notarizing(context) {
  const {electronPlatformName, appOutDir} = context

  // Skip notarization when not on Mac OS.
  if (electronPlatformName !== 'darwin') return

  const appName = context.packager.appInfo.productFilename

  return notarize({
    appBundleId: 'io.symbol.desktop-wallet',
    appPath: `${appOutDir}/${appName}.app`,
    appleApiKey: process.env.APPLE_API_KEY_ID,
    appleApiIssuer: process.env.APPLE_API_KEY_ISSUER_ID,
  })
}
