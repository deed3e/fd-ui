import styled from 'styled-components';
import MarketInfoPanel from './components/MarketInfoPanel';
import PlaceOrderPanel from './components/PlaceOrderPanel';
import PositionPanel from './components/PositionPanel';
import TradingViewPanel from './components/Tradingview/TradingViewPanel';
import { useCallback, useState } from 'react';

export interface MarketInfo {
    current?: number;
    low?: number;
    high?: number;
}

const Trading: React.FC = () => {
    const [price, setPrice] = useState<MarketInfo | undefined>();
    const handleSetPrice = useCallback((current: number, low: number, high: number) => {
        setPrice({
            current,
            low,
            high,
        });
    }, []);

    return (
        <StyledContainer>
            <StyledMarketContainer>
                <MarketInfoPanel current={price?.current} low={price?.low} high={price?.high} />
            </StyledMarketContainer>
            <StyledTradingViewContainer>
                <TradingViewPanel setPrice={handleSetPrice} />
            </StyledTradingViewContainer>
            <StyledPositionContainer>
                <PositionPanel current={price?.current} />
            </StyledPositionContainer>
            <StyledPlaceOrderContainer>
                <PlaceOrderPanel />
            </StyledPlaceOrderContainer>
        </StyledContainer>
    );
};

export default Trading;

const StyledMarketContainer = styled.div`
    grid-area: market;
    height: 100%;
`;

const StyledTradingViewContainer = styled.div`
    grid-area: tradingView;
    height: 100%;
    overflow: hidden;
    width: auto;
`;

const StyledPositionContainer = styled.div`
    grid-area: position;
    width: 100%;
    margin-bottom: 0;
    width: auto;
`;

const StyledContainer = styled.div`
    margin-top: 56px;
    display: grid;
    height: 100%;
    grid-template-columns: calc(100% - 400px) 400px;
    grid-template-rows: 72px 450px auto;
    grid-template-areas:
        'market       placeOrder'
        'tradingView  placeOrder'
        'position     placeOrder';
`;

const StyledPlaceOrderContainer = styled.div`
    width: 100%;
    min-height: calc(100vh - 76px);
    background-color: #29292c;
    border: 1px solid #2f2f2f;
    grid-area: placeOrder;
    margin: 0;
    width: 400px;
`;
