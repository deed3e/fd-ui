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
import InputTokenWithoutSelect from './components/InputTokenWithoutSelect';
import Button from '@mui/material/Button';
import twoIconDown from '../../../../assets/svg/two-icon-down.svg';

import OrderManager from '../../../../abis/OrderManager.json';
import Oracle from '../../../../abis/Oracle.json';
import Pool from '../../../../abis/Pool.json';
import Mock from '../../../../abis/MockERC20.json';
import { BigintDisplay } from '../../../../component/BigIntDisplay';

import IcLoading from '../../../../assets/image/ic-loading.png';

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
    getAddressOracle,
} from '../../../../config';

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

enum ButtonStatus {
    notConnect,
    notInput,
    loading,
    notApprove,
    ready,
    insufficientPool,
    insufficientBalance,
    sameToken,
    minInput, // min 10 u
    timeOutOracle,
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

import {
    IHistoryTransaction,
    StatusHistoryTransaction,
} from '../../../../component/TransactionHistory';

import { store } from '../../../../utils/store';
import { useShowToast } from '../../../../hooks/useShowToast';

const MIN_VALUE_INPUT = 9.9 * 1e8; // 10u

const PlaceOrderPanel: React.FC = () => {
    const theme = useTheme();
    const { market } = useParams();

    const tokentmp = market?.toUpperCase();
    const [token, setToken] = useState(tokentmp || 'BTC');

    const tokenConfigSizeChange = getTokenConfig(token || 'BTC');

    const getPriceTokenConfigSizeChange = useContractRead({
        address: getAddressOracle(),
        abi: Oracle,
        functionName: 'getPrice',
        args: [getAddress(tokenConfigSizeChange?.address ?? '')],
    });

    const [value, setValue] = useState(0);
    const [selectOrder, setSelectOrder] = useState('Market Order');
    const showToast = useShowToast();
    const [inputPay, setInputPay] = useState<BigInt>(BigInt(0));
    const [inputTokenTwo, setInputTokenTwo] = useState<BigInt>(BigInt(0));
    const [tokenPay, setTokenPay] = useState<string>('BTC');
    const [tokenTwo, setTokenTwo] = useState<string>(token);
    const [valueInput, setValueInput] = useState<number>(0);
    const [valueInputTokenTwo, setValueInputTokenTwo] = useState<number>(0);
    const [leverage, setLeverage] = useState<string>('2x');
    const [side, setSide] = useState(0);
    const [positionType, setPositionType] = useState(0);
    const [sizeChange, setSizeChange] = useState<BigInt>(BigInt(0));
    const [indexToken, setIndexToken] = useState(getTokenConfig('BTC')?.address);
    const [priceOfOrderType, setPriceOfOrderType] = useState<BigInt>(BigInt(0));
    const [orderType, setOrderType] = useState(0);
    const [collateralValue, setCollateralValue] = useState<BigInt>(BigInt(0));
    const [entryPriceLimitOrder, setEntryPriceLimitOrder] = useState<BigInt>(BigInt(0));
    const [priceToPlaceOrder, setPriceToPlaceOrder] = useState<BigInt>(BigInt(0));
    const [liquidationPrice, setLiquidationPrice] = useState<BigInt>(BigInt(0));
    const [fee, setFee] = useState<BigInt>(BigInt(0));
    const [pnl, setPnl] = useState<BigInt>(BigInt(0));
    const [indexPrice, setIndexPrice] = useState<BigInt>(BigInt(0));
    const [insufficientBalance, setInsufficientBalance] = useState<boolean>(true);

    const getLiquidationFee = useContractRead({
        address: getAddressPool(),
        abi: Pool,
        functionName: 'fee',
    });
    // const [liquidationFee, setLiquidationFee] = useState<BigInt>(
    //     getLiquidationFee.data[6] as BigInt,
    // );

    // const [positionFee, setPositionFee] = useState<BigInt>(getLiquidationFee.data[7] as BigInt);

    // useEffect(() => {
    //     const positionFeeTmp: bigint = positionFee;
    //     const divisor: bigint = 10000000000n;

    //     var valueOfFee = positionFee * sizeChange;
    //     valueOfFee = valueOfFee / divisor;

    //     setFee(valueOfFee);
    // }, [sizeChange, positionFee]);

    // useEffect(() => {
    //     var valueOfPnl = collateralValue - (fee + liquidationFee);
    //     setPnl(valueOfPnl);
    // }, [liquidationFee, fee, collateralValue]);

    // useEffect(() => {
    //     if (side === 0) {
    //         if (selectOrder === 'Market Order') {
    //             if (
    //                 getPriceTokenConfigSizeChange.data > BigInt(0) &&
    //                 sizeChange / getPriceTokenConfigSizeChange.data > BigInt(0)
    //             ) {
    //                 var indexPrice =
    //                     pnl / (sizeChange / getPriceTokenConfigSizeChange.data) +
    //                     getPriceTokenConfigSizeChange.data;
    //                 setIndexPrice(indexPrice);
    //             } else {
    //                 setIndexPrice(BigInt(0));
    //             }
    //         } else {
    //             if (
    //                 entryPriceLimitOrder > BigInt(0) &&
    //                 sizeChange / entryPriceLimitOrder > BigInt(0)
    //             ) {
    //                 var indexPrice =
    //                     pnl / (sizeChange / entryPriceLimitOrder) + entryPriceLimitOrder;
    //                 setIndexPrice(indexPrice);
    //             } else {
    //                 setIndexPrice(BigInt(0));
    //             }
    //         }
    //     } else {
    //         if (selectOrder === 'Market Order') {
    //             if (
    //                 getPriceTokenConfigSizeChange.data > BigInt(0) &&
    //                 sizeChange / getPriceTokenConfigSizeChange.data > BigInt(0)
    //             ) {
    //                 var indexPrice =
    //                     getPriceTokenConfigSizeChange.data -
    //                     pnl / (sizeChange / getPriceTokenConfigSizeChange.data);
    //                 setIndexPrice(indexPrice);
    //             } else {
    //                 setIndexPrice(BigInt(0));
    //             }
    //         } else {
    //             if (
    //                 entryPriceLimitOrder > BigInt(0) &&
    //                 sizeChange / entryPriceLimitOrder > BigInt(0)
    //             ) {
    //                 var indexPrice =
    //                     gentryPriceLimitOrder - pnl / (sizeChange / entryPriceLimitOrder);
    //                 setIndexPrice(indexPrice);
    //             } else {
    //                 setIndexPrice(BigInt(0));
    //             }
    //         }
    //     }
    // }, [pnl, sizeChange, inputTokenTwo, side, entryPriceLimitOrder, selectOrder]);

    const tokenBTCConfig = getTokenConfig('BTC');
    const tokenETHConfig = getTokenConfig('ETH');
    const tokenUSDCConfig = getTokenConfig('USDC');
    const tokenWETHConfig = getTokenConfig('WETH');

    const { address, isConnected } = useAccount();

    const getPrice = useOracle(['BTC', 'ETH', 'USDC', 'WETH']); //['BTC','ETH']

    const getPriceETH = useContractRead({
        address: getAddressOracle(),
        abi: Oracle,
        functionName: 'getPrice',
        args: [getAddress(tokenETHConfig?.address ?? '')],
    });

    const getPriceBTC = useContractRead({
        address: getAddressOracle(),
        abi: Oracle,
        functionName: 'getPrice',
        args: [getAddress(tokenBTCConfig?.address ?? '')],
    });

    const getPriceUSDC = useContractRead({
        address: getAddressOracle(),
        abi: Oracle,
        functionName: 'getPrice',
        args: [getAddress(tokenUSDCConfig?.address ?? '')],
    });

    const getPriceWETH = useContractRead({
        address: getAddressOracle(),
        abi: Oracle,
        functionName: 'getPrice',
        args: [getAddress(tokenWETHConfig?.address ?? '')],
    });

    const [price, setPrice] = useState<BigInt>(BigInt(0));

    const addressOrderManager = getAddressOrderManager();

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
        setInputPay(BigInt(0));
        setSide(newValue);
        setValue(newValue);
    };

    const handleChangeIndex = (index: number) => {
        setValue(index);
    };

    const handleInsufficientBalance = useCallback((check: boolean) => {
        setInsufficientBalance(check);
    }, []);

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
        // if (orderType == 0) {
        setPrice(amount);
    }, []);

    useEffect(() => {
        var tokenGet = market?.toUpperCase();
        setToken(tokenGet || 'BTC');
    }, [market]);

    useMemo(() => {
        var tokenGet = market?.toUpperCase();
        setToken(tokenGet || 'BTC');
    }, [token]);

    const amountPayChange = useCallback((value: BigInt) => {
        setInputPay(value);
    }, []);

    const amountTokenTwoChange = useCallback(
        (value: BigInt) => {
            setInputTokenTwo(sizeChange);
        },
        [sizeChange],
    );

    const handleTokenPayChange = useCallback((symbol: string) => {
        setTokenPay(symbol);
    }, []);

    const handleTokenTwoChange = useCallback(
        (symbol: string) => {
            setTokenTwo(token);
        },
        [token],
    );

    const handleValueInput = useCallback(
        (value: number) => {
            setValueInput(Math.round(formatUnits(value, tokenConfig?.decimals)));
        },
        [tokenConfig?.decimals],
    );

    const handleValueInputTokenTwo = useCallback(
        (value: number) => {
            setValueInputTokenTwo(sizeChange);
        },
        [tokenConfigTwo?.decimals],
    );

    useEffect(() => {
        var amountRealUserInput: bigint = inputPay;
        var priceOfTokenConfig =
            tokenConfig?.symbol == 'BTC'
                ? getPriceBTC.data
                : tokenConfig?.symbol == 'ETH'
                ? getPriceETH.data
                : tokenConfig?.symbol == 'USDC'
                ? getPriceUSDC.data
                : tokenConfig?.symbol == 'WETH'
                ? getPriceWETH.data
                : BigInt(0);

        setCollateralValue(amountRealUserInput * priceOfTokenConfig);
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
    }, [inputPay, leverage, getPrice, side, collateralValue]);

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
            priceToPlaceOrder,
            orderType,
        ],
    });

    const dataAlowance = useContractRead({
        address: getAddress(tokenConfig?.address ?? ''),
        abi: Mock,
        functionName: 'allowance',
        args: [address, addressOrderManager],
    });

    const contractWriteApprove = useContractWrite({
        address: getAddress(tokenConfig?.address ?? ''),
        abi: Mock,
        functionName: 'approve',
        args: [addressOrderManager, inputPay],
    });

    const waitingForTransactionApprove = useWaitForTransaction({
        hash: contractWriteApprove?.data?.hash,
    });

    const waitingForTransactionPlaceOrder = useWaitForTransaction({
        hash: contractWritePlaceOrder?.data?.hash,
    });

    const handlerPlaceOrder = useCallback(() => {
        if (selectOrder === 'Market Order') {
            setPriceToPlaceOrder(BigInt(0));
        } else {
            var value = parseUnits(
                price.toString(),
                30 - (tokenConfigSizeChange?.decimals ?? 0),
            ) as BigInt;
            setPriceToPlaceOrder(value);
        }

        if (inputPay <= dataAlowance?.data) {
            contractWritePlaceOrder?.write();
        } else {
            contractWriteApprove?.write();
            dataAlowance.refetch();
        }
    }, [contractWritePlaceOrder]);

    const balancePool = useBalance({
        address: getAddressPool(),
        token: tokenConfig?.address,
    });

    useEffect(() => {
        var value = parseUnits(
            price.toString(),
            tokenConfigSizeChange?.decimals ?? 0,
        ) as BigInt;
        var priceToken =
            tokenConfigSizeChange?.symbol === 'BTC'
                ? getPriceBTC.data
                : tokenConfigSizeChange?.symbol === 'ETH'
                ? getPriceETH.data
                : tokenConfigSizeChange?.symbol === 'USDC'
                ? getPriceUSDC.data
                : tokenConfigSizeChange?.symbol === 'WETH'
                ? getPriceWETH.data
                : BigInt(0);
        setEntryPriceLimitOrder(value * priceToken);
    }, [price]);

    // useEffect(() => {
    //     console.log("TokenTwo",valueInputTokenTwo);
    //     console.log("entry price limit",entryPriceLimitOrder);

    //     if(selectOrder === 'Market Order'){
    //         if(side === 0){

    //         }else {

    //         }
    //     }else{

    //     }

    // }, [valueInputTokenTwo,entryPriceLimitOrder,getPriceTokenConfigSizeChange.data,inputPay]);

    const status = useMemo(() => {
        if (!isConnected) {
            return ButtonStatus.notConnect;
        } else if (!inputPay) {
            return ButtonStatus.notInput;
        } else if (insufficientBalance) {
            return ButtonStatus.insufficientBalance;
        } else if (inputPay < MIN_VALUE_INPUT) {
            return ButtonStatus.minInput;
        } else if (
            waitingForTransactionApprove?.isLoading ||
            waitingForTransactionPlaceOrder?.isLoading
        ) {
            return ButtonStatus.loading;
        } else if (dataAlowance?.data < inputPay) {
            return ButtonStatus.notApprove;
        }

        return ButtonStatus.ready;
    }, [
        isConnected,
        inputPay,
        dataAlowance?.data,
        waitingForTransactionApprove?.isLoading,
        waitingForTransactionPlaceOrder?.isLoading,
        insufficientBalance,
    ]);

    const buttonText = useMemo(() => {
        switch (status) {
            case ButtonStatus.notConnect:
                return 'Connect Wallet';
            case ButtonStatus.notInput:
                return 'Enter An Amount';
            case ButtonStatus.insufficientBalance:
                return 'Insufficient Your Balance';
            case ButtonStatus.minInput:
                return 'Min Amount 10 USD';
            case ButtonStatus.loading:
                return ``;
            case ButtonStatus.notApprove:
                return 'Approve';
            default:
                return 'PLACE ORDER';
        }
    }, [status]);

    const disableButton = useMemo(() => {
        if (status !== ButtonStatus.ready && status !== ButtonStatus.notApprove) {
            return true;
        }
        return false;
    }, [status]);

    useEffect(() => {
        const handleStore = () => {
            const localStore: IHistoryTransaction[] | undefined = store.get(address ?? 'guest');
            const current = {
                hash: contractWriteApprove?.data?.hash,
                title: `Approve ${formatUnits(
                    inputPay as bigint,
                    tokenConfig?.decimals ?? 0,
                )} ${tokenConfig?.symbol} `,
                status: waitingForTransactionApprove?.isSuccess
                    ? StatusHistoryTransaction.success
                    : StatusHistoryTransaction.false,
            };
            const newLocalStore = localStore ? [...localStore, current] : [current];
            store.set(address ?? 'guest', newLocalStore);
            contractWriteApprove?.reset();
        };

        if (waitingForTransactionApprove?.isLoading) {
            showToast(`Waiting Approve from token ${tokenConfig?.symbol}`, '', 'warning');
        } else {
            if (waitingForTransactionApprove?.isSuccess) {
                showToast(`Success Approve`, '', 'success');
                dataAlowance?.refetch();
                handleStore();
                // setRefesh(!refresh);
            } else if (waitingForTransactionApprove?.isError) {
                showToast(`Can not Approve`, '', 'error');
                handleStore();
            }
        }
    }, [
        waitingForTransactionApprove?.isLoading,
        waitingForTransactionApprove?.isSuccess,
        waitingForTransactionApprove?.isError,
        showToast,
        dataAlowance?.data,
        tokenConfig?.symbol,
    ]);

    useEffect(() => {
        const handleStore = () => {
            const localStore: IHistoryTransaction[] | undefined = store.get(address ?? 'guest');
            const current = {
                hash: contractWritePlaceOrder?.data?.hash,
                title: `Place order ${formatUnits(
                    inputPay as bigint,
                    tokenConfig?.decimals ?? 0,
                )} ${tokenConfig?.symbol}`,
                status: waitingForTransactionPlaceOrder?.isSuccess
                    ? StatusHistoryTransaction.success
                    : StatusHistoryTransaction.false,
            };
            const newLocalStore = localStore ? [...localStore, current] : [current];
            store.set(address ?? 'guest', newLocalStore);
            contractWritePlaceOrder?.reset();
            dataAlowance?.refetch();
        };

        if (waitingForTransactionPlaceOrder?.isLoading) {
            showToast(
                `Waiting Swap from ${formatUnits(
                    inputPay as bigint,
                    tokenConfig?.decimals ?? 0,
                )} ${tokenConfig?.symbol}`,
                '',
                'warning',
            );
        } else {
            if (waitingForTransactionPlaceOrder?.isSuccess) {
                showToast(`Success place order`, '', 'success');
                handleStore();
                // setRefesh(!refresh);
            } else if (waitingForTransactionPlaceOrder?.isError) {
                showToast(`Can not place order`, '', 'error');
                handleStore();
            }
        }
    }, [
        waitingForTransactionPlaceOrder?.isLoading,
        waitingForTransactionPlaceOrder?.isSuccess,
        waitingForTransactionPlaceOrder?.isError,
        showToast,
        dataAlowance?.data,
        tokenConfig?.symbol,
    ]);

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
                            <div className="padding-more">
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
                                            disable={orderType == 0 ? true : false}
                                            amountChangeHandler={amountChangeHandler}
                                            value={orderType == 0 ? 'Market price' : price}
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
                                        insufficientBalanceChange={handleInsufficientBalance}
                                    />
                                </div>
                                <div className="two-icon-down">
                                    <img src={twoIconDown} alt="twoicon" />
                                </div>
                                <InputTokenWithoutSelect
                                    tokens={tokensTwo}
                                    amountChange={amountTokenTwoChange}
                                    tokenChange={handleTokenTwoChange}
                                    title="Position Size"
                                    disable={true}
                                    valueChange={handleValueInputTokenTwo}
                                    pickToken={token}
                                    value={formatUnits(sizeChange as bigint, 30)}
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
                                {/* <StyleButton className="btn-place-order">
                                    <div onClick={handlerPlaceOrder}>PLACE ORDER</div>
                                </StyleButton> */}

                                <StyledWrapButton>
                                    {/* {buttonText != 'Approve' && ( */}
                                    <StyleButton
                                        onClick={handlerPlaceOrder}
                                        disabled={disableButton}
                                    >
                                        <div>{buttonText}</div>
                                        <img
                                            hidden={status !== ButtonStatus.loading}
                                            src={IcLoading}
                                            alt=""
                                        ></img>
                                    </StyleButton>
                                    {/* )} */}
                                    {/* 
                    {buttonText === 'Approve' && (
                        <StyleButton onClick={handleOnClick} disabled={disableButton}>
                            <div>{buttonText}</div>
                            <img
                                hidden={status !== ButtonStatus.loading}
                                src={IcLoading}
                                alt=""
                            ></img>
                        </StyleButton>
                    )} */}
                                </StyledWrapButton>

                                <div className="info-trading-place-order">
                                    <p className="title-place-order">Collateral Asset</p>
                                    <p className="content-place-order">{tokenConfig?.symbol}</p>
                                </div>

                                <div className="info-trading-place-order">
                                    <p className="title-place-order">Collateral Value</p>
                                    <p className="content-place-order">
                                        <BigintDisplay
                                            value={collateralValue as BigInt}
                                            currency="USD"
                                            decimals={30}
                                        />
                                    </p>
                                </div>

                                <div className="info-trading-place-order">
                                    <p className="title-place-order">Laverage</p>
                                    <p className="content-place-order">{leverage}</p>
                                </div>

                                <div className="info-trading-place-order">
                                    <p className="title-place-order">Entry Price</p>
                                    <p className="content-place-order">
                                        {selectOrder === 'Market Order' && (
                                            <BigintDisplay
                                                value={
                                                    getPriceTokenConfigSizeChange.data as BigInt
                                                }
                                                currency="USD"
                                                decimals={
                                                    30 - tokenConfigSizeChange?.decimals ?? 0
                                                }
                                            />
                                        )}
                                        {selectOrder != 'Market Order' && (
                                            <BigintDisplay
                                                value={entryPriceLimitOrder}
                                                currency="USD"
                                                decimals={30}
                                            />
                                        )}
                                    </p>
                                </div>
                                <div className="info-trading-place-order">
                                    <p className="title-place-order">Liquidation Price</p>
                                    <p className="content-place-order">
                                        {' '}
                                        <BigintDisplay
                                            value={indexPrice}
                                            decimals={30}
                                            threshold={3}
                                            fractionDigits={7}
                                        />
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="leverage-title market-info-title">Market Info</p>
                            </div>
                            <div className="padding-more  padding-top-zero">
                                <div className="info-trading-place-order">
                                    <p className="title-place-order">Borrow Fee</p>
                                    <p className="content-place-order">0</p>
                                </div>

                                <div className="info-trading-place-order">
                                    <p className="title-place-order">Available Liquidity</p>
                                    <p className="content-place-order">
                                        <BigintDisplay
                                            value={balancePool?.data?.value}
                                            decimals={tokenConfig?.decimals ?? 0}
                                            fractionDigits={tokenConfig?.fractionDigits}
                                            threshold={tokenConfig?.threshold}
                                        ></BigintDisplay>{' '}
                                        <span className="title-detail">
                                            {tokenConfig?.symbol}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                            <div className="padding-more">
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
                                            disable={orderType == 0 ? true : false}
                                            amountChangeHandler={amountChangeHandler}
                                            value={orderType == 0 ? 'Market price' : price}
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
                                <InputTokenWithoutSelect
                                    tokens={tokensTwo}
                                    amountChange={amountTokenTwoChange}
                                    tokenChange={handleTokenTwoChange}
                                    title="Position Size"
                                    disable={true}
                                    valueChange={handleValueInputTokenTwo}
                                    pickToken={token}
                                    value={formatUnits(sizeChange as bigint, 30)}
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
                                    <p className="content-place-order">{tokenConfig?.symbol}</p>
                                </div>

                                <div className="info-trading-place-order">
                                    <p className="title-place-order">Collateral Value</p>
                                    <p className="content-place-order">
                                        <BigintDisplay
                                            value={collateralValue as BigInt}
                                            currency="USD"
                                            decimals={30}
                                        />
                                    </p>
                                </div>

                                <div className="info-trading-place-order">
                                    <p className="title-place-order">Laverage</p>
                                    <p className="content-place-order">{leverage}</p>
                                </div>

                                <div className="info-trading-place-order">
                                    <p className="title-place-order">Entry Price</p>
                                    <p className="content-place-order">
                                        {selectOrder === 'Market Order' && (
                                            <BigintDisplay
                                                value={
                                                    getPriceTokenConfigSizeChange.data as BigInt
                                                }
                                                currency="USD"
                                                decimals={
                                                    30 - tokenConfigSizeChange?.decimals ?? 0
                                                }
                                            />
                                        )}
                                        {selectOrder != 'Market Order' && (
                                            <BigintDisplay
                                                value={entryPriceLimitOrder}
                                                currency="USD"
                                                decimals={30}
                                            />
                                        )}
                                    </p>
                                </div>
                                <div className="info-trading-place-order">
                                    <p className="title-place-order">Liquidation Price</p>
                                    <p className="content-place-order">
                                        <BigintDisplay
                                            value={indexPrice}
                                            decimals={30}
                                            threshold={3}
                                            fractionDigits={7}
                                        />
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="leverage-title market-info-title">Market Info</p>
                            </div>
                            <div className="padding-more padding-top-zero">
                                <div className="info-trading-place-order">
                                    <p className="title-place-order">Borrow Fee</p>
                                    <p className="content-place-order">0</p>
                                </div>

                                <div className="info-trading-place-order">
                                    <p className="title-place-order">Available Liquidity</p>
                                    <p className="content-place-order">
                                        <BigintDisplay
                                            value={balancePool?.data?.value}
                                            decimals={tokenConfig?.decimals ?? 0}
                                            fractionDigits={tokenConfig?.fractionDigits}
                                            threshold={tokenConfig?.threshold}
                                        ></BigintDisplay>{' '}
                                        <span className="title-detail">
                                            {tokenConfig?.symbol}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </TabPanel>
                    </SwipeableViews>
                </div>
            </Box>
        </>
    );
};

export default memo(PlaceOrderPanel);

const StyledWrapButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 18px;
    margin-bottom: 5px;
`;

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
