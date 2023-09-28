import styled from 'styled-components';
import { ChartContainer } from './ChartContainer';

interface ITradingViewPanel {
    setPrice: (current: number, low: number, high: number) => unknown;
}

const TradingViewPanel: React.FC<ITradingViewPanel> = ({ setPrice }) => {
    return (
        <StyledContainer>
            <ChartContainer setPrice={setPrice} />
        </StyledContainer>
    );
};

export default TradingViewPanel;

const StyledContainer = styled.div`
    background-color: #131334;
    border-bottom: 1px solid #2f2f2f;
    height: inherit;
    .container {
        margin: 0;
        padding: 0;
        width: 100%;
        flex: 1;
        max-width: 100%;
    }
`;
