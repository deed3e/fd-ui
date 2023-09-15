import { useContractRead } from 'wagmi';
import abiOracle from '../abis/Oracle.json';
import { useMemo } from 'react';
import { getTokenConfig, getAdreessOracle } from '../config';
import { getAddress, formatUnits, parseUnits } from 'viem';

export const useOracle = (tokens: string[]): Record<string, BigInt> => {
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
        const rs: Record<string, BigInt> = {};
        tokens.forEach((e, index) => {
            rs[e] = parseUnits(
                formatUnits(contractRead.data[index], 30 - (getTokenConfig(e)?.decimals ?? 0)),
                8,
            );
        });
        return rs;
    }, [contractRead.data, tokens]);
};
