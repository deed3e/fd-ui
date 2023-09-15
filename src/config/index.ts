import { get, keys } from 'lodash';
import { Config } from './bnbtest';
import { TokenInfo, TokenInfoProps } from './type';

export const config = Config;

export const getRpcUrl = () => {
    return get(config, ['rpcUrl']);
};

export const getTokenConfig = (tokenSymbol: string) => {
    if (!tokenSymbol) {
        return undefined;
    }
    const tokenConfig = get(config, ['tokens', tokenSymbol]) as TokenInfo;

    return { ...(tokenConfig || {}), symbol: tokenSymbol } as TokenInfoProps;
};


export const getAdreessOracle = () => {
    return get(config, ['oracle']);
};

export const getAdreessPool = () => {
    return get(config, ['pool']);
};

export const getAdreessRouter = () => {
    return get(config, ['router']);
};

export const getExplorerUrl = () => {
    return get(config, ['explorerUrl']);
};

export const getNativeTokenSymbol = () => {
    return get(config, ['nativeToken']);
};

export const getWrapNativeTokenSymbol = () => {
    return get(config, ['wrapNativeToken']);
};

export const getAllTokenSymbol = () => {
    return keys(get(config, ['tokens']));
};
