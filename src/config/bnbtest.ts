import { ChainConfig } from './type';

export const Config: ChainConfig = {
    chainId: 97,
    chainName: 'Bnb testnet',
    testnet: true,
    etherscanName: 'BscScan',
    explorerUrl: 'https://testnet.bscscan.com/',
    oracle: '0x1E16D408a6ae4E2a867cd33F15cb7E17441139c1',
    router:'0x1df621E5F29b9C75D9209b52DdB0BdfE0fE4899E',
    orderManager: '0x3165b3821f8F6658D5905A7b72E2E4C09fD9979b',
    chartUrlHttp:'',
    chartUrlWs:'wss://ws-feed.pro.coinbase.com',
    graphql:'https://api.thegraph.com/subgraphs/name/deed3e/fdex',
    pool:{
        address: '0xCD2Cc46eFE9d5eE3C018F60eD5dC316f3dc870e6',
        lp: 'FLP',
        assets:['ETH','BTC','WETH','USDC']
    },
    nativeToken: 'tBNB',
    wrapNativeToken: 'WETH',
    tokens: {
        FLP:{
            address: '0x4F5a24940905B9ec02C77Ef103E15b5d789FC423',
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
