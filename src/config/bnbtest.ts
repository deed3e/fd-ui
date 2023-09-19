import { ChainConfig } from './type';

export const Config: ChainConfig = {
    chainId: 97,
    chainName: 'Bnb testnet',
    testnet: true,
    etherscanName: 'BscScan',
    explorerUrl: 'https://testnet.bscscan.com/',
    oracle: '0x1e7c44872570115CC7C47466205F7831343cDfb5',
    router:'0x65870ceCFB6725939C1321E055224eA405504A52',
    pool:{
        address: '0xee23330d055162348eAFdEd363f5f12a2d338d7c',
        lp: 'FLP',
        assets:['ETH','BTC','WETH','USDC']
    },
    nativeToken: 'tBNB',
    wrapNativeToken: 'WETH',
    tokens: {
        FLP:{
            address: '0x6819a6E5591168bA6496bF1A0727F00Dc3015e08',
            decimals: 18,
            fractionDigits: 5,
            priceFractionDigits: 2,
            threshold: 0.00001,
        },
        USDC: {
            address: '0x0ebE956E651ab4483bD9E294708bf9FB3388C45f',
            decimals: 6,
            fractionDigits: 2,
            priceFractionDigits: 3,
            threshold: 0.01,
        },
        WETH: {
            address: '0x248e1dd106d84969FEa5d55e6d7Ad503ed615D19',
            decimals: 18,
            fractionDigits: 4,
            priceFractionDigits: 2,
            threshold: 0.0001,
        },
        BTC: {
            address: '0xf812e205AbdA71c679efCEBF44254f7A59D0211d',
            decimals: 8,
            fractionDigits: 5,
            priceFractionDigits: 2,
            threshold: 0.00001,
        },
        ETH: {
            address: '0x5E1277fbde1cF35f236ef9bcCafeC1593E603906',
            decimals: 18,
            fractionDigits: 4,
            priceFractionDigits: 2,
            threshold: 0.0001,
        },
    },
};
