import styled from 'styled-components';
import FeeChart from './components/FeeChart';

const Analytics: React.FC = () => {
    return (
        <StyledContainer>
            <StyledItem>
                <FeeChart />
            </StyledItem>
        </StyledContainer>
    );
};

export default Analytics;

const StyledContainer = styled.div`
    padding-top: 120px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap:20px;
`;

const StyledItem = styled.div`
    height: 450px;
    width: 600px;
    background: #0F091E;
`;
