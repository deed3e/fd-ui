import { memo, useCallback, useMemo, useState } from 'react';
import { Address, useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import {
    getAddressOrderManager,
    getSymbolByAddress,
    getTokenConfig,
} from '../../../../../config';
import OrderManager from '../../../../../abis/OrderManager.json';
import { PositionData } from '..';
import styled from 'styled-components';
import { BigintDisplay } from '../../../../../component/BigIntDisplay';
import { getAddress } from 'viem';
import { useOracle } from '../../../../../hooks/useOracle';

const Position: React.FC<{ data: PositionData[]; loading: boolean }> = ({ data, loading }) => {
    //const priceIndex = useOracle(['BTC', 'ETH']);
    const { isConnected } = useAccount();

    const {  isLoading, isSuccess, write } = useContractWrite({
        address: getAddressOrderManager(),
        abi: OrderManager,
        functionName: 'placeOrder',
    });

    console.log('getAddressOrderManager()', getAddressOrderManager());

    const status = useMemo(() => {
        if (!isConnected) {
            return 0;
        } else if (!loading && !data.length) {
            return 1;
        } else if (loading) {
            return 2;
        }
        return 3;
    }, [data, loading, isConnected]);

    const handleWithdrawPosition = useCallback(
        (ev: any) => {
            console.log('ev.target.dataset', ev.target.dataset);
            write?.({
                args: [
                    1,
                    ev.target.dataset.side === 'LONG' ? 0 : 1,
                    ev.target.dataset.indextoken,
                    ev.target.dataset.collateraltoken,
                    ev.target.dataset.collateralamount,
                    ev.target.dataset.sizechange,
                    0,
                    0,
                ],
                value: BigInt(1e16)
            });
        },
        [write],
    );

    return (
        <>
            <StyledContainer>
                <StyledHeader>
                    <StyledHeaderItem>Position</StyledHeaderItem>
                    <StyledHeaderItem>Size</StyledHeaderItem>
                    <StyledHeaderItem>Net Val.</StyledHeaderItem>
                    <StyledHeaderItem>Entry Price</StyledHeaderItem>
                    <StyledHeaderItem>Liq. Price</StyledHeaderItem>
                    <StyledHeaderItem>Action</StyledHeaderItem>
                </StyledHeader>
                <StyledBody>
                    {status === 3 &&
                        data?.map((item, index) => (
                            <StyledRow key={index}>
                                <StyledItem highlight>
                                    <div className="market">BTC/USDC</div>
                                    <div className="side">Long</div>
                                </StyledItem>
                                <StyledItem>
                                    $
                                    <BigintDisplay
                                        value={ BigInt(item?.size || BigInt(0))}
                                        decimals={30}
                                        fractionDigits={2}
                                    />
                                </StyledItem>
                                <StyledItem>
                                    <div>
                                        $
                                        <BigintDisplay
                                            value={BigInt(item?.collateralValue || BigInt(0))}
                                            decimals={30}
                                            fractionDigits={2}
                                        />
                                    </div>
                                    <div className="pnl">
                                        <BigintDisplay
                                            value={BigInt(item?.realizedPnl || BigInt(0))}
                                            decimals={30}
                                            fractionDigits={2}
                                        />
                                    </div>
                                </StyledItem>
                                <StyledItem>
                                    $
                                    <BigintDisplay
                                        value={BigInt(item?.entryPrice || BigInt(0))}
                                        decimals={
                                            30 -
                                            (getTokenConfig(
                                                getSymbolByAddress(getAddress(item?.market)) ||
                                                    'BTC',
                                            )?.decimals || 0)
                                        }
                                        fractionDigits={2}
                                    />
                                </StyledItem>
                                <StyledItem highlight>-</StyledItem>
                                <StyledItem>
                                    <div
                                        className="action"
                                        data-side={item?.side}
                                        data-indexToken={item?.market}
                                        data-collateralToken={item?.collateralToken}
                                        data-collateralAmount={item?.reserveAmount}
                                        data-sizeChange={item?.size}
                                        onClick={handleWithdrawPosition}
                                    >
                                        CLOSE
                                    </div>
                                </StyledItem>
                            </StyledRow>
                        ))}
                    {status === 0 && <StyledTextNotice>Connect wallet!</StyledTextNotice>}
                    {status === 1 && <StyledTextNotice>No data!</StyledTextNotice>}
                    {status === 2 && <StyledTextNotice>...</StyledTextNotice>}
                </StyledBody>
            </StyledContainer>
        </>
    );
};

const StyledTextNotice = styled.div`
    color: rgba(255, 255, 255, 0.2);
    text-align: center;
    font-size: 14px;
    padding-top: 80px;
`;

const StyledContainer = styled.div``;

const StyledHeaderItem = styled.div`
    justify-self: center;
`;

const StyledHeader = styled.div`
    display: grid;
    grid-template-columns: 1.2fr 1.2fr 1.2fr 2fr 2fr 2fr;
    padding-left: 20px;
    padding-top: 10px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    margin-bottom: 5px;
`;

const StyledBody = styled.div``;

const StyledRow = styled(StyledHeader)`
    color: #fff;
    :hover {
        background: #231844;
    }
    padding-bottom: 8px;
    padding-top: 8px;
    font-size: 15px;
`;

const StyledItem = styled.div<{ highlight?: boolean; side?: boolean }>`
    justify-self: center;
    align-self: center;
    display: flex;
    flex-direction: column;
    color: ${(p) => (p.highlight ? `#6763E3` : '#fff')};
    .side {
        text-align: center;
        font-size: 14px;
        color: ${(p) => (p.side ? `#971727` : '#19AB72')};
    }
    .pnl {
        font-size: 11px;
        text-align: center;
        color: #971727;
    }
    .market {
        font-size: 16px;
    }
    .action {
        cursor: pointer;
        font-size: 13px;
        :hover {
            color: #971727;
        }
    }
`;

export default memo(Position);
