import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
    Address,
    useAccount,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from 'wagmi';
import {
    getAddressOrderManager,
    getSymbolByAddress,
    getTokenConfig,
} from '../../../../../config';
import OrderManager from '../../../../../abis/OrderManager.json';
import { OrderData, PositionData } from '..';
import styled from 'styled-components';
import { BigintDisplay } from '../../../../../component/BigIntDisplay';
import { getAddress } from 'viem';
import { useOracle } from '../../../../../hooks/useOracle';
import { useShowToast } from '../../../../../hooks/useShowToast';

const Orders: React.FC<{ data: OrderData[]; loading: boolean }> = ({ data, loading }) => {
    //const priceIndex = useOracle(['BTC', 'ETH']);
    const [loadWrite, setLoadWrite] = useState(false);
    const [loadSign, setLoadSign] = useState(false);
    const { isConnected } = useAccount();
    const showToast = useShowToast();
    const contractWrite :any = useContractWrite({
        address: getAddressOrderManager(),
        abi: OrderManager,
        functionName: 'cancelOrder',
    });

    const waitingContractWrite = useWaitForTransaction({
        hash: contractWrite?.data?.hash,
    });

    useEffect(() => {
        if (contractWrite?.isLoading && !loadSign) {
            showToast(`Request sign transaction`, '', 'warning');
            setLoadSign(true);
        } else if (contractWrite?.isSuccess && loadSign) {
            setLoadSign(false);
        } else if (contractWrite?.isError && loadSign) {
            showToast(`Sign failse`, '', 'error');
            setLoadSign(false);
        }
    }, [loadSign, contractWrite?.isError, contractWrite?.isSuccess, contractWrite?.isLoading]);

    useEffect(() => {
        if (waitingContractWrite?.isLoading && !loadWrite) {
            showToast(`Waiting transaction cancel order`, '', 'warning');
            setLoadWrite(true);
        } else if (waitingContractWrite?.isSuccess && loadWrite) {
            showToast(`Cancel order success`, '', 'success');
            setLoadWrite(false);
        } else if (waitingContractWrite?.isError && loadWrite) {
            showToast(`Cancel order failse`, '', 'error');
            setLoadWrite(false);
        }
    }, [loadWrite, waitingContractWrite?.isError, waitingContractWrite?.isSuccess, waitingContractWrite?.isLoading]);

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

    const handle = useCallback(
        (ev: any) => {
            contractWrite?.write?.({
                args: [ev.target.dataset.id],
            });
        },
        [contractWrite],
    );

    return (
        <>
            <StyledContainer>
                <StyledHeader>
                    <StyledHeaderItem>Position</StyledHeaderItem>
                    <StyledHeaderItem>Size</StyledHeaderItem>
                    <StyledHeaderItem>Position Type</StyledHeaderItem>
                    <StyledHeaderItem>Mark Price</StyledHeaderItem>
                    <StyledHeaderItem>Order Type</StyledHeaderItem>
                    <StyledHeaderItem>Action</StyledHeaderItem>
                </StyledHeader>
                <StyledBody>
                    {status === 3 &&
                        data?.map((item, index) => (
                            <StyledRow key={index}>
                                <StyledItem highlight>
                                    <div className="market">
                                        {
                                            getTokenConfig(
                                                getSymbolByAddress(
                                                    getAddress(item?.indexToken),
                                                ) || 'BTC',
                                            )?.symbol
                                        }
                                        /
                                        {
                                            getTokenConfig(
                                                getSymbolByAddress(
                                                    getAddress(item?.collateralToken),
                                                ) || 'BTC',
                                            )?.symbol
                                        }
                                    </div>
                                    <div className="side">{item?.side}</div>
                                </StyledItem>
                                <StyledItem>
                                    $
                                    <BigintDisplay
                                        value={BigInt(item?.sizeChange)}
                                        decimals={30}
                                        fractionDigits={2}
                                    />
                                </StyledItem>
                                <StyledItem>{item.positionType}</StyledItem>

                                <StyledItem>
                                    $
                                    <BigintDisplay
                                        value={BigInt(item?.price || BigInt(0))}
                                        decimals={
                                            30 -
                                            (getTokenConfig(
                                                getSymbolByAddress(
                                                    getAddress(item?.indexToken),
                                                ) || 'BTC',
                                            )?.decimals || 0)
                                        }
                                        fractionDigits={2}
                                    />
                                </StyledItem>
                                <StyledItem>
                                    <div>{item.orderType}</div>
                                </StyledItem>
                                <StyledItem>
                                    <div className="action" data-id={item?.id} onClick={handle}>
                                        CANCEL
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

export default memo(Orders);
