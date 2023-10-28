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
    const { address } = useAccount();
    const lastBlockUpdate = useLastBlockUpdate();

    const [selector, setSelector] = useState(1);

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

    return (
        // <>
        //     <div className="container-positon-panel">
        //         <Box sx={{ width: '100%' }}>
        //             <CustomTabPanel value={value} index={0}>
        //                 <div className="padding-for-header-table">
        //                     <div className="header-table-position">
        //                         <div className="header-title-position">Position</div>
        //                         <div className="header-title-position">Size</div>
        //                         <div className="header-title-position">Net Value</div>
        //                         <div className="header-title-position">Entry Price</div>
        //                         <div className="header-title-position">Liquidation Price</div>
        //                         <div className="header-title-position">Action</div>
        //                     </div>
        //                 </div>
        //                 {positions.map((item, index) => (
        //                     <div className="padding-for-body-table" key={index}>
        //                         <div className="content-body-table">
        //                             <div className="header-table-position header-table-position-2">
        //                                 <div className="header-title-position">
        //                                     <span className="token-positon">{getTokenConfig(
        //                                         getSymbolByAddress(getAddress(item?.market)) || 'BTC',
        //                                     )?.symbol}/USD</span>
        //                                     <p className="long-shot-position">{item?.side}</p>
        //                                 </div>
        //                                 <div className="header-title-position">
        //                                     <span className="size-position">
        //                                         $
        //                                         <BigintDisplay
        //                                             value={BigInt(item?.size)}
        //                                             decimals={30}
        //                                             fractionDigits={2}
        //                                         />
        //                                     </span>
        //                                 </div>
        //                                 <div className="header-title-position">
        //                                     <span className="net-value-top">
        //                                         $
        //                                         <BigintDisplay
        //                                             value={BigInt(item?.collateralValue)}
        //                                             decimals={30}
        //                                             fractionDigits={2}
        //                                         />
        //                                     </span>
        //                                     <span className="net-value-bottom">
        //                                         $
        //                                         <BigintDisplay
        //                                             value={BigInt(item?.realizedPnl)}
        //                                             decimals={30}
        //                                             fractionDigits={2}
        //                                         />
        //                                     </span>
        //                                 </div>
        //                                 <div className="header-title-position">
        //                                     <span className="entry-price-position">
        //                                         {' '}
        //                                         $
        //                                         <BigintDisplay
        //                                             value={BigInt(item?.entryPrice)}
        //                                             decimals={
        //                                                 30 -
        //                                                 (getTokenConfig(
        //                                                     getSymbolByAddress(getAddress(item?.market)) || 'BTC',
        //                                                 )?.decimals || 0)
        //                                             }
        //                                             fractionDigits={2}
        //                                         />
        //                                     </span>
        //                                 </div>
        //                                 <div className="header-title-position">
        //                                     <span className="liquidation-price-position">-</span>
        //                                 </div>
        //                                 <div className="header-title-position">Close</div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 ))}
        //             </CustomTabPanel>
        //             <CustomTabPanel value={value} index={1}>
        //                 <div className="padding-for-header-table">
        //                     <div className="header-table-position">
        //                         <div className="header-title-position">Position</div>
        //                         <div className="header-title-position">Size</div>
        //                         <div className="header-title-position">Position Type</div>
        //                         <div className="header-title-position">Mark Price</div>
        //                         <div className="header-title-position">Order Type</div>
        //                         <div className="header-title-position">Action</div>
        //                     </div>
        //                 </div>
        //                 {orders.map((item, index) => (
        //                     <div className="padding-for-body-table" key={index}>
        //                         <div className="content-body-table">
        //                             <div className="header-table-position header-table-position-2">
        //                                 <div className="header-title-position">
        //                                     <span className="token-positon">{getTokenConfig(
        //                                         getSymbolByAddress(getAddress(item?.indexToken)) || 'BTC',
        //                                     )?.symbol}/USD</span>
        //                                     <span className="long-shot-position">{item.side}</span>
        //                                 </div>
        //                                 <div className="header-title-position">
        //                                     <span className="size-position">
        //                                         $
        //                                         <BigintDisplay
        //                                             value={BigInt(item?.sizeChange)}
        //                                             decimals={30}
        //                                             fractionDigits={2}
        //                                         />
        //                                     </span>
        //                                 </div>

        //                                 <div className="header-title-position">
        //                                     <p className="entry-price-position">
        //                                         {item.positionType}
        //                                     </p>
        //                                 </div>
        //                                 <div className="header-title-position">
        //                                     <p className="entry-price-position">
        //                                         $
        //                                         <BigintDisplay
        //                                             value={BigInt(item?.price)}
        //                                             decimals={
        //                                                 30 -
        //                                                 (getTokenConfig(
        //                                                     getSymbolByAddress(getAddress(item?.indexToken)) || 'BTC',
        //                                                 )?.decimals || 0)
        //                                             }
        //                                             fractionDigits={2}
        //                                         />
        //                                     </p>
        //                                 </div>
        //                                 <div className="header-title-position">
        //                                     <p className="liquidation-price-position">{item.orderType}</p>
        //                                 </div>
        //                                 <div className="header-title-position">Cancel</div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 ))}
        //             </CustomTabPanel>
        //             <CustomTabPanel value={value} index={2}>
        //                 Item Three
        //             </CustomTabPanel>
        //         </Box>
        //     </div>
        // </>

        <StyledContainer>
            <StyledRouter>
                <StyledItemRouter
                    width={85}
                    active={selector === 1}
                    onClick={() => setSelector(1)}
                >
                    Positions
                </StyledItemRouter>
                <StyledItemRouter
                    width={48}
                    active={selector === 2}
                    onClick={() => setSelector(2)}
                >
                    Orders
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
                {selector === 2 && <Orders  data={orders} loading={loading}/>}
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
`;

export default memo(PositionPanel);
