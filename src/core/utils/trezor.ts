import TrezorConnect from 'trezor-connect';

TrezorConnect.manifest({
    email: 'greg@evias.be',
    appUrl: 'http://localhost:8080'
})

export default TrezorConnect;