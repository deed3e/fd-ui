import { memo, useState } from 'react';
import { Address, useContractWrite } from 'wagmi';
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

type CloseProps = {
    side: number;
    indexToken: Address;
    collateralToken: Address;
    collateralAmount: BigInt;
    sizeChange: BigInt;
};
const Position: React.FC<{ data: PositionData[]; loading: boolean; }> = ({ data, loading }) => {
    const [propsClosePosition, setPropsClosePosition] = useState<CloseProps>();
    const priceIndex = useOracle(['BTC', 'ETH']);

    const contractWriteCloseOrder = useContractWrite({
        address: getAddressOrderManager(),
        abi: OrderManager,
        value: BigInt(1e16),
        functionName: 'placeOrder',
        args: [
            1,
            propsClosePosition?.side,
            propsClosePosition?.indexToken,
            propsClosePosition?.collateralToken,
            propsClosePosition?.collateralAmount,
            propsClosePosition?.sizeChange,
            0,
            0,
        ],
    });
   
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
                    {data?.map((item, index) => (
                        <StyledRow key={index}>
                            <StyledItem highlight>
                                <div className="market">BTC/USDC</div>
                                <div className="side">Long</div>
                            </StyledItem>
                            <StyledItem>
                                $
                                <BigintDisplay
                                    value={BigInt(item?.size)}
                                    decimals={30}
                                    fractionDigits={2}
                                />
                            </StyledItem>
                            <StyledItem>
                                <div>
                                    $
                                    <BigintDisplay
                                        value={BigInt(item?.collateralValue)}
                                        decimals={30}
                                        fractionDigits={2}
                                    />
                                </div>
                                <div className="pnl">
                                    <BigintDisplay
                                        value={BigInt(item?.realizedPnl)}
                                        decimals={30}
                                        fractionDigits={2}
                                    />
                                </div>
                            </StyledItem>
                            <StyledItem>
                                $
                                <BigintDisplay
                                    value={BigInt(item?.entryPrice)}
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
                                <div className="action">CLOSE</div>
                            </StyledItem>
                        </StyledRow>
                    ))}
                </StyledBody>
            </StyledContainer>
        </>
    );
};

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
