import { ChainConfig } from './type';

export const Config: ChainConfig = {
    chainId: 97,
    chainName: 'Bnb testnet',
    testnet: true,
    etherscanName: 'BscScan',
    explorerUrl: 'https://testnet.bscscan.com/',
    oracle: '0x1E16D408a6ae4E2a867cd33F15cb7E17441139c1',
    router:'0xE74A23544563bfB0c62BC88b5273F370dDd9f3De',
    orderManager: '0x42c39944Fb4e7678887FA1019615E461A83E1fCa',
    chartUrlHttp:'',
    chartUrlWs:'wss://ws-feed.pro.coinbase.com',
    graphql:'https://api.thegraph.com/subgraphs/name/deed3e/fdex',
    pool:{
        address: '0x8B8DC0A49f0F401f575f8DC3AA3641BbBCca9194',
        lp: 'FLP',
        assets:['ETH','BTC','WETH','USDC']
    },
    nativeToken: 'tBNB',
    wrapNativeToken: 'WETH',
    tokens: {
        FLP:{
            address: '0xA6Da9eAcbD5390acf0D892Eb7D255258BC73Abf7',
            decimals: 18,
            fractionDigits: 3,
            priceFractionDigits: 2,
            threshold: 0.001,
        },
        USDC: {
            address: '0x56EB53dC2C58E2842b00a970F70bFD4fb3936657',
            decimals: 6,
            fractionDigits: 2,
            priceFractionDigits: 3,
            threshold: 0.01,
        },
        WETH: {
            address: '0x5f02a71acD8a8B692Db0c237414d52eC7c6F8C6c',
            decimals: 18,
            fractionDigits: 4,
            priceFractionDigits: 2,
            threshold: 0.0001,
        },
        BTC: {
            address: '0xacB66a930079F26980933E148c7718bbAFD66a45',
            decimals: 8,
            fractionDigits: 5,
            priceFractionDigits: 2,
            threshold: 0.00001,
        },
        ETH: {
            address: '0xBD4EE5db59c8d238c99c350002f199CCc0e1CAaE',
            decimals: 18,
            fractionDigits: 4,
            priceFractionDigits: 2,
            threshold: 0.0001,
        },
    },
};
