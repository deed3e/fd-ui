import { memo, useState, useEffect } from 'react';
import './positionPanel.scss';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { graphClient } from '../../../../utils/constant';
import { gql } from 'graphql-request';
import { useAccount } from 'wagmi';
import { BigintDisplay } from '../../../../component/BigIntDisplay';
import { getSymbolByAddress, getTokenConfig } from '../../../../config';

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

export type Order = {
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

export type Position = {
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

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const PositionPanel: React.FC = () => {
    const [value, setValue] = React.useState(0);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
    const { address } = useAccount();
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        let mounted = true;
        graphClient
            .request(query, {
                wallet: '0xc0f6b23cf3719493a07727efe9aa86bbc123e184',
            })
            .then((res: any) => {
                if (!mounted) {
                    return;
                }
                console.log('res', res);
                const dataPosition = res?.positions?.map((p: Position) => {
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
                    } as Position;
                });

                const dataOrder = res?.orders?.map((p: Order) => {
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
                    } as Order;
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
    }, [address]);

    return (
        <>
            <div className="container-positon-panel">
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                        >
                            <Tab
                                className="item-header-tab"
                                label="Positions"
                                {...a11yProps(0)}
                            />
                            <Tab className="item-header-tab" label="Orders" {...a11yProps(1)} />
                            <Tab
                                className="item-header-tab"
                                label="History"
                                {...a11yProps(2)}
                            />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <div className="padding-for-header-table">
                            <div className="header-table-position">
                                <div className="header-title-position">Position</div>
                                <div className="header-title-position">Size</div>
                                <div className="header-title-position">Net Value</div>
                                <div className="header-title-position">Entry Price</div>
                                <div className="header-title-position">Liquidation Price</div>
                                <div className="header-title-position">Action</div>
                            </div>
                        </div>
                        {positions.map((item, index) => (
                            <div className="padding-for-body-table" key={index}>
                                <div className="content-body-table">
                                    <div className="header-table-position header-table-position-2">
                                        <div className="header-title-position">
                                            <p className="token-positon">BTC/USD</p>
                                            <p className="long-shot-position">Long</p>
                                        </div>
                                        <div className="header-title-position">
                                            <p className="size-position">
                                                $<BigintDisplay
                                                    value={item.size}
                                                    decimals={30}
                                                />
                                            </p>
                                        </div>
                                        <div className="header-title-position">
                                            <p className="net-value-top">
                                            $<BigintDisplay
                                                    value={item.collateralValue}
                                                    decimals={30}
    
                                                />
                                            </p>
                                            <p className="net-value-bottom">
                                            $<BigintDisplay
                                                    value={item.realizedPnl}
                                                    decimals={30}
    
                                                />
                                            </p>
                                        </div>
                                        <div className="header-title-position">
                                            <p className="entry-price-position"> $<BigintDisplay
                                                    value={item.entryPrice}
                                                    decimals={30 - getTokenConfig(getSymbolByAddress(item.market))?.decimals}
                                                /></p>
                                        </div>
                                        <div className="header-title-position">
                                            <p className="liquidation-price-position">
                                                -
                                            </p>
                                        </div>
                                        <div className="header-title-position">Close</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        Item Two
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        Item Three
                    </CustomTabPanel>
                </Box>
            </div>
        </>
    );
};

export default memo(PositionPanel);
