import { memo, useState, useEffect, Suspense } from 'react';
import * as React from 'react';
import { graphClient } from '../../../../utils/constant';
import { gql } from 'graphql-request';
import { useAccount } from 'wagmi';
import { BigintDisplay } from '../../../../component/BigIntDisplay';
import { getAddressOrderManager, getSymbolByAddress, getTokenConfig } from '../../../../config';
import { MarketInfo } from '../..';
import { useLastBlockUpdate } from '../../../../contexts/ApplicationProvider';
import styled from 'styled-components';
import Orders from './components/Orders';
import Position from './components/Position';

const History = React.lazy(() => import('./components/History'));

const query = gql`
    query _query($wallet: String!) {
        orders(orderBy: id, where: { wallet: $wallet, status: "OPEN" }, orderDirection: asc) {
            status
            sizeChange
            side
            price
            positionType
            orderType
            indexToken
            expiresAt
            collateralToken
            collateralAmount
            id
        }

        positions(where: { wallet: $wallet }) {
            id
            entryPrice
            entryInterestRate
            createdAtTimestamp
            collateralValue
            collateralToken
            leverage
            market
            realizedPnl
            reserveAmount
            side
            size
            status
        }
    }
`;

export type OrderData = {
    status: string;
    sizeChange: string;
    side: string;
    price: string;
    positionType: string;
    orderType: string;
    indexToken: string;
    expiresAt: string;
    collateralToken: string;
    collateralAmount: string;
    id: string;
};

export type PositionData = {
    id: string;
    entryPrice: string;
    entryInterestRate: string;
    createdAtTimestamp: string;
    collateralValue: string;
    collateralToken: string;
    leverage: string;
    market: string;
    realizedPnl: string;
    reserveAmount: string;
    side: string;
    size: string;
    status: string;
};

const PositionPanel: React.FC<MarketInfo> = ({ current }) => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [positions, setPositions] = useState<PositionData[]>([]);
    const [lastCount, setLastCount] = useState<{ position: number; order: number }>({
        position: 0,
        order: 0,
    });
    const { address } = useAccount();
    const lastBlockUpdate = useLastBlockUpdate();

    const [selector, setSelector] = useState(1);

    useEffect(() => {
        switch (selector) {
            case 1:
                setLastCount({
                    position: positions?.length,
                    order: lastCount.order,
                });
                break;
            case 2:
                setLastCount({
                    position: lastCount.position,
                    order: orders?.length,
                });
        }
    }, [selector, orders?.length, positions?.length, lastCount.position, lastCount.order]);

    const handleSetLastCount = (num: number) => {
        switch (num) {
            case 1:
                setLastCount({
                    position: positions?.length,
                    order: lastCount.order,
                });
                break;
            case 2:
                setLastCount({
                    position: lastCount.position,
                    order: orders?.length,
                });
        }
    };

    useEffect(() => {
        let mounted = true;
        graphClient
            .request(query, {
                wallet: address?.toLowerCase(),
            })
            .then((res: any) => {
                if (!mounted) {
                    return;
                }
                console.log('res', res);

                const dataPosition = res?.positions
                    ?.filter((x: PositionData) => x.collateralValue !== '0')
                    ?.map((p: PositionData) => {
                        return {
                            id: p.id,
                            entryPrice: p.entryPrice,
                            entryInterestRate: p.entryInterestRate,
                            createdAtTimestamp: p.createdAtTimestamp,
                            collateralValue: p.collateralValue,
                            collateralToken: p.collateralToken,
                            leverage: p.leverage,
                            market: p.market,
                            realizedPnl: p.realizedPnl,
                            reserveAmount: p.reserveAmount,
                            side: p.side,
                            size: p.size,
                            status: p.status,
                        } as PositionData;
                    });

                const dataOrder = res?.orders?.map((p: OrderData) => {
                    return {
                        id: p.id,
                        sizeChange: p.sizeChange,
                        price: p.price,
                        positionType: p.positionType,
                        orderType: p.orderType,
                        indexToken: p.indexToken,
                        expiresAt: p.expiresAt,
                        side: p.side,
                        collateralToken: p.collateralToken,
                        collateralAmount: p.collateralAmount,
                        status: p.status,
                    } as OrderData;
                });

                setPositions(dataPosition);
                setOrders(dataOrder);
                setLoading(false);
            })
            .catch((err) => {
                console.log('err', err);
                setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [address, lastBlockUpdate]);

    console.log('lastCount', lastCount);

    return (
        <StyledContainer>
            <StyledRouter>
                <StyledItemRouter
                    width={95}
                    active={selector === 1}
                    onClick={() => {
                        handleSetLastCount(1);
                        setSelector(1);
                    }}
                >
                    <div>Positions</div>
                    <StyledPointNum
                        active={selector === 1 || positions?.length !== lastCount?.position}
                    >
                        <div>{positions?.length ?? ''}</div>
                    </StyledPointNum>
                </StyledItemRouter>
                <StyledItemRouter
                    width={68}
                    active={selector === 2}
                    onClick={() => {
                        handleSetLastCount(2);
                        setSelector(2);
                    }}
                >
                    <div>Orders</div>
                    <StyledPointNum
                        active={selector === 2 || orders?.length !== lastCount?.order}
                    >
                        <div>{orders?.length ?? ''}</div>
                    </StyledPointNum>
                </StyledItemRouter>
                <StyledItemRouter
                    width={68}
                    active={selector === 3}
                    onClick={() => setSelector(3)}
                >
                    History
                </StyledItemRouter>
            </StyledRouter>
            <StyledBody>
                {selector === 1 && <Position data={positions} loading={loading} />}
                {selector === 2 && <Orders data={orders} loading={loading} />}
                {selector === 3 && (
                    <Suspense fallback={<></>}>
                        <History />
                    </Suspense>
                )}
            </StyledBody>
        </StyledContainer>
    );
};

const StyledContainer = styled.div`
    height: 100%;
    width: 100%;
    background: #0f091e;
`;
const StyledBody = styled.div``;

const StyledPointNum = styled.div<{ active?: boolean }>`
    background: ${(p) => (p.active ? '#6763E3' : 'rgba(255, 255, 255, 0.4)')};
    width: 15px;
    height: 15px;
    border-radius: 50%;
    color: ${(p) => (p.active ? '#fff' : 'rgba(255, 255, 255, 0.4)')};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
`;

const StyledRouter = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    height: 46px;
    border-bottom: solid 1px #363636;
    padding-left: 20px;
    gap: 22px;
`;

const StyledItemRouter = styled.div<{ active?: boolean; width?: number }>`
    cursor: pointer;
    color: ${(p) => (p.active ? '#fff' : 'rgba(255, 255, 255, 0.4)')};
    font-size: 14px;
    font-weight: ${(p) => (p.active ? '700' : '500')};
    width: ${(p) => (p.width ? `${p.width}px` : 'auto')};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
`;

export default memo(PositionPanel);
