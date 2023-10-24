import { useContractRead } from 'wagmi';
import abiOracle from '../abis/Oracle.json';
import { useEffect, useMemo } from 'react';
import { getTokenConfig, getAddressOracle } from '../config';
import { getAddress, formatUnits, parseUnits } from 'viem';
import { useLastBlockUpdate } from '../contexts/ApplicationProvider';

export const useOracle = (tokens: string[]): Record<string, BigInt> => {
    const lastBlockNumber = useLastBlockUpdate();

    const addresss = useMemo(() => {
        return tokens.map((e) => getAddress(getTokenConfig(e)?.address ?? ''));
    }, [tokens]);

    const contractRead: any = useContractRead({
        address: getAddress(getAddressOracle() ?? ''),
        abi: abiOracle,
        functionName: 'getMultiplePrices',
        args: [addresss],
    });

    useEffect(() => {
        contractRead?.refetch();
    }, [contractRead, lastBlockNumber]);

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
