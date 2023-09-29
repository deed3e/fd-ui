import { Address } from "viem";

export type ChainConfig = {
    testnet: boolean;
    chainId: number;
    chainName: string;
    etherscanName: string;
    explorerUrl: string;
    oracle: Address;
    chartUrlWs: string;
    chartUrlHttp: string;
    nativeToken: string;
    wrapNativeToken: string;
    graphql:string;
    pool: {
        address: Address;
        lp: string;
        assets: string[];
    };
    router: Address;
    tokens: {
        [symbol: string]: TokenInfo;
    };
};
export type TokenInfo = {
    symbol?: string;
    address: Address;
    name?: string;
    decimals: number;
    threshold?: number;
    fractionDigits?: number;
    priceFractionDigits?: number;
};

export type TokenInfoProps = TokenInfo & {
    symbol: string;
};
