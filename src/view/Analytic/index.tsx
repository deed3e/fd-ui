import styled from 'styled-components';
import FeeChart from './components/FeeChart';
import { graphClient } from '../../utils/constant';
import { gql } from 'graphql-request';
import { useEffect, useState } from 'react';

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

const Analytics: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Fee[]>([]);

    useEffect(() => {
        let mounted = true;
        graphClient
            .request(query, {
                start: Math.round((new Date().getTime() - 30 * 86400 * 1000) / 1000),
                end: Math.round(new Date().getTime() / 1000),
            })
            .then(
                (res: any) => {
                    if (!mounted) {
                        return;
                    }
                    console.log('res', res)
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
                    setData(data);
                    setLoading(false);
                },
            )
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
