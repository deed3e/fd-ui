import { ChainConfig } from './type';

export const Config: ChainConfig = {
    chainId: 97,
    chainName: 'Bnb testnet',
    testnet: true,
    etherscanName: 'BscScan',
    explorerUrl: 'https://testnet.bscscan.com/',
    oracle: '0x9244350c288B39bd84223E1b1F1A0f1367bbc8e1',
    router:'0x1e9340C2c513D384b845064bDff2747C9747c9fa',
    pool:{
        address: '0xFE2cD916316186863a3e4a50dc4C2e9C76464C6c',
        lp: 'FLP',
        assets:['ETH','BTC','WETH','USDC']
    },
    nativeToken: 'tBNB',
    wrapNativeToken: 'WETH',
    tokens: {
        FLP:{
            address: '0x08121D2d30b9896bB46fb3BE9F31c0386C8634D5',
            decimals: 18,
            fractionDigits: 3,
            priceFractionDigits: 2,
            threshold: 0.001,
        },
        USDC: {
            address: '0xeC89C630881dcc9b7d5cB8a19C8515CD60A60a55',
            decimals: 6,
            fractionDigits: 2,
            priceFractionDigits: 3,
            threshold: 0.01,
        },
        WETH: {
            address: '0x8dF691A9c8BCFF339D1e32b672Daae36B197E93D',
            decimals: 18,
            fractionDigits: 4,
            priceFractionDigits: 2,
            threshold: 0.0001,
        },
        BTC: {
            address: '0x320B46653e1Cf33BCdF42e10F5f2689e79cF94F3',
            decimals: 8,
            fractionDigits: 5,
            priceFractionDigits: 2,
            threshold: 0.00001,
        },
        ETH: {
            address: '0x6cbB0bc60291F219FD56a9AB9BB020C4c04C8B42',
            decimals: 18,
            fractionDigits: 4,
            priceFractionDigits: 2,
            threshold: 0.0001,
        },
    },
};
