import { ChainConfig } from './type';

export const Config: ChainConfig = {
    chainId: 97,
    chainName: 'Bnb testnet',
    testnet: true,
    etherscanName: 'BscScan',
    explorerUrl: 'https://testnet.bscscan.com/',
    oracle: '0x1E16D408a6ae4E2a867cd33F15cb7E17441139c1',
    router:'0x52564006F9b0B9Af3e0284D284Ecc3845cEfa22e',
    orderManager: '0x5c7dB8F6d09988D3987e9DC0e588E712B212691f',
    chartUrlHttp:'',
    chartUrlWs:'wss://ws-feed.pro.coinbase.com',
    graphql:'https://api.thegraph.com/subgraphs/name/deed3e/fdex',
    pool:{
        address: '0x006Df49bde510578dE88b75AEe4754cc86bFAFD0',
        lp: 'FLP',
        assets:['ETH','BTC','WETH','USDC']
    },
    nativeToken: 'tBNB',
    wrapNativeToken: 'WETH',
    tokens: {
        FLP:{
            address: '0x6e591AdB6867403544f62a7eEc353c0CbF8A44e1',
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
