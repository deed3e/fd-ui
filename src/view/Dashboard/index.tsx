import styled from 'styled-components';
import DashboardBackground from '../../assets/image/bg_dashboard.png';
import DashboardItem from './components/DashboardItem';
import { ReactComponent as TradingVolume } from '../../assets/icons/ic_trading_volume.svg';
import { ReactComponent as AccuredFees } from '../../assets/icons/ic_accured_fees.svg';
import { ReactComponent as TotalUsers } from '../../assets/icons/ic_total_users.svg';
import { ReactComponent as UnderManager } from '../../assets/icons/ic_under_manager.svg';

const Dashboard: React.FC = () => {
    return (
        <>
            <StyledDashboard>
                <StyledDivTop>
                    <StyledMainText>Decentralized Perpetual Exchange</StyledMainText>
                    <StyledAltText>
                        Trade BTC, ETH, BNB and other top cryptocurrencies with up to<br />30x
                        leverage directly from your wallet
                    </StyledAltText>
                </StyledDivTop>
                <StyledDivBottom>
                    <DashboardItem img={<TradingVolume />} title='Total Trading Volume' value='$12345' status='$12345'></DashboardItem>
                    <DashboardItem img={<UnderManager />} title='Assets Under Manager' value='$12345' status='$12345'></DashboardItem>
                    <DashboardItem img={<AccuredFees />} title='Accured Fees' value='$12345' status='$12345'></DashboardItem>
                    <DashboardItem img={<TotalUsers />} title='Total User' value='$12345' status='$12345'></DashboardItem>
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
    background-position: center top;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    display: flex;
    flex-direction: column;
`;

const StyledMainText = styled.p`
    color: white;
    font-family: Jockey One;
    font-size: 36px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-align: center;
    margin-bottom: 7px;
`;

const StyledAltText = styled.p`
    color: rgba(255, 255, 255, 0.5);
    font-family: IBM Plex Mono;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-align: center;
    margin-top: 7px;
`;

const StyledDivTop = styled.div`
    padding-top: 47px;
`;

const StyledDivBottom = styled.div`
    padding-bottom: 41px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
`;
