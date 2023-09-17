import { useContractRead } from 'wagmi';
import abiOracle from '../abis/Oracle.json';
import { useMemo } from 'react';
import { getTokenConfig, getAdreessOracle } from '../config';
import { getAddress, formatUnits, parseUnits } from 'viem';

export const useOracle = (tokens: string[]): Record<string, BigInt> => {
    const addresss = useMemo(() => {
        return tokens.map((e) => getAddress(getTokenConfig(e)?.address ?? ''));
    }, [tokens]);

    const contractRead: any = useContractRead({
        address: getAddress(getAdreessOracle() ?? ''),
        abi: abiOracle,
        functionName: 'getMultiplePrices',
        args: [addresss],
    });

    return useMemo(() => {
        const rs: Record<string, BigInt> = {};
        if (contractRead) {
            tokens.forEach((e, index) => {
                if (contractRead?.data?.[index]) {
                    rs[e] = parseUnits(
                        formatUnits(
                            contractRead.data[index],
                            30 - (getTokenConfig(e)?.decimals ?? 1),
                        ),
                        8,
                    );
                }
            });
        }
        return rs;
    }, [contractRead, tokens]);
};
