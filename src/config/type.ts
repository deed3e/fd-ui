export type ChainConfig = {
    testnet: boolean;
    chainId: number;
    chainName: string;
    etherscanName: string;
    rpcUrl: string;
    explorerUrl: string;
    multicall: string;
    oracle: string;
    nativeToken: string;
    wrapNativeToken: string;
    usdc: string;
    tokens: {
        [symbol: string]: TokenInfo;
    };
};
export type TokenInfo = {
    symbol?: string;
    address: string;
    name?: string;
    decimals: number;
    logo?: string;
    threshold?: number;
    fractionDigits?: number;
    priceFractionDigits?: number;
};

export type TokenInfoProps = TokenInfo & {
    symbol: string;
};

