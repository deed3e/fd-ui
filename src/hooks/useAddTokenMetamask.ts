import { useCallback } from 'react';
import { getTokenConfig } from '../config';

export const useAddTokenMetamask = () => {
    const addToken = async (
        address?: string,
        symbol?: string,
        decimals?: number,
        image?: string,
    ) => {
        await window?.ethereum?.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: address,
                    symbol: symbol,
                    decimals: decimals,
                    image: image
                },
            },
        });
    };

    return useCallback(async (symbol: string, useName?: boolean) => {
        const token = getTokenConfig(symbol);
        await addToken(
            token?.address,
            useName ? token?.name : token?.symbol,
            token?.decimals,
            token?.logo,
        );
    }, []);
};
