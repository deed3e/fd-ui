import styled from 'styled-components';
import FeeChart from './components/FeeChart';
import { graphClient } from '../../utils/constant';
import { gql } from 'graphql-request';
import { useEffect, useState } from 'react';
import VolumeUserRankChart from './components/VolumeUserRankChart';
import NewUserChart from './components/NewUserChart';

const query = gql`
    query fee($start: Int!, $end: Int!) {
        feeDailies(
            where: { timestamp_gte: $start, timestamp_lte: $end }
            orderBy: timestamp
            orderDirection: asc
        ) {
            id
            timestamp
            trade
            swap
            liquidity
            liquidation
            total
            cumulative
        }
        userDailies(
            where: { timestamp_gte: $start, timestamp_lte: $end }
            orderBy: timestamp
            orderDirection: asc
        ) {
            timestamp
            id
            cumulative
            total
        }
        volumeByUsers(orderBy: total, orderDirection: asc) {
            id
            swap
            total
            trading
        }
    }
`;

export type Fee = {
    timestamp: number;
    trade: number;
    swap: number;
    liquidity: number;
    liquidation: number;
    total: number;
    cumulative: number;
};
export type VolumeByUser = {
    wallet: number;
    trading: number;
    swap: number;
    total: number;
};
export type NewUser = {
    timestamp: number;
    total: number;
    cumulative: number;
};

const Analytics: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Fee[]>([]);
    const [volumeByUserData, setVolumeByUserData] = useState<VolumeByUser[]>([]);
    const [newUserData, setNewUserData] = useState<NewUser[]>([]);

    useEffect(() => {
        let mounted = true;
        graphClient
            .request(query, {
                start: Math.round((new Date().getTime() - 30 * 86400 * 1000) / 1000),
                end: Math.round(new Date().getTime() / 1000),
            })
            .then((res: any) => {
                if (!mounted) {
                    return;
                }
                console.log('res', res);
                const data = res?.feeDailies?.map((p: Fee) => {
                    return {
                        timestamp: +p.timestamp,
                        trade: +parseFloat((p.trade / 1e30).toString()),
                        swap: +parseFloat((p.swap / 1e30).toString()),
                        liquidity: +parseFloat((p.liquidity / 1e30).toString()),
                        liquidation: +parseFloat((p.liquidation / 1e30).toString()),
                        total: +parseFloat((p.total / 1e30).toString()),
                        cumulative: +parseFloat((p.cumulative / 1e30).toString()),
                    } as Fee;
                });
                const volumeData = res?.volumeByUsers?.map((p: any) => {
                    return {
                        wallet: p?.id,
                        trading:+parseFloat((p?.trading / 1e30).toString()),
                        swap: +parseFloat((p?.swap / 1e30).toString()),
                        total: +parseFloat((p?.total / 1e30).toString()),
                    } as VolumeByUser;
                });
                const userData = res?.userDailies?.map((p: NewUser) => {
                    return {
                        timestamp: +p.timestamp,
                        total: +p.total,
                        cumulative: +p.cumulative,
                    } as NewUser;
                });
                setNewUserData(userData);
                setVolumeByUserData(volumeData)
                setData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.log('err', err);
                setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);
    return (
        <StyledContainer>
            <StyledItem>
                <FeeChart data={data} loading={loading} />
            </StyledItem>
            <StyledItem>
                <VolumeUserRankChart data={volumeByUserData} loading={loading} />
            </StyledItem>
            <StyledItem>
                <NewUserChart data={newUserData} loading={loading} />
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
    gap: 20px;
`;

const StyledItem = styled.div`
    height: 450px;
    width: 600px;
    background: #0f091e;
`;
