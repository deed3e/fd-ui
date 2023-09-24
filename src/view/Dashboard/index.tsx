import styled from 'styled-components';
import DashboardBackground from '../../assets/image/bg_dashboard.png';
import DashboardItem from './components/DashboardItem';

const Dashboard: React.FC = () => {
    return (
        <>
            <StyledDashboard>
                <StyledDivTop>
                    <StyledMainText>Decentralized Perpetual Exchange</StyledMainText>
                    <StyledAltText>
                        Trade BTC, ETH, BNB and other top cryptocurrencies with up to 30x
                        leverage directly from your wallet
                    </StyledAltText>
                </StyledDivTop>
                <StyledDivBottom>
                    <DashboardItem></DashboardItem>
                    <DashboardItem></DashboardItem>
                    <DashboardItem></DashboardItem>
                    <DashboardItem></DashboardItem>
                </StyledDivBottom>
            </StyledDashboard>
        </>
    );
};

export default Dashboard;

const StyledDashboard = styled.div`
    width: 100%;
    height: 100vh;
    background-image: url(${DashboardBackground});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center top;=0
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;

const StyledMainText = styled.p`
    color: white;
    font-family: IBM Plex Mono;
    font-size: 36px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    text-align: center;
`;

const StyledAltText = styled.p`
    color: rgba(255, 255, 255, 0.5);
    font-family: IBM Plex Mono;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    width: 643px;
    height: 79px;
`;

const StyledDivTop = styled.div`
    margin-top: 47px;
`;

const StyledDivBottom = styled.div`
    margin-bottom: 41px;
    display: flex;
    align-items: center;
    gap: 20px;
`;
