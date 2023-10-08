import { ChainConfig } from './type';

export const Config: ChainConfig = {
    chainId: 97,
    chainName: 'Bnb testnet',
    testnet: true,
    etherscanName: 'BscScan',
    explorerUrl: 'https://testnet.bscscan.com/',
    oracle: '0x1E16D408a6ae4E2a867cd33F15cb7E17441139c1',
    router:'0xC7537D4c30eC2A7A1598C840317c58f7f306BB8f',
    orderManager: '0xf5Df50709412Ec9Ec25B075dE4f7B0cbE0dc27b5',
    chartUrlHttp:'',
    chartUrlWs:'wss://ws-feed.pro.coinbase.com',
    graphql:'https://api.thegraph.com/subgraphs/name/deed3e/fdex',
    pool:{
        address: '0x5b86eA6a9eF155083E9bDa65F4FEd066955A2E36',
        lp: 'FLP',
        assets:['ETH','BTC','WETH','USDC']
    },
    nativeToken: 'tBNB',
    wrapNativeToken: 'WETH',
    tokens: {
        FLP:{
            address: '0x8df708680e0DC458f98D1C6D745dB4Ce843A267B',
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
