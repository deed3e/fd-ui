import styled from 'styled-components';
import { ChartContainer } from './ChartContainer';

const TradingViewPanel: React.FC = () => {
  return (
    <StyledContainer>
      <ChartContainer />
    </StyledContainer>
  );
};

export default TradingViewPanel;

const StyledContainer = styled.div`
  background-color: #18181a;
  border-bottom: 1px solid #2f2f2f;
  height: inherit;
  .container {
    flex: 1;
  }
`;
