import { ChainConfig } from './type';

export const Config: ChainConfig = {
    chainId: 97,
    chainName: 'Bnb testnet',
    testnet: true,
    etherscanName: 'BscScan',
    explorerUrl: 'https://testnet.bscscan.com/',
    oracle: '0xcec882653e9Ef2D27090935ad45380ADA4D16c5e',
    router:'0x1b43C6D51Fe9cc0d4d6D0C62C0F665391d991831',
    chartUrlHttp:'',
    chartUrlWs:'wss://ws-feed.pro.coinbase.com',
    graphql:'https://api.thegraph.com/subgraphs/name/deed3e/fdex',
    pool:{
        address: '0x550bABd28C31402CCB649607b22884Fc3C0ce396',
        lp: 'FLP',
        assets:['ETH','BTC','WETH','USDC']
    },
    nativeToken: 'tBNB',
    wrapNativeToken: 'WETH',
    tokens: {
        FLP:{
            address: '0x5cA0DdC4f038377ddAF19a6B7C7b287944d89490',
            decimals: 18,
            fractionDigits: 3,
            priceFractionDigits: 2,
            threshold: 0.001,
        },
        USDC: {
            address: '0x5A5ec2911c711E1E65342a8a54f2a6B6f5aCbCCc',
            decimals: 6,
            fractionDigits: 2,
            priceFractionDigits: 3,
            threshold: 0.01,
        },
        WETH: {
            address: '0x6c98279b4FFE2Ff58ac7Af61F4bDB08c34078051',
            decimals: 18,
            fractionDigits: 4,
            priceFractionDigits: 2,
            threshold: 0.0001,
        },
        BTC: {
            address: '0xF42e7882D080a117BbDfDA5ddC18488c04FDa9d3',
            decimals: 8,
            fractionDigits: 5,
            priceFractionDigits: 2,
            threshold: 0.00001,
        },
        ETH: {
            address: '0xeb99041A50080b62e114577578389f7581ec3a58',
            decimals: 18,
            fractionDigits: 4,
            priceFractionDigits: 2,
            threshold: 0.0001,
        },
    },
};
