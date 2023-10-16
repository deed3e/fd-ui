import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MarketInfo } from '../..';
import styled from 'styled-components';
import { TokenSymbol } from '../../../../component/TokenSymbol';
import { DropdownSelectToken } from '../../../Faucet/components/DropdownSelectToken';
import { ReactComponent as IconArrowDown } from '../../../../assets/svg/ic-arrow-down.svg';
import { BigintDisplay } from '../../../../component/BigIntDisplay';
import ContentLoader from '../../../../component/ContentLoader';

const MarketInfoPanel: React.FC<MarketInfo> = ({ current, low, high }) => {
    const { market, side } = useParams();
    const token = market?.toUpperCase() || 'BTC';
    const [lastPrice, setLastPrice] = useState<number | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const incre = useMemo(() => {
        let res = true;
        if (current && lastPrice) {
            res = current < lastPrice;
        }
        setLastPrice(current);
        return res;
    }, [current]);

    useEffect(() => {
        if (current) setLoading(false);
    }, [current]);

    const handleSelectToken = useCallback((symbol: string) => {
        navigate(`/trading/${symbol}/${side}`);
        setLoading(true);
    }, []);
    return (
        <StyledContainer>
            <StyledWrapSymbol>
                <TokenSymbol symbol={token} size={38} />
                <div>
                    <StyledSelectToken>
                        <DropdownSelectToken
                            selectedToken={token}
                            tokens={['BTC', 'ETH']}
                            position={'right'}
                            onSelect={handleSelectToken}
                        >
                            <StyledTokenSelect>
                                <span>{token}/USD</span>
                                <IconArrowDown />
                            </StyledTokenSelect>
                        </DropdownSelectToken>
                    </StyledSelectToken>
                </div>
            </StyledWrapSymbol>
            <StyledBox incre={incre}>
                {loading ? (
                    <ContentLoader.PriceContentLoader />
                ) : (
                    <BigintDisplay
                        value={BigInt(Math.trunc((current ?? 0) * 1e6))}
                        currency="USD"
                        decimals={6}
                    />
                )}
            </StyledBox>
        </StyledContainer>
    );
};

export default memo(MarketInfoPanel);

const StyledContainer = styled.div`
    height: 100%;
    display: flex;
    justify-items: center;
    align-items: center;
    padding-left: 22px;
    background: #0f091e;
    border-bottom: #363636 solid 0.5px;
`;

const StyledWrapSymbol = styled.div`
    display: flex;
    justify-items: center;
    align-items: center;
`;

const StyledBox = styled.div<{ incre?: boolean }>`
    padding-left: 22px;
    font-size: 16px;
    font-weight: 600;
    color: ${(p) => (p.incre ? '#35ca65' : '#E43E53')};
`;

const StyledSelectToken = styled.div`
    padding: 5px;
    font-size: 17px;
    font-weight: 600;
    color: #fff;
    span {
        padding-right: 6px;
        padding-left: 6px;
    }
    svg {
        width: 10px;
        margin-right: 6px;
        path {
            fill: #adabab;
        }
    }
`;

const StyledTokenSelect = styled.div`
    cursor: pointer;
    :hover {
        path {
            fill: #fff;
        }
    }
`;
