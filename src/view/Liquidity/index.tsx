import './liquidity.scss';
import { BigintDisplay } from '../../component/BigIntDisplay';
import style from 'styled-components';
import IcLoading from '../../assets/image/ic-loading.png';
import { store } from '../../utils/store';

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import BankImage from '../../assets/image/liquidity-bank.svg';
import icon3 from '../../assets/image/icon3.svg';
import icon2 from '../../assets/image/icon2.svg';
import TIcon from '../../assets/tokens/USDC.png';
import WETH from '../../assets/tokens/WETH2.png';

import { useOracle } from '../../hooks/useOracle';
import { useCallback, useEffect, useMemo, useState } from 'react';
import InputTokenWithSelect from '../../component/InputToken/InputTokenWithSelect';
import InputTokenWithSelectLiquid from './components/InputTokenWithSelectLiquid';
import InputToken from '../../component/InputToken/InputToken';
import SelectToken from '../../component/InputToken/selectToken';

import {
    getAllTokenSymbol,
    getWrapNativeTokenSymbol,
    getTokenConfig,
    getAddressPool,
    getAddressRouter,
    getLpSymbol,
} from '../../config';

// start dialog
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const TransitionRemove = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
//End dialog

import {
    useBalance,
    useContractRead,
    useAccount,
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
    useContractReads,
} from 'wagmi';
import { formatUnits, getAddress, parseEther, parseUnits } from 'viem';
import IER from '../../abis/IERC20.json';
import Mocker from '../../abis/MockERC20.json';
import Router from '../../abis/Router.json';
import Pool from '../../abis/Pool.json';
import { useShowToast } from '../../hooks/useShowToast';
import {
    IHistoryTransaction,
    StatusHistoryTransaction,
} from '../../component/TransactionHistory';

interface TabPanelProps {
    children?: React.ReactNode;
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

enum ButtonStatusRemove {
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

const MIN_VALUE_INPUT = 10; // 10u

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

function createData(
    id: number,
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
    return { id, name, calories, fat, carbs, protein };
}

export default function Liquidity() {
    const [value, setValue] = React.useState(0);
    const showToast = useShowToast();
    const showToastRemove = useShowToast();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    // select
    const [open, setOpen] = React.useState(false);
    const [openRemove, setOpenRemove] = React.useState(false);

    const getPrice = useOracle(['BTC', 'ETH', 'USDC', 'WETH']); //['BTC','ETH']

    const tokenBTCConfig = getTokenConfig('BTC');
    const tokenETHConfig = getTokenConfig('ETH');
    const tokenUSDCConfig = getTokenConfig('USDC');
    const tokenWethConfig = getTokenConfig('WETH');

    const balanceBTC = useBalance({
        address: getAddressPool(),
        token: getAddress(tokenBTCConfig?.address ?? ''),
    });

    const balanceETH = useBalance({
        address: getAddressPool(),
        token: getAddress(tokenETHConfig?.address ?? ''),
    });

    const balanceUSDC = useBalance({
        address: getAddressPool(),
        token: getAddress(tokenUSDCConfig?.address ?? ''),
    });

    const { address, isConnected } = useAccount();

    const balanceWeth = useBalance({
        address: getAddressPool(),
        token: getAddress(tokenWethConfig?.address ?? ''),
    });

    const valueETH = (BigInt(getPrice.ETH ?? 0) *
        BigInt(balanceETH?.data?.value ?? 0)) as bigint;
    const valueBTC = (BigInt(getPrice.BTC ?? 0) *
        BigInt(balanceBTC?.data?.value ?? 0)) as bigint;
    const valueUSDT = (BigInt(getPrice.USDC ?? 0) *
        BigInt(balanceUSDC?.data?.value ?? 0)) as bigint;
    const valueWeth = (BigInt(getPrice.WETH ?? 0) *
        BigInt(balanceWeth?.data?.value ?? 0)) as bigint;

    const dataReadTotalPool = useContractRead({
        address: getAddressPool(),
        abi: Pool,
        functionName: 'getPoolValue',
    });

    const [inputFromAmount, setInputFromAmount] = useState<BigInt>(BigInt(0));
    const [inputRemoveFromAmount, setInputRemoveFromAmount] = useState<BigInt>(BigInt(0));
    const [tokenFrom, setTokenFrom] = useState<string>('BTC');
    const [tokenFromRemove, setTokenFromRemove] = useState<string>('BTC');
    const [minimumReceive, setMinimumReceive] = useState<BigInt>(BigInt(0));
    const [minimumReceiveAdd, setMinimumReceiveAdd] = useState<BigInt>(BigInt(0));
    const [valueInput, setValueInput] = useState<number>(0);

    const tokens = useMemo(() => {
        return getAllTokenSymbol()?.filter((i) => i != 'FLP');
    }, []);

    const tokensRemove = useMemo(() => {
        return getAllTokenSymbol()?.filter((i) => i != 'FLP');
    }, []);

    const amountFromChange = useCallback((value: BigInt) => {
        if (value) {
            setInputFromAmount(value);
        } else {
            setInputFromAmount(BigInt(0));
        }
    }, []);

    const amountRemoveFromChange = useCallback((value: BigInt) => {
        if (value) {
            setInputRemoveFromAmount(value);
            calcRemoveLiquidity.refetch();
        } else {
            setInputRemoveFromAmount(BigInt(0));
            calcRemoveLiquidity.refetch();
        }
    }, []);

    const handleTokenFromChange = useCallback((symbol: string) => {
        setTokenFrom(symbol);
    }, []);

    const handleTokenRemoveFromChange = useCallback((symbol: string) => {
        setTokenFromRemove(symbol);
    }, []);

    const tokenConfig = getTokenConfig(tokenFrom);
    const tokenRemoveConfig = getTokenConfig(tokenFromRemove);
    const addressRouter = getAddressRouter();
    const [refresh, setRefesh] = useState<boolean>();
    const [refreshRemove, setRefeshRemove] = useState<boolean>();
    const [insufficientBalance, setInsufficientBalance] = useState<boolean>(true);
    const [insufficientBalanceRemove, setInsufficientBalanceRemove] = useState<boolean>(true);
    const [targetBTC, setTargetBTC] = useState(0);
    const [targetETH, setTargetETH] = useState(0);
    const [targetUSDC, setTargetUSDC] = useState(0);
    const [targetWETH, setTargetWETH] = useState(0);
    const [weightBTC, setWeightBTC] = useState(0);
    const [weightETH, setWeightETH] = useState(0);
    const [weightUSDC, setWeightUSDC] = useState(0);
    const [weightWETH, setWeightWETH] = useState(0);
    const [lpDecimal, setLpDecimal] = useState(getTokenConfig(getLpSymbol())?.decimals);

    const dataAlowance = useContractRead({
        address: getAddress(tokenConfig?.address ?? ''),
        abi: IER,
        functionName: 'allowance',
        args: [address, addressRouter],
    });

    const dataAlowanceRemove = useContractRead({
        address: getTokenConfig(getLpSymbol())?.address,
        abi: Mocker,
        functionName: 'allowance',
        args: [address, addressRouter],
    });

    const contractWriteApprove = useContractWrite({
        address: getAddress(tokenConfig?.address ?? ''),
        abi: IER,
        functionName: 'approve',
        args: [addressRouter, inputFromAmount],
    });

    const contractWriteApproveRemove = useContractWrite({
        address: getTokenConfig(getLpSymbol())?.address,
        abi: Mocker,
        functionName: 'approve',
        args: [addressRouter, inputRemoveFromAmount],
    });

    const contractWriteAddLiquidity = useContractWrite({
        address: getAddressRouter(),
        abi: Router,
        functionName: 'addLiquidity',
        args: [tokenConfig?.address, inputFromAmount, 0],
    });

    const contractWriteAddLiquidityForBNB = useContractWrite({
        address: getAddressRouter(),
        abi: Router,
        value: inputFromAmount as bigint,
        functionName: 'addLiquidity',
        args: ['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', inputFromAmount, 0],
    });

    const contractWriteRemoveLiquidity = useContractWrite({
        address: getAddressRouter(),
        abi: Router,
        functionName: 'removeLiquidity',
        args: [tokenRemoveConfig?.address, inputRemoveFromAmount, 0],
    });

    const handleAddLiquid = useCallback(() => {
        if (tokenFrom != 'WETH') {
            if (dataAlowance?.data < inputFromAmount) {
                contractWriteApprove.write();
                setRefesh(!refresh);
                setOpen(false);
            } else {
                contractWriteAddLiquidity.write();
                setRefesh(!refresh);
                setOpen(false);
            }
        } else {
            contractWriteAddLiquidityForBNB.write();
            setRefesh(!refresh);
            setOpen(false);
        }
    }, [tokenFrom, inputFromAmount, dataAlowance.data]);

    const handleRemoveLiquid = useCallback(() => {
        if (dataAlowanceRemove?.data < inputRemoveFromAmount) {
            contractWriteApproveRemove.write();
            setRefeshRemove(!refreshRemove);
        } else {
            contractWriteRemoveLiquidity.write();
            setRefeshRemove(!refreshRemove);
            setOpenRemove(false);
        }
    }, [tokenFromRemove, inputRemoveFromAmount, dataAlowanceRemove.data]);

    const { isLoading, isSuccess, isError } = useWaitForTransaction({
        hash: contractWriteAddLiquidity.data?.hash,
    });

    const waitForAddBNB = useWaitForTransaction({
        hash: contractWriteAddLiquidityForBNB.data?.hash,
    });

    const waitForRemoveLiquid = useWaitForTransaction({
        hash: contractWriteRemoveLiquidity.data?.hash,
    });

    const useForApprove = useWaitForTransaction({
        hash: contractWriteApprove.data?.hash,
    });

    const useForApproveRemove = useWaitForTransaction({
        hash: contractWriteApproveRemove.data?.hash,
    });

    useEffect(() => {
        if (useForApprove.isLoading || waitForAddBNB.isLoading) {
            showToast(
                `Waiting request for  ${formatUnits(
                    inputFromAmount as bigint,
                    tokenConfig?.decimals ?? 0,
                )} ${tokenConfig?.symbol === 'WETH' ? 'BNB' : tokenConfig?.symbol}`,
                '',
                'warning',
            );
        }
    }, [
        inputFromAmount,
        tokenConfig?.symbol,
        waitForAddBNB.isLoading,
        contractWriteApprove.isLoading,
        showToast,
    ]);

    useEffect(() => {
        if (useForApproveRemove.isLoading) {
            showToast(
                `Waiting request for ${formatUnits(
                    inputRemoveFromAmount as bigint,
                    getTokenConfig(getLpSymbol())?.decimals ?? 0,
                )} ${getTokenConfig(getLpSymbol())?.symbol}`,
                '',
                'warning',
            );
        }
    }, [
        inputRemoveFromAmount,
        getTokenConfig(getLpSymbol())?.symbol,
        contractWriteApproveRemove.isLoading,
        showToastRemove,
    ]);

    useEffect(() => {
        if (useForApprove.isSuccess) {
            showToast(
                `Success approve  ${formatUnits(
                    inputFromAmount as bigint,
                    tokenConfig?.decimals ?? 0,
                )} ${tokenConfig?.symbol}`,
                '',
                'success',
            );
            dataAlowance.refetch();
            contractWriteApprove.reset();
        }
    }, [inputFromAmount, tokenConfig?.symbol, useForApprove.isSuccess, showToast]);

    useEffect(() => {
        if (useForApproveRemove.isSuccess) {
            showToast(
                `Success approve ${formatUnits(
                    inputRemoveFromAmount as bigint,
                    getTokenConfig(getLpSymbol())?.decimals ?? 0,
                )} ${tokenRemoveConfig?.symbol}`,
                '',
                'success',
            );
            dataAlowanceRemove.refetch();
            contractWriteApproveRemove.reset();
        }
    }, [
        inputRemoveFromAmount,
        tokenRemoveConfig?.symbol,
        useForApproveRemove.isSuccess,
        showToastRemove,
    ]);

    useEffect(() => {
        if (isLoading) {
            showToast(
                `Waiting request for  ${formatUnits(
                    inputFromAmount as bigint,
                    tokenConfig?.decimals ?? 0,
                )} ${tokenConfig?.symbol}`,
                '',
                'warning',
            );
        }
    }, [inputFromAmount, tokenConfig?.symbol, isLoading, waitForAddBNB.isLoading, showToast]);

    useEffect(() => {
        if (waitForRemoveLiquid.isLoading) {
            showToast(
                `Waiting request for  ${formatUnits(
                    inputRemoveFromAmount as bigint,
                    getTokenConfig(getLpSymbol())?.decimals ?? 0,
                )} ${getTokenConfig(getLpSymbol())?.symbol}`,
                '',
                'warning',
            );
        }
    }, [
        inputRemoveFromAmount,
        getTokenConfig(getLpSymbol())?.symbol,
        waitForRemoveLiquid.isLoading,
        showToastRemove,
    ]);

    useEffect(() => {
        if (isSuccess || waitForAddBNB.isSuccess) {
            showToast(
                `Success add ${formatUnits(
                    inputFromAmount as bigint,
                    tokenConfig?.decimals ?? 0,
                )} ${tokenConfig?.symbol}`,
                '',
                'success',
            );
            dataAlowance.refetch();
            contractWriteAddLiquidity.reset();
            contractWriteAddLiquidityForBNB.reset();
        }
    }, [inputFromAmount, tokenConfig?.symbol, isSuccess, waitForAddBNB.isSuccess, showToast]);

    useEffect(() => {
        if (waitForRemoveLiquid.isSuccess) {
            showToast(
                `Success remove ${formatUnits(
                    inputRemoveFromAmount as bigint,
                    getTokenConfig(getLpSymbol())?.decimals ?? 0,
                )} ${getTokenConfig(getLpSymbol())?.symbol}`,
                '',
                'success',
            );
            dataAlowanceRemove.refetch();
            contractWriteRemoveLiquidity.reset();
        }
    }, [
        inputRemoveFromAmount,
        getTokenConfig(getLpSymbol())?.symbol,
        waitForRemoveLiquid.isSuccess,
        showToastRemove,
    ]);

    useEffect(() => {
        if (isSuccess || waitForRemoveLiquid.isSuccess || waitForAddBNB.isSuccess) {
            balanceBTC.refetch();
            balanceETH.refetch();
            balanceUSDC.refetch();
            balanceWeth.refetch();
            dataReadTotalPool.refetch();
        }
    }, [balanceBTC, balanceETH, balanceUSDC, balanceWeth, isSuccess, waitForAddBNB.isSuccess]);

    const calcRemoveLiquidity = useContractRead({
        address: getAddressPool(),
        abi: Pool,
        functionName: 'calcRemoveLiquidity',
        args: [tokenRemoveConfig?.address, inputRemoveFromAmount],
    });

    const calcAddLiquidity = useContractRead({
        address: getAddressPool(),
        abi: Pool,
        functionName: 'calcAddLiquidity',
        args: [tokenConfig?.address, inputFromAmount],
    });

    useEffect(() => {
        if (calcRemoveLiquidity.data != undefined) {
            const initialNumber = BigInt(calcRemoveLiquidity.data);
            const percentageToReduce = BigInt(999); // Giảm 0.1%
            const result = (initialNumber * percentageToReduce) / BigInt(1000); // Chia cho 1000 để lấy phần thập phân
            setMinimumReceive(result);
        }
    }, [calcRemoveLiquidity.data, tokenFromRemove, inputRemoveFromAmount]);

    useEffect(() => {
        if (calcAddLiquidity.data != undefined) {
            const initialNumber = BigInt(calcAddLiquidity.data[0]);
            const percentageToReduce = BigInt(999); // Giảm 0.1%
            const result = (initialNumber * percentageToReduce) / BigInt(1000); // Chia cho 1000 để lấy phần thập phân
            setMinimumReceiveAdd(result);
        }
    }, [calcAddLiquidity.data, tokenFrom, inputFromAmount]);

    const handleValueInput = useCallback(
        (value: number) => {
            setValueInput(Math.round(formatUnits(value, tokenConfig.decimals + 8)));
        },
        [tokenConfig?.decimals],
    );

    const statusForAdd = useMemo(() => {
        if (!isConnected) {
            return ButtonStatus.notConnect;
        } else if (insufficientBalance) {
            return ButtonStatus.insufficientBalance;
        } else if (!inputFromAmount) {
            return ButtonStatus.notInput;
        } else if (valueInput < MIN_VALUE_INPUT || valueInput === 0) {
            return ButtonStatus.minInput;
        } else if (isLoading || useForApprove.isLoading) {
            return ButtonStatus.loading;
        } else if (tokenConfig?.symbol === 'WETH' && !insufficientBalance) {
            return ButtonStatus.ready;
        } else if (
            dataAlowance?.data === BigInt(0) &&
            inputFromAmount > (dataAlowance?.data as BigInt)
        ) {
            return ButtonStatus.notApprove;
        }
        return ButtonStatus.ready;
    }, [
        dataAlowance.data,
        inputFromAmount,
        isConnected,
        tokenFrom,
        valueInput,
        isLoading,
        waitForAddBNB.isLoading,
        waitForRemoveLiquid?.isLoading,
        useForApprove.isLoading,
        useForApproveRemove.isLoading,
    ]);

    const statusForRemove = useMemo(() => {
        if (!isConnected) {
            return ButtonStatusRemove.notConnect;
        } else if (insufficientBalanceRemove) {
            return ButtonStatusRemove.insufficientBalance;
        } else if (!inputRemoveFromAmount) {
            return ButtonStatusRemove.notInput;
        } else if ((inputRemoveFromAmount as bigint) < MIN_VALUE_INPUT) {
            return ButtonStatusRemove.minInput;
        } else if (waitForRemoveLiquid.isLoading || useForApproveRemove.isLoading) {
            return ButtonStatusRemove.loading;
        } else if (inputRemoveFromAmount > (dataAlowanceRemove?.data as BigInt)) {
            return ButtonStatusRemove.notApprove;
        }
        return ButtonStatusRemove.ready;
    }, [
        dataAlowanceRemove.data,
        inputRemoveFromAmount,
        insufficientBalanceRemove,
        isConnected,
        waitForRemoveLiquid?.isLoading,
        useForApproveRemove.isLoading,
    ]);

    const buttonText = useMemo(() => {
        switch (statusForAdd) {
            case ButtonStatus.notConnect:
                return 'Connect Wallet';
            case ButtonStatus.notInput:
                return 'Enter An Amount';
            // case ButtonStatus.timeOutOracle:
            //     return 'Oracle TimeOut';
            case ButtonStatus.insufficientBalance:
                return 'Insufficient Your Balance';
            case ButtonStatus.minInput:
                return 'Min Amount 10 USD';
            // case ButtonStatus.insufficientPool:
            //     return 'Insufficient Pool';
            case ButtonStatus.loading:
                return ``;
            case ButtonStatus.notApprove:
                return 'Approve';
            default:
                return 'Add';
        }
    }, [statusForAdd]);

    const buttonTextRemove = useMemo(() => {
        switch (statusForRemove) {
            case ButtonStatusRemove.notConnect:
                return 'Connect Wallet';
            case ButtonStatusRemove.notInput:
                return 'Enter An Amount';
            // case ButtonStatusRemove.timeOutOracle:
            //     return 'Oracle TimeOut';
            case ButtonStatusRemove.insufficientBalance:
                return 'Insufficient Your Balance';
            case ButtonStatusRemove.minInput:
                return 'Min Amount 10 USD';
            // case ButtonStatusRemove.insufficientPool:
            //     return 'Insufficient Pool';
            case ButtonStatusRemove.loading:
                return ``;
            case ButtonStatusRemove.notApprove:
                return 'Approve';
            default:
                return 'Remove';
        }
    }, [statusForRemove]);

    const handleInsufficientBalance = useCallback((check: boolean) => {
        setInsufficientBalance(check);
    }, []);

    const handleInsufficientBalanceRemove = useCallback((check: boolean) => {
        setInsufficientBalanceRemove(check);
    }, []);

    const disableButton = useMemo(() => {
        if (statusForAdd !== ButtonStatus.ready && statusForAdd !== ButtonStatus.notApprove) {
            return true;
        }
        return false;
    }, [statusForAdd]);

    const disableButtonRemove = useMemo(() => {
        if (
            statusForRemove !== ButtonStatusRemove.ready &&
            statusForRemove !== ButtonStatusRemove.notApprove
        ) {
            return true;
        }
        return false;
    }, [statusForRemove]);

    const readTartgetWeightOfBtc = useContractRead({
        address: getAddressPool(),
        abi: Pool,
        functionName: 'targetWeights',
        args: [getAddress(tokenBTCConfig?.address ?? '')],
    });

    const readTotalWeight = useContractRead({
        address: getAddressPool(),
        abi: Pool,
        functionName: 'totalWeight',
    });

    const readTartgetWeightOfETH = useContractRead({
        address: getAddressPool(),
        abi: Pool,
        functionName: 'targetWeights',
        args: [getAddress(tokenETHConfig?.address ?? '')],
    });

    const readTartgetWeightOfUSDC = useContractRead({
        address: getAddressPool(),
        abi: Pool,
        functionName: 'targetWeights',
        args: [getAddress(tokenUSDCConfig?.address ?? '')],
    });

    const readTartgetWeightOfWETH = useContractRead({
        address: getAddressPool(),
        abi: Pool,
        functionName: 'targetWeights',
        args: [getAddress(tokenWethConfig?.address ?? '')],
    });

    useEffect(() => {
        setTargetBTC(
            (formatUnits(readTartgetWeightOfBtc.data as bigint, tokenBTCConfig?.decimals ?? 0) /
                formatUnits(readTotalWeight.data as bigint, tokenBTCConfig?.decimals ?? 0)) *
                100,
        );
    }, [readTartgetWeightOfBtc.data, readTotalWeight.data]);

    useEffect(() => {
        setTargetETH(
            (formatUnits(
                readTartgetWeightOfETH?.data as bigint,
                tokenETHConfig?.decimals ?? 0,
            ) /
                formatUnits(readTotalWeight.data as bigint, tokenETHConfig?.decimals ?? 0)) *
                100,
        );
    }, [readTartgetWeightOfETH.data, readTotalWeight.data]);

    useEffect(() => {
        setTargetUSDC(
            (formatUnits(
                readTartgetWeightOfUSDC?.data as bigint,
                tokenUSDCConfig?.decimals ?? 0,
            ) /
                formatUnits(readTotalWeight.data as bigint, tokenUSDCConfig?.decimals ?? 0)) *
                100,
        );
    }, [readTartgetWeightOfUSDC.data, readTotalWeight.data]);

    useEffect(() => {
        setTargetWETH(
            (formatUnits(
                readTartgetWeightOfWETH?.data as bigint,
                tokenWethConfig?.decimals ?? 0,
            ) /
                formatUnits(readTotalWeight.data as bigint, tokenWethConfig?.decimals ?? 0)) *
                100,
        );
    }, [readTartgetWeightOfWETH.data, readTotalWeight.data]);

    useEffect(() => {
        setWeightBTC(
            (formatUnits(valueBTC as bigint, 8 + tokenBTCConfig?.decimals ?? 0) /
                formatUnits(dataReadTotalPool.data as bigint, 30)) *
                100,
        );
        setWeightETH(
            (formatUnits(valueETH as bigint, 8 + tokenETHConfig?.decimals ?? 0) /
                formatUnits(dataReadTotalPool.data as bigint, 30)) *
                100,
        );
        setWeightUSDC(
            (formatUnits(valueUSDT as bigint, 8 + tokenUSDCConfig?.decimals ?? 0) /
                formatUnits(dataReadTotalPool.data as bigint, 30)) *
                100,
        );
        setWeightWETH(
            (formatUnits(valueWeth as bigint, 8 + tokenWethConfig?.decimals ?? 0) /
                formatUnits(dataReadTotalPool.data as bigint, 30)) *
                100,
        );
    }, [valueBTC, valueETH, valueUSDT, valueWeth, dataReadTotalPool.data]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickOpenRemove = () => {
        setOpenRemove(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseRemove = () => {
        setOpenRemove(false);
    };

    /// Aprrove Add
    useEffect(() => {
        const handleStore = () => {
            const localStore: IHistoryTransaction[] | undefined = store.get(address ?? 'guest');
            const current = {
                hash: contractWriteApprove?.data?.hash,
                title: `Approve add ${formatUnits(
                    inputFromAmount as bigint,
                    tokenConfig?.decimals ?? 0,
                )} ${tokenConfig?.symbol} `,
                status: useForApprove.isSuccess
                    ? StatusHistoryTransaction.success
                    : StatusHistoryTransaction.false,
            };
            const newLocalStore = localStore ? [...localStore, current] : [current];
            store.set(address ?? 'guest', newLocalStore);
            contractWriteApprove?.reset();
        };
        if (useForApprove.isSuccess) {
            dataAlowance.refetch();
            handleStore();
        } else if (useForApprove.isError) {
            handleStore();
        }
    }, [showToast, useForApprove.isSuccess, useForApprove.isLoading]);

    /// Aprrove Remove
    useEffect(() => {
        const handleStore = () => {
            const localStore: IHistoryTransaction[] | undefined = store.get(address ?? 'guest');
            const current = {
                hash: contractWriteApproveRemove?.data?.hash,
                title: `Approve remove ${formatUnits(
                    inputRemoveFromAmount as bigint,
                    tokenRemoveConfig?.decimals ?? 0,
                )} ${tokenRemoveConfig?.symbol} `,
                status: useForApproveRemove.isSuccess
                    ? StatusHistoryTransaction.success
                    : StatusHistoryTransaction.false,
            };
            const newLocalStore = localStore ? [...localStore, current] : [current];
            store.set(address ?? 'guest', newLocalStore);
            contractWriteApproveRemove?.reset();
        };
        if (useForApproveRemove.isSuccess) {
            dataAlowanceRemove.refetch();
            handleStore();
        } else if (useForApproveRemove.isError) {
            handleStore();
        }
    }, [
        showToast,
        useForApproveRemove.isSuccess,
        contractWriteApproveRemove,
        useForApproveRemove.isLoading,
        contractWriteApproveRemove,
    ]);

    /// Remove
    useEffect(() => {
        const handleStore = () => {
            const localStore: IHistoryTransaction[] | undefined = store.get(address ?? 'guest');
            const current = {
                hash: contractWriteRemoveLiquidity?.data?.hash,
                title: `Remove liquidity ${formatUnits(
                    inputRemoveFromAmount as bigint,
                    tokenRemoveConfig?.decimals ?? 0,
                )} ${tokenRemoveConfig?.symbol} `,
                status: contractWriteRemoveLiquidity.isSuccess
                    ? StatusHistoryTransaction.success
                    : StatusHistoryTransaction.false,
            };
            const newLocalStore = localStore ? [...localStore, current] : [current];
            store.set(address ?? 'guest', newLocalStore);
            contractWriteRemoveLiquidity?.reset();
        };
        if (waitForRemoveLiquid.isSuccess) {
            handleStore();
        } else if (waitForRemoveLiquid.isError) {
            handleStore();
        }
    }, [
        showToast,
        waitForRemoveLiquid.isSuccess,
        waitForRemoveLiquid.isLoading,
        contractWriteRemoveLiquidity,
    ]);

    /// Add
    useEffect(() => {
        const handleStore = () => {
            const localStore: IHistoryTransaction[] | undefined = store.get(address ?? 'guest');
            const current = {
                hash: contractWriteAddLiquidity?.data?.hash,
                title: `Add liquidity ${formatUnits(
                    inputFromAmount as bigint,
                    tokenConfig?.decimals ?? 0,
                )} ${tokenConfig?.symbol} `,
                status: isSuccess
                    ? StatusHistoryTransaction.success
                    : StatusHistoryTransaction.false,
            };
            const newLocalStore = localStore ? [...localStore, current] : [current];
            store.set(address ?? 'guest', newLocalStore);
            contractWriteApprove?.reset();
            dataAlowance?.refetch();
        };
        if (isSuccess) {
            handleStore();
        } else if (isError) {
            handleStore();
        }
    }, [showToast, isSuccess, isLoading, contractWriteApprove]);

    return (
        <div className="content-container">
            <div className="table-container">
                <div className="header-container">
                    <div className="header-content">
                        <img src={BankImage} alt="bank" />
                        <p>Assets Under Management</p>
                    </div>
                    <p className="money-header">
                        {
                            <BigintDisplay
                                value={dataReadTotalPool.data as BigInt}
                                decimals={30}
                                currency="USD"
                            />
                        }
                    </p>
                </div>

                <div className="bottom-left-container">
                    <div className="table-container-detail">
                        <div className="header-table-liquid">
                            <div className="table-head">Asset</div>
                            <div className="table-head">Amount</div>
                            <div className="table-head">Value</div>
                            <div className="table-head">Weight/Target</div>
                        </div>
                        <div className="body-content-lq">
                            <div className="body-table-liquid body-table-liquid-1">
                                <div className="table-content">
                                    <img src={icon3} alt="bank" />
                                </div>
                                <div className="table-content">
                                    {
                                        <BigintDisplay
                                            value={balanceBTC.data?.value as BigInt}
                                            decimals={tokenBTCConfig?.decimals}
                                        />
                                    }
                                </div>
                                <div className="table-content">
                                    <BigintDisplay
                                        value={valueBTC as BigInt}
                                        decimals={8 + tokenBTCConfig?.decimals}
                                        currency="USD"
                                    />
                                </div>
                                <div className="table-content">
                                    <div className="target-percent">
                                        <span
                                            className={
                                                weightBTC < targetBTC
                                                    ? 'green-color'
                                                    : 'red-color'
                                            }
                                        >
                                            <BigintDisplay
                                                value={weightBTC as BigInt}
                                                decimals={0}
                                                fractionDigits={1}
                                            />
                                            %
                                        </span>
                                    </div>
                                    <div className=""> /{targetBTC}% </div>
                                </div>
                            </div>

                            <div className="body-table-liquid">
                                <div className="table-content">
                                    <img src={icon2} alt="bank" />
                                </div>
                                <div className="table-content">
                                    {
                                        <BigintDisplay
                                            value={balanceETH.data?.value as BigInt}
                                            decimals={tokenETHConfig?.decimals}
                                        />
                                    }
                                </div>
                                <div className="table-content">
                                    <BigintDisplay
                                        value={valueETH as BigInt}
                                        decimals={8 + tokenETHConfig?.decimals}
                                        currency="USD"
                                    />
                                </div>
                                <div className="table-content">
                                    <div className="target-percent">
                                        <span
                                            className={
                                                weightETH < targetETH
                                                    ? 'green-color'
                                                    : 'red-color'
                                            }
                                        >
                                            <BigintDisplay
                                                value={weightETH as BigInt}
                                                decimals={0}
                                                fractionDigits={1}
                                            />
                                            %
                                        </span>
                                    </div>
                                    <div className="">/{targetETH}% </div>
                                </div>
                            </div>

                            <div className="body-table-liquid">
                                <div className="table-content">
                                    <img style={{ width: '32px' }} src={TIcon} alt="bank" />
                                </div>
                                <div className="table-content">
                                    {
                                        <BigintDisplay
                                            value={balanceUSDC.data?.value as BigInt}
                                            decimals={tokenUSDCConfig?.decimals}
                                        />
                                    }
                                </div>
                                <div className="table-content">
                                    <BigintDisplay
                                        value={valueUSDT as BigInt}
                                        decimals={8 + tokenUSDCConfig?.decimals}
                                        currency="USD"
                                    />
                                </div>
                                <div className="table-content">
                                    <div className="target-percent">
                                        <span
                                            className={
                                                weightUSDC < targetUSDC
                                                    ? 'green-color'
                                                    : 'red-color'
                                            }
                                        >
                                            <BigintDisplay
                                                value={weightUSDC as BigInt}
                                                decimals={0}
                                                fractionDigits={1}
                                            />
                                            %
                                        </span>
                                    </div>
                                    <div className="">/{targetUSDC}%</div>
                                </div>
                            </div>

                            <div className="body-table-liquid body-table-liquid-last">
                                <div className="table-content">
                                    <img style={{ width: '32px' }} src={WETH} alt="bank" />
                                </div>
                                <div className="table-content">
                                    {
                                        <BigintDisplay
                                            value={balanceWeth.data?.value as BigInt}
                                            decimals={tokenWethConfig?.decimals}
                                        />
                                    }
                                </div>
                                <div className="table-content">
                                    <BigintDisplay
                                        value={valueWeth as BigInt}
                                        decimals={8 + tokenWethConfig?.decimals}
                                        currency="USD"
                                    />
                                </div>
                                <div className="table-content">
                                    <div className="target-percent">
                                        <span
                                            className={
                                                weightWETH < targetWETH
                                                    ? 'green-color'
                                                    : 'red-color'
                                            }
                                        >
                                            <BigintDisplay
                                                value={weightWETH as BigInt}
                                                decimals={0}
                                                fractionDigits={1}
                                            />
                                            %
                                        </span>
                                    </div>
                                    <div className="">/{targetWETH}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="right-containert">
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                        >
                            <Tab
                                label="ADD"
                                {...a11yProps(0)}
                                className={value == 1 ? 'is-Active' : ''}
                            />
                            <Tab
                                label="REMOVE"
                                {...a11yProps(1)}
                                className={value == 0 ? 'is-Active' : ''}
                            />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <StyledContainerDiv>
                            <InputTokenWithSelect
                                tokens={tokens}
                                amountChange={amountFromChange}
                                tokenChange={handleTokenFromChange}
                                title="Amount"
                                refresh={refresh}
                                disable={statusForAdd === ButtonStatus.loading}
                                disableSelect={statusForAdd === ButtonStatus.loading}
                                valueChange={handleValueInput}
                                insufficientBalanceChange={handleInsufficientBalance}
                            />
                        </StyledContainerDiv>
                        <div className="div" style={{ minHeight: '136px' }}>
                            <div className="content-detail content-detail-first">
                                <p className="title-detail">Receive</p>
                                <p className="info-detail">
                                    <div>
                                        {calcAddLiquidity.data != undefined && (
                                            <BigintDisplay
                                                value={calcAddLiquidity.data[0] as BigInt}
                                                decimals={tokenConfig?.decimals}
                                                fractionDigits={5}
                                            />
                                        )}
                                    </div>
                                </p>
                            </div>

                            <div className="content-detail">
                                <p className="title-detail">Slipage</p>
                                <p className="info-detail">0.1 %</p>
                            </div>

                            <div className="content-detail">
                                <p className="title-detail">Minimun Received</p>
                                <p className="info-detail">
                                    <BigintDisplay
                                        value={minimumReceiveAdd as BigInt}
                                        decimals={tokenConfig.decimals}
                                        fractionDigits={5}
                                    />
                                </p>
                            </div>

                            <div className="content-detail">
                                <p className="title-detail">Fees</p>
                                <p className="info-detail">
                                    <div>
                                        {calcAddLiquidity.data != undefined && (
                                            <BigintDisplay
                                                value={calcAddLiquidity.data[1] as BigInt}
                                                decimals={tokenConfig?.decimals}
                                                fractionDigits={5}
                                            />
                                        )}
                                    </div>
                                </p>
                            </div>
                        </div>
                        <div className="button-container">
                            {buttonText != 'Approve' && (
                                <StyleButton
                                    onClick={handleClickOpen}
                                    disabled={disableButton}
                                    className="btn-add"
                                >
                                    <div>{buttonText}</div>
                                    <img
                                        hidden={statusForAdd !== ButtonStatus.loading}
                                        src={IcLoading}
                                        alt=""
                                    ></img>
                                </StyleButton>
                            )}

                            {buttonText === 'Approve' && (
                                <StyleButton
                                    onClick={handleAddLiquid}
                                    disabled={disableButton}
                                    className="btn-add"
                                >
                                    <div>{buttonText}</div>
                                    <img
                                        hidden={statusForAdd !== ButtonStatus.loading}
                                        src={IcLoading}
                                        alt=""
                                    ></img>
                                </StyleButton>
                            )}
                        </div>

                        <Dialog
                            open={open}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={handleClose}
                            aria-describedby="alert-dialog-slide-description"
                        >
                            <div>
                                <div id="alert-dialog-slide-description">
                                    {/* Are you sure to add{' '}
                                    {formatUnits(inputFromAmount, tokenConfig?.decimals)}
                                    {tokenConfig?.symbol} */}
                                    <div className="popup-liquidity-container">
                                        <div className="header-popup">
                                            <p className="content-header-popup">
                                                Add {tokenConfig?.symbol}
                                            </p>
                                        </div>
                                        <div className="body-content-popup">
                                            <StyledContainerDiv>
                                                <InputTokenWithSelectLiquid
                                                    tokens={tokens}
                                                    title="Amount"
                                                    disable={true}
                                                    value={formatUnits(
                                                        inputFromAmount,
                                                        tokenConfig?.decimals,
                                                    )}
                                                />
                                            </StyledContainerDiv>

                                            <div className="div">
                                                <div className="content-detail content-detail-first">
                                                    <p className="title-detail">Receive</p>
                                                    <p className="info-detail">
                                                        {/* <div>
                                                            <BigintDisplay
                                                                value={
                                                                    calcAddLiquidity
                                                                        ?.data[0] as BigInt
                                                                }
                                                                decimals={tokenConfig?.decimals}
                                                            />
                                                        </div> */}
                                                    </p>
                                                </div>

                                                <div className="content-detail">
                                                    <p className="title-detail">Slipage</p>
                                                    <p className="info-detail">0.1 %</p>
                                                </div>

                                                <div className="content-detail">
                                                    <p className="title-detail">
                                                        Minimun Received
                                                    </p>
                                                    <p className="info-detail">0 FLP</p>
                                                </div>

                                                <div className="content-detail">
                                                    <p className="title-detail">Fees</p>
                                                    <p className="info-detail">-</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="button-popup">
                                    <Button className="disagree-btn" onClick={handleClose}>
                                        Disagree
                                    </Button>
                                    <Button className="agree-btn" onClick={handleAddLiquid}>
                                        Agree
                                    </Button>
                                </div>
                            </div>
                        </Dialog>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <StyledContainerDiv>
                            <InputToken
                                tokens={tokensRemove}
                                amountChange={amountRemoveFromChange}
                                title="Amount"
                                refresh={refreshRemove}
                                disable={statusForRemove === ButtonStatusRemove.loading}
                                disableSelect={statusForRemove === ButtonStatusRemove.loading}
                                insufficientBalanceChange={handleInsufficientBalanceRemove}
                            />
                        </StyledContainerDiv>
                        <div className="div" style={{ minHeight: '136px' }}>
                            <div className="content-detail content-detail-first">
                                <p className="title-detail">Receive</p>
                                <div
                                    className="div"
                                    style={{ display: 'flex', alignItems: 'center' }}
                                >
                                    <div>
                                        <BigintDisplay
                                            value={calcRemoveLiquidity.data as BigInt}
                                            decimals={tokenRemoveConfig?.decimals}
                                            fractionDigits={5}
                                        />
                                    </div>
                                    <p
                                        className="info-detail"
                                        style={{ marginLeft: '5px', marginBottom: '0px' }}
                                    >
                                        <SelectToken
                                            tokens={tokensRemove}
                                            tokenChange={handleTokenRemoveFromChange}
                                            title="Amount"
                                            refresh={refresh}
                                        />
                                    </p>
                                </div>
                            </div>
                            <div className="content-detail">
                                <p className="title-detail">Slipage</p>
                                <p className="info-detail">0.1 %</p>
                            </div>

                            <div className="content-detail">
                                <p className="title-detail">Minimun Received</p>
                                <p className="info-detail">
                                    <BigintDisplay
                                        value={minimumReceive as BigInt}
                                        decimals={tokenRemoveConfig.decimals}
                                        fractionDigits={5}
                                    />
                                    <span> {tokenFromRemove}</span>
                                </p>
                            </div>
                        </div>
                        <div className="button-container">
                            {buttonTextRemove != 'Approve' && (
                                <StyleButton
                                    onClick={handleClickOpenRemove}
                                    disabled={disableButtonRemove}
                                    className="btn-add"
                                >
                                    <div>{buttonTextRemove}</div>
                                    <img
                                        hidden={statusForRemove !== ButtonStatusRemove.loading}
                                        src={IcLoading}
                                        alt=""
                                    ></img>
                                </StyleButton>
                            )}

                            {buttonTextRemove === 'Approve' && (
                                <StyleButton
                                    onClick={handleRemoveLiquid}
                                    disabled={disableButtonRemove}
                                    className="btn-add"
                                >
                                    <div>{buttonTextRemove}</div>
                                    <img
                                        hidden={statusForRemove !== ButtonStatusRemove.loading}
                                        src={IcLoading}
                                        alt=""
                                    ></img>
                                </StyleButton>
                            )}
                        </div>

                        <Dialog
                            open={openRemove}
                            TransitionComponent={TransitionRemove}
                            keepMounted
                            onClose={handleCloseRemove}
                            aria-describedby="alert-dialog-slide-description"
                        >
                            <div>
                                <div id="alert-dialog-slide-description">
                                    {/* Are you sure to add{' '}
                                    {formatUnits(inputFromAmount, tokenConfig?.decimals)}
                                    {tokenConfig?.symbol} */}
                                    <div className="popup-liquidity-container">
                                        <div className="header-popup">
                                            <p className="content-header-popup">
                                                Remove LP to get {tokenRemoveConfig?.symbol}
                                            </p>
                                        </div>
                                        <div className="body-content-popup">
                                            <StyledContainerDiv>
                                                <InputTokenWithSelectLiquid
                                                    tokens={tokensRemove}
                                                    title="Amount"
                                                    disable={true}
                                                    value={formatUnits(
                                                        inputRemoveFromAmount,
                                                        lpDecimal,
                                                    )}
                                                />
                                            </StyledContainerDiv>

                                            <div className="div" style={{ minHeight: '136px' }}>
                                                <div className="content-detail content-detail-first">
                                                    <p className="title-detail">Receive</p>
                                                    <div
                                                        className="div"
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <div style={{ color: '#fff' }}>
                                                            <BigintDisplay
                                                                value={
                                                                    calcRemoveLiquidity.data as BigInt
                                                                }
                                                                decimals={
                                                                    tokenRemoveConfig?.decimals
                                                                }
                                                                fractionDigits={5}
                                                            />
                                                        </div>
                                                        <p
                                                            className="info-detail"
                                                            style={{
                                                                marginLeft: '5px',
                                                                marginBottom: '0px',
                                                            }}
                                                        >
                                                            <SelectToken
                                                                tokens={tokensRemove}
                                                                tokenChange={
                                                                    handleTokenRemoveFromChange
                                                                }
                                                                title="Amount"
                                                                refresh={refresh}
                                                            />
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="content-detail">
                                                    <p className="title-detail">Slipage</p>
                                                    <p className="info-detail">0.1 %</p>
                                                </div>

                                                <div className="content-detail">
                                                    <p className="title-detail">
                                                        Minimun Received
                                                    </p>
                                                    <p className="info-detail">
                                                        <BigintDisplay
                                                            value={minimumReceive as BigInt}
                                                            decimals={
                                                                tokenRemoveConfig.decimals
                                                            }
                                                            fractionDigits={5}
                                                        />
                                                        <span> {tokenFromRemove}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="button-popup">
                                    <Button
                                        className="disagree-btn"
                                        onClick={handleCloseRemove}
                                    >
                                        Disagree
                                    </Button>
                                    <Button className="agree-btn" onClick={handleRemoveLiquid}>
                                        Agree
                                    </Button>
                                </div>
                            </div>
                        </Dialog>
                    </CustomTabPanel>
                </Box>
            </div>
        </div>
    );
}

const StyledContainerDiv = style.div`
    margin-bottom: 20px;
`;
const StyleButton = style.button`
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
