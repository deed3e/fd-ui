import './placeOrderPanel.scss';
import { memo, useState, useCallback, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import styled from 'styled-components';
import { formatUnits, getAddress, parseEther, parseUnits } from 'viem';
import { useOracle } from '../../../../hooks/useOracle';

import { DropdownSelectOrder } from '../PlaceOrderPanel/components/DropdownSelectOrder';
import { ReactComponent as IconArrowDown } from '../../../../assets/svg/ic-arrow-down.svg';

import Input from './components/Input';
import InputTokenWithSelect from '../../../../component/InputToken/InputTokenWithSelect';
import Button from '@mui/material/Button';
import twoIconDown from '../../../../assets/svg/two-icon-down.svg';

import OrderManager from '../../../../abis/OrderManager.json';

import {
    useBalance,
    useContractRead,
    useAccount,
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
    useContractReads,
} from 'wagmi';

import {
    getAllTokenSymbol,
    getWrapNativeTokenSymbol,
    getTokenConfig,
    getAddressPool,
    getAddressRouter,
    getLpSymbol,
    getAddressOrderManager,
} from '../../../../config';

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
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
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const PlaceOrderPanel: React.FC = () => {
    const theme = useTheme();
    const { market } = useParams();

    const token = market?.toUpperCase();

    const [value, setValue] = useState(0);
    const [selectOrder, setSelectOrder] = useState('Market Order');
    const [price, setPrice] = useState<BigInt>(BigInt(0));
    const [inputPay, setInputPay] = useState<BigInt>(BigInt(0));
    const [inputTokenTwo, setInputTokenTwo] = useState<BigInt>(BigInt(0));
    const [tokenPay, setTokenPay] = useState<string>('BTC');
    const [tokenTwo, setTokenTwo] = useState<string>('BTC');
    const [valueInput, setValueInput] = useState<number>(0);
    const [valueInputTokenTwo, setValueInputTokenTwo] = useState<number>(0);
    const [leverage, setLeverage] = useState<string>('2x');
    const [side, setSide] = useState(0);
    const [positionType, setPositionType] = useState(0);
    const [sizeChange, setSizeChange] = useState<BigInt>(BigInt(0));
    const [indexToken, setIndexToken] = useState(getTokenConfig('BTC')?.address);
    const [priceOfOrderType, setPriceOfOrderType] = useState<BigInt>(BigInt(0));
    const [orderType, setOrderType] = useState(0);

    const getPrice = useOracle(['BTC', 'ETH', 'USDC', 'WETH']); //['BTC','ETH']

    const leverages = ['2x', '5x', '10x', '20x', '30x'];

    const tokens = useMemo(() => {
        return getAllTokenSymbol()?.filter((i) => i != 'FLP');
    }, []);

    const tokensTwo = useMemo(() => {
        return getAllTokenSymbol()?.filter((i) => i != 'FLP');
    }, []);

    const tokenConfig = getTokenConfig(tokenPay);

    const tokenConfigTwo = getTokenConfig(tokenPay);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setSide(newValue);
        setValue(newValue);
    };

    const handleChangeIndex = (index: number) => {
        setValue(index);
    };

    const orders = ['Market Order', 'Limit Order'];

    useEffect(() => {
        if (selectOrder === 'Market Order') {
            setPriceOfOrderType(BigInt(0));
            setOrderType(0);
        } else {
            setPriceOfOrderType(price);
            setOrderType(1);
        }
    }, [selectOrder]);

    useEffect(() => {
        var tokenObjectGetFromIndexToken = getTokenConfig(token || 'BTC');
        setIndexToken(tokenObjectGetFromIndexToken?.address);
    }, [token]);

    const onDropDownItemClick = useCallback((symbol: string) => {
        setSelectOrder(symbol);
    }, []);

    const amountChangeHandler = useCallback((amount: BigInt) => {
        setPrice(value);
    }, []);

    const amountPayChange = useCallback((value: BigInt) => {
        setInputPay(value);
    }, []);

    const amountTokenTwoChange = useCallback((value: BigInt) => {
        setInputTokenTwo(value);
    }, []);

    const handleTokenPayChange = useCallback((symbol: string) => {
        setTokenPay(symbol);
    }, []);

    const handleTokenTwoChange = useCallback((symbol: string) => {
        setTokenTwo(symbol);
    }, []);

    const handleValueInput = useCallback(
        (value: number) => {
            setValueInput(Math.round(formatUnits(value, tokenConfig?.decimals)));
        },
        [tokenConfig?.decimals],
    );

    const handleValueInputTokenTwo = useCallback(
        (value: number) => {
            setValueInputTokenTwo(Math.round(formatUnits(value, tokenConfigTwo?.decimals)));
        },
        [tokenConfigTwo?.decimals],
    );

    useEffect(() => {
        var amountRealUserInput: bigint = inputPay;
        var priceOfTokenConfig =
            tokenConfig?.symbol === 'WETH'
                ? getPrice?.WETH
                : tokenConfig?.symbol === 'BTC'
                ? getPrice?.BTC
                : tokenConfig?.symbol === 'USDC'
                ? getPrice?.USDC
                : tokenConfig?.symbol === 'ETH'
                ? getPrice?.ETH
                : 0;
        switch (leverage) {
            case '2x':
                var sizeChange: bigint = amountRealUserInput * 2n * priceOfTokenConfig;
                setSizeChange(sizeChange);
                break;
            case '5x':
                var sizeChange: bigint = amountRealUserInput * 5n * priceOfTokenConfig;
                setSizeChange(sizeChange);
                break;
            case '10x':
                var sizeChange: bigint = amountRealUserInput * 10n * priceOfTokenConfig;
                setSizeChange(sizeChange);
                break;
            case '20x':
                var sizeChange: bigint = amountRealUserInput * 20n * priceOfTokenConfig;
                setSizeChange(sizeChange);
                break;
            case '30x':
                var sizeChange: bigint = amountRealUserInput * 30n * priceOfTokenConfig;
                setSizeChange(sizeChange);
                break;
        }
    }, [inputPay, leverage, getPrice]);

    const contractWritePlaceOrder = useContractWrite({
        address: getAddressOrderManager(),
        abi: OrderManager,
        value: BigInt(1e16),
        functionName: 'placeOrder',
        args: [
            0,
            side,
            indexToken,
            tokenConfig?.address,
            inputPay,
            sizeChange,
            price,
            orderType,
        ],
    });

    const handlerPlaceOrder = useCallback(() => {
        contractWritePlaceOrder?.write();
    }, [contractWritePlaceOrder]);

    return (
        <>
            <Box sx={{ bgcolor: 'background.paper', width: 500 }}>
                <AppBar position="static">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="secondary"
                        textColor="inherit"
                        aria-label="tabs example"
                    >
                        <Tab className="tab-trading" label="LONG" {...a11yProps(0)} />
                        <Tab className="tab-trading" label="SHORT" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <div className="trading-panel">
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={value}
                        onChangeIndex={handleChangeIndex}
                        style={{ background: '#29292c' }}
                    >
                        <TabPanel value={value} index={0} dir={theme.direction}>
                            <div className="order-price-title">
                                <p className="order-type">Order Type</p>
                                <p className="price-trading">Price</p>
                            </div>
                            <div className="dropdown-price">
                                <StyledSelectToken>
                                    <DropdownSelectOrder
                                        selectedOrder={selectOrder}
                                        orders={orders}
                                        position={'right'}
                                        onSelect={onDropDownItemClick}
                                    >
                                        <StyledTokenSelect pointer={orders?.length >= 0}>
                                            <span>{selectOrder}</span>
                                            <IconArrowDown />
                                        </StyledTokenSelect>
                                    </DropdownSelectOrder>
                                </StyledSelectToken>
                                <div className="input-cpn">
                                    <Input
                                        disable={false}
                                        amountChangeHandler={amountChangeHandler}
                                    />
                                </div>
                            </div>
                            <div className="pay-input-select">
                                <InputTokenWithSelect
                                    tokens={tokens}
                                    amountChange={amountPayChange}
                                    tokenChange={handleTokenPayChange}
                                    title="Pay"
                                    disable={false}
                                    disableSelect={false}
                                    valueChange={handleValueInput}
                                />
                            </div>
                            <div className="two-icon-down">
                                <img src={twoIconDown} alt="twoicon" />
                            </div>
                            <InputTokenWithSelect
                                tokens={tokensTwo}
                                amountChange={amountTokenTwoChange}
                                tokenChange={handleTokenTwoChange}
                                title="Position Size"
                                disable={true}
                                disableSelect={false}
                                valueChange={handleValueInputTokenTwo}
                            />
                            <div>
                                <p className="leverage-title">Leverage</p>
                            </div>
                            <div className="item-leverage-container">
                                {leverages?.map((i) => (
                                    <div
                                        className={`item-leverage ${
                                            i === leverage ? 'active-leverage' : ''
                                        }`}
                                        onClick={() => setLeverage(i)}
                                    >
                                        {i}
                                    </div>
                                ))}
                            </div>
                            <StyleButton className="btn-place-order">
                                <div onClick={handlerPlaceOrder}>PLACE ORDER</div>
                            </StyleButton>

                            <div className="info-trading-place-order">
                                <p className="title-place-order">Collateral Asset</p>
                                <p className="content-place-order">BTC</p>
                            </div>

                            <div className="info-trading-place-order">
                                <p className="title-place-order">Collateral Value</p>
                                <p className="content-place-order">-</p>
                            </div>

                            <div className="info-trading-place-order">
                                <p className="title-place-order">Laverage</p>
                                <p className="content-place-order">-</p>
                            </div>

                            <div className="info-trading-place-order">
                                <p className="title-place-order">Entry Price</p>
                                <p className="content-place-order">-</p>
                            </div>
                            <div className="info-trading-place-order">
                                <p className="title-place-order">Liquidation Price</p>
                                <p className="content-place-order">-</p>
                            </div>
                            <div>
                                <p className="leverage-title market-info-title">Market Info</p>
                            </div>

                            <div className="info-trading-place-order">
                                <p className="title-place-order">Borrow Fee</p>
                                <p className="content-place-order">0</p>
                            </div>

                            <div className="info-trading-place-order">
                                <p className="title-place-order">Available Liquidity</p>
                                <p className="content-place-order">-</p>
                            </div>
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                            Item Two
                        </TabPanel>
                    </SwipeableViews>
                </div>
            </Box>
        </>
    );
};

export default memo(PlaceOrderPanel);

const StyledSelectToken = styled.div`
    justify-self: self-end;
    align-self: center;
    display: flex;
    align-items: center;
`;

export const StyledToken = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: fit-content;
    padding: 2px;
    border-radius: 1000px;
    border: solid 1px #363636;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    padding: 6px 0px;
    span {
        padding-right: 6px;
        padding-left: 6px;
    }
    svg {
        width: 8px;
        margin-right: 6px;
        path {
            fill: #adabab;
        }
    }
`;

const StyledTokenSelect = styled(StyledToken)<{ pointer?: boolean }>`
    cursor: ${({ pointer }) => (pointer ? 'pointer' : 'auto')};
    :hover {
        border: 1px solid #515050;
    }
`;

const StyleButton = styled.button`
    width: 100%;
    color: #fff;
    height: 37px;
    border-radius: 10px;
    background: #6763e3;
    display: flex;
    justify-content: center;
    align-items: center;
    :hover {
        background: #5552a9;
    }
    :disabled {
        background: #2a2a38;
    }
    div {
        font-weight: 700;
        font-size: 15px;
    }
    img {
        height: 15px;
        animation: loading 1.5s linear infinite;
    }
`;
