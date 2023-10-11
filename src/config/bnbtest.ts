import { ChainConfig } from './type';

export const Config: ChainConfig = {
    chainId: 97,
    chainName: 'Bnb testnet',
    testnet: true,
    etherscanName: 'BscScan',
    explorerUrl: 'https://testnet.bscscan.com/',
    oracle: '0x1E16D408a6ae4E2a867cd33F15cb7E17441139c1',
    router:'0x5c8Da9D0b9d8D81fdBEac6050bf1BE8A0a21E59A',
    orderManager: '0x7f7eD4502fC1832b8de3E13FA2453993f6abC8c2',
    chartUrlHttp:'',
    chartUrlWs:'wss://ws-feed.pro.coinbase.com',
    graphql:'https://api.thegraph.com/subgraphs/name/deed3e/fdex',
    pool:{
        address: '0x9Fca52B0E21AdfF52563D179b1593149109593b5',
        lp: 'FLP',
        assets:['ETH','BTC','WETH','USDC']
    },
    nativeToken: 'tBNB',
    wrapNativeToken: 'WETH',
    tokens: {
        FLP:{
            address: '0x9eB7cb1574A985bd0D54d82971c87FE1818D399a',
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
