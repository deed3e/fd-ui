import { useContractRead } from 'wagmi';
import abiOracle from '../abis/Oracle.json';
import { useMemo } from 'react';
import { getTokenConfig, getAdreessOracle } from '../config';
import { getAddress, formatUnits } from 'viem';
import { watchBlockNumber } from '@wagmi/core';

export const useOracle = (tokens: string[]) => {
    //need refactor watch block because that start many instance
    watchBlockNumber(
        {
            chainId: 97,
            listen: true,
        },
        (blockNumber) => {
            contractRead.refetch();
            console.log('useOracle::', blockNumber);
        },
    );
    const addresss = useMemo(() => {
        return tokens.map((e) => getAddress(getTokenConfig(e)?.address ?? ''));
    }, [tokens]);

    const contractRead = useContractRead({
        address: getAddress(getAdreessOracle() ?? ''),
        abi: abiOracle,
        functionName: 'getMultiplePrices',
        args: [addresss],
    });

    return useMemo(() => {
        const rs: Record<string, string> = {};
        tokens.forEach((e, index) => {
            rs[e] = formatUnits(
                contractRead.data[index],
                30 - (getTokenConfig(e)?.decimals ?? 0),
            );
        });
        return rs;
    }, [contractRead.data, tokens]);
};
