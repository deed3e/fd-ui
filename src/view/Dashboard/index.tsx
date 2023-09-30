import styled from 'styled-components';
import DashboardBackground from '../../assets/image/bg_dashboard.png';
import DashboardItem from './components/DashboardItem';
import { ReactComponent as TradingVolume } from '../../assets/icons/ic_trading_volume.svg';
import { ReactComponent as AccuredFees } from '../../assets/icons/ic_accured_fees.svg';
import { ReactComponent as TotalUsers } from '../../assets/icons/ic_total_users.svg';
import { ReactComponent as UnderManager } from '../../assets/icons/ic_under_manager.svg';
import { useContractRead } from 'wagmi';
import { getAddressPool } from '../../config';
import Pool from '../../abis/Pool.json';
import { BigintDisplay } from '../../component/BigIntDisplay';
import { getDashboardItemData } from '../../apis/dashboard';
import { DashboardItemDataType, SwapType } from '../../types';
import { useQuery } from '@tanstack/react-query';

const Dashboard: React.FC = () => {

    const dataReadTotalPool = useContractRead({
        address: getAddressPool(),
        abi: Pool,
        functionName: 'getPoolValue',
    });

    const dashboardItemDataQuery = useQuery({
        queryKey: ['getSwapsByCondition'],
        queryFn: () => getDashboardItemData(),
    });

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
                        <>
                            <DashboardItem img={<TradingVolume />} title='Total Trading Volume' value={<BigintDisplay value={dashboardItemDataQuery.data?.totalTradingVolumn as BigInt} decimals={30} currency="USD" />} status={<BigintDisplay value={dashboardItemDataQuery.data?.totalTradingVolumnChange as BigInt} decimals={30} fractionDigits={2} threshold={0.01} currency="USD" />}></DashboardItem>
                            <DashboardItem img={<UnderManager />} title='Assets Under Manager' value={<BigintDisplay value={dataReadTotalPool.data as BigInt} decimals={30} currency="USD" />} status={<BigintDisplay value={dashboardItemDataQuery.data?.assetsUnderManagementChange as BigInt} decimals={30} fractionDigits={2} threshold={0.01} currency="USD" />}></DashboardItem>
                            <DashboardItem img={<AccuredFees />} title='Accured Fees' value={<BigintDisplay value={dashboardItemDataQuery.data?.accuredFees as BigInt} decimals={30} fractionDigits={2} threshold={0.01} currency="USD" />} status={<BigintDisplay value={dashboardItemDataQuery.data?.accuredFeesChange as BigInt} decimals={30} fractionDigits={2} threshold={0.01} currency="USD" />}></DashboardItem>
                            <DashboardItem img={<TotalUsers />} title='Total User' value={dashboardItemDataQuery.data?.totalUserCount} status={dashboardItemDataQuery.data?.totalUserCountChange}></DashboardItem>
                        </>
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
    font-size: 38px;
    text-align: center;
    margin-bottom: 7px;
`;

const StyledAltText = styled.p`
    color: rgba(255, 255, 255, 0.5);
    font-family: IBM Plex Mono;
    font-size: 13px;
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
