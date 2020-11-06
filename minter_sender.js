async function send(frase, to, value, memo) {
    const minterWallet = require('minterjs-wallet')
const wallet = minterWallet.generateWallet();
const wallet2 = minterWallet.walletFromMnemonic(frase);
const wif = wallet2.getPrivateKeyString();
const {Minter, TX_TYPE} = require("minter-js-sdk");
const minter = new Minter({apiType: 'node', baseURL: 'https://api.minter.one/'});
    const txParams = {
        chainId: 1,
        type: TX_TYPE.SEND,
        data: {
            to: to,
            value: value,
            coin: 'BIP',    
        },
        gasCoin: 'BIP',
        gasPrice: 1,
        payload: memo,
    };
    const idTxParams = await Minter.replaceCoinSymbol(txParams);
    console.log(idTxParams);    
    minter.postTx(idTxParams, {privateKey: wif})
        .then((txHash) => {
            console.log(`Tx created: ${txHash}`);
        }).catch((error) => {
            const errorMessage = error.response.data.error.message
            console.log(errorMessage);
        });
}

module.exports.send = send;