import { get, keys, findKey } from 'lodash';
import { Config } from './bnbtest';
import { TokenInfo, TokenInfoProps } from './type';
import { Address } from 'viem';

export const config = Config;

export const getTokenConfig = (tokenSymbol: string) => {
    if (!tokenSymbol) {
        return undefined;
    }
    const tokenConfig = get(config, ['tokens', tokenSymbol]) as TokenInfo;

    return { ...(tokenConfig || {}), symbol: tokenSymbol } as TokenInfoProps;
};

export const getAddressOracle = () => {
    return get(config, ['oracle']);
};

export const getSymbolByAddress = (address: Address) => {
    const symbol = findKey(
      get(config, ['tokens']),
        (item) => item.address === address
    ) ;

    return symbol;
};

export const getAddressPool = () => {
    return get(config, ['pool', 'address']);
};

export const getAddressRouter = () => {
    return get(config, ['router']);
};

export const getLpSymbol = () => {
    return get(config, ['pool', 'lp']);
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

export const getPoolAssetSymbol = () => {
    return get(config, ['pool', 'assets']);
};
