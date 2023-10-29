import { memo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import styled from 'styled-components';
import './history.scss';
import { useAccount } from 'wagmi';
import { getHistories } from '../../../../../apis/History';
import { BigintDisplay } from '../../../../../component/BigIntDisplay';
import { getSymbolByAddress, getTokenConfig } from '../../../../../config';
import { getAddress } from 'viem';

const History: React.FC = () => {

    const { address, isConnected } = useAccount();

    const histories = useQuery({
        queryKey: ['GetHistories'],
        queryFn: () => getHistories(address || ''),
    });

    console.log("his", histories.data);

    return <>
        <StyledContainer>
            <StyledHeader>
                <StyledHeaderItem>Collateral Token</StyledHeaderItem>
                <StyledHeaderItem>Entry Price</StyledHeaderItem>
                <StyledHeaderItem>Index Token</StyledHeaderItem>
                <StyledHeaderItem>Pnl</StyledHeaderItem>
                <StyledHeaderItem>Side</StyledHeaderItem>
                <StyledHeaderItem>Size</StyledHeaderItem>
            </StyledHeader>
            <StyledBody>
                {histories?.data?.map((item: any, index: any) => (
                    <StyledRow key={index}>
                        <StyledItem highlight>
                            {item?.collateralToken?.slice(0, 3) +
                                '...' +
                                item?.collateralToken?.slice(item?.collateralToken.length - 4, item?.collateralToken.length)
                            }
                        </StyledItem>
                        <StyledItem highlight>
                            <BigintDisplay
                                value={BigInt(item?.entryPrice || BigInt(0))}
                                decimals={
                                    30 -
                                    (getTokenConfig(
                                        getSymbolByAddress(getAddress(item?.indexToken)) ||
                                        'BTC',
                                    )?.decimals || 0)
                                }
                                fractionDigits={2}
                            />
                        </StyledItem>
                        <StyledItem highlight>
                            {item?.indexToken?.slice(0, 3) +
                                '...' +
                                item?.indexToken?.slice(item?.indexToken.length - 4, item?.indexToken.length)
                            }
                        </StyledItem>
                        <StyledItem highlight>
                            {item?.pnl.sig > 0 ? item?.pnl.abs : '-' + item?.pnl.abs}

                        </StyledItem>
                        <StyledItem highlight>
                            {item?.side}
                        </StyledItem>
                        <StyledItem highlight>
                            <BigintDisplay
                                value={BigInt(item?.size || BigInt(0))}
                                decimals={
                                    30 -
                                    (getTokenConfig(
                                        getSymbolByAddress(getAddress(item?.collateralToken)) ||
                                        'BTC',
                                    )?.decimals || 0)
                                }
                                fractionDigits={2}
                            />
                        </StyledItem>

                    </StyledRow>
                ))}
            </StyledBody>
        </StyledContainer>
    </>;
};

export default memo(History);


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
    grid-template-columns:  2fr 2fr 1fr 1fr 1fr 1fr;
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

