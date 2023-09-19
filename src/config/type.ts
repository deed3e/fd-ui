export type ChainConfig = {
    testnet: boolean;
    chainId: number;
    chainName: string;
    etherscanName: string;
    explorerUrl: string;
    oracle: string;
    nativeToken: string;
    wrapNativeToken: string;
    pool: {
        address: string;
        lp: string;
        assets: string[];
    };
    router: string;
    tokens: {
        [symbol: string]: TokenInfo;
    };
};
export type TokenInfo = {
    symbol?: string;
    address: string;
    name?: string;
    decimals: number;
    threshold?: number;
    fractionDigits?: number;
    priceFractionDigits?: number;
};

export type TokenInfoProps = TokenInfo & {
    symbol: string;
};
