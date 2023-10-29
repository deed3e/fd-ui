import styled from 'styled-components';
import { getSymbolByAddress, getTokenConfig } from '../../../config';
import { useLastBlockUpdate } from '../../../contexts/ApplicationProvider';
import { getSwapsByCondition } from '../../../apis/swap';
import { useAccount } from 'wagmi';
import { TokenSymbol } from '../../../component/TokenSymbol';
import { memo, useEffect, useMemo } from 'react';
import { getTimeDistance } from '../../../utils/times';
import { getAddress } from 'viem';
import { BigintDisplay } from '../../../component/BigIntDisplay';
import { SwapType } from '../../../types';
import ContentLoader from '../../../component/ContentLoader';
import { useQuery } from '@tanstack/react-query';

function History() {
    const { address, isConnected } = useAccount();
    const lastBlockUpdate = useLastBlockUpdate();

    const swapQuery = useQuery({
        queryKey: ['getSwapsByCondition', address, '1'],
        queryFn: () => getSwapsByCondition(address, '1'),
    });

    const loading = useMemo(() => {
        if (swapQuery?.isFetching || swapQuery?.isLoading) {
            return true;
        }
        return false;
    }, [swapQuery]);

    useEffect(() => {
        swapQuery.refetch();
    }, [lastBlockUpdate]);

    return (
        <>
            <StyledHeader>
                <div className="token">From/To</div>
                <div>Amount</div>
                <div>Receive</div>
                <div>Time</div>
            </StyledHeader>
            <StyledTableBody>
                {swapQuery.data?.map((item: SwapType, index: any) => (
                    <StyledTableRow key={index}>
                        <div className="token">
                            <div>
                                <TokenSymbol
                                    symbol={
                                        getSymbolByAddress(getAddress(item.tokenIn)) ?? 'BTC'
                                    }
                                />
                            </div>
                            <div className="token-to">
                                <TokenSymbol
                                    symbol={
                                        getSymbolByAddress(getAddress(item.tokenOut)) ?? 'BTC'
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <BigintDisplay
                                value={item.amountIn}
                                decimals={
                                    getTokenConfig(
                                        getSymbolByAddress(getAddress(item.tokenIn)) ?? 'BTC',
                                    )?.decimals ?? 0
                                }
                                fractionDigits={5}
                                threshold={0.00001}
                            />
                        </div>
                        <div>
                            <BigintDisplay
                                value={item.amountOut}
                                decimals={
                                    getTokenConfig(
                                        getSymbolByAddress(getAddress(item.tokenOut)) ?? 'BTC',
                                    )?.decimals ?? 0
                                }
                                fractionDigits={5}
                                threshold={0.00001}
                            />
                        </div>
                        {/* // <div>{getTimeDistance(item.time)}</div> */}
                        <div>-</div>
                    </StyledTableRow>
                ))}
                {loading && <ContentLoader.HistorySwap />}
            </StyledTableBody>
        </>
    );
}

export default memo(History);

const StyledTableBody = styled.div`
    width: 100%;
`;

const StyledHeader = styled.div`
    display: grid;
    grid-template-columns: 3.5fr 4fr 4fr 2.5fr;
    align-items: center;
    padding: 8px 0;
    background: #0f091e;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    .token {
        justify-self: center;
    }
`;

const StyledTableRow = styled(StyledHeader)`
    font-size: 15px;
    margin-top: 5px;
    margin-bottom: 4px;
    background: none;
    :hover {
        background: rgba(201, 201, 201, 0.1);
        color: #fff;
    }
    .token {
        display: flex;
        justify-content: center;
        align-items: center;
        .token-to {
            margin-left: -10px;
        }
        div {
            height: 32px;
            margin: 3px 0;
        }
    }
`;
