import { ChainConfig } from './type';

export const Config: ChainConfig = {
    chainId: 97,
    chainName: 'Bnb testnet',
    testnet: true,
    etherscanName: 'BscScan',
    explorerUrl: 'https://testnet.bscscan.com/',
    oracle: '0x19c8cBdD17fFE0c1b6aDFa0cd15AF6F53b232558',
    router:'0x72DAfAfC06750E82ABDdB7039e0438149f97fdEF',
    chartUrlHttp:'',
    chartUrlWs:'wss://ws-feed.pro.coinbase.com',
    graphql:'https://api.thegraph.com/subgraphs/name/deed3e/fdex',
    pool:{
        address: '0x02109586C4dCEf32367786D9DEF4306d18b063C7',
        lp: 'FLP',
        assets:['ETH','BTC','WETH','USDC']
    },
    nativeToken: 'tBNB',
    wrapNativeToken: 'WETH',
    tokens: {
        FLP:{
            address: '0xDf1e37a49F7151Fa58eeb7992B5E67Cd98fE9759',
            decimals: 18,
            fractionDigits: 3,
            priceFractionDigits: 2,
            threshold: 0.001,
        },
        USDC: {
            address: '0xAC4bbA933a055A2AaDb4a56ff4F12720A3088Ade',
            decimals: 6,
            fractionDigits: 2,
            priceFractionDigits: 3,
            threshold: 0.01,
        },
        WETH: {
            address: '0xe32E0654Aa8Ff2c46eaEe5577cAd286239f240A9',
            decimals: 18,
            fractionDigits: 4,
            priceFractionDigits: 2,
            threshold: 0.0001,
        },
        BTC: {
            address: '0x57ae6B49Fa818Aaafa1AAc021b515A0776C16643',
            decimals: 8,
            fractionDigits: 5,
            priceFractionDigits: 2,
            threshold: 0.00001,
        },
        ETH: {
            address: '0x3f4BF859B974b7Ec06E650a1B03751C2D2dCDF57',
            decimals: 18,
            fractionDigits: 4,
            priceFractionDigits: 2,
            threshold: 0.0001,
        },
    },
};
