import './liquidity.scss';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { BigintDisplay } from '../../component/BigIntDisplay';
import style from 'styled-components';

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { IMaskInput } from 'react-imask';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import BankImage from '../../assets/image/liquidity-bank.svg';
import icon3 from '../../assets/image/icon3.svg';
import icon2 from '../../assets/image/icon2.svg';
import TIcon from '../../assets/image/btclq1.svg';
import WETH from '../../assets/tokens/WETH2.png';
import BTCRight from '../../assets/image/btc-right.svg';

import { useOracle } from '../../hooks/useOracle';
import { useCallback, useEffect, useMemo, useState } from 'react';
import InputTokenWithSelect from '../../component/InputToken/InputTokenWithSelect';

import {
    getAllTokenSymbol,
    getWrapNativeTokenSymbol,
    getAdreessRouter,
    getAdreessPool,
    getTokenConfig,
    getAdreessOracle,
} from '../../config';

import {
    useBalance,
    useContractRead,
    useAccount,
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
} from 'wagmi';
import { formatUnits, getAddress, parseUnits } from 'viem';
import IER from '../../abis/IERC20.json';
import Router from '../../abis/Router.json';
import { useShowToast } from '../../hooks/useShowToast';

const options = [
    {
        name: 'BTC',
        icon: BTCRight,
    },
    {
        name: 'USDT',
        icon: BTCRight,
    },
    {
        name: 'ETH',
        icon: BTCRight,
    },
];

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

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

const rows = [
    createData(1, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData(2, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData(3, 'Eclair', 262, 16.0, 24, 6.0),
    createData(4, 'Cupcake', 305, 3.7, 67, 4.3),
    createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
];

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const TextMaskCustom = React.forwardRef<HTMLElement, CustomProps>(function TextMaskCustom(
    props,
    ref,
) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="(#00) 000-0000"
            definitions={{
                '#': /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
    function NumericFormatCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                thousandSeparator
                valueIsNumericString
                prefix="$"
            />
        );
    },
);

interface State {
    textmask: string;
    numberformat: string;
}

export default function Liquidity() {
    const [value, setValue] = React.useState(0);
    const [btcValue, setBtcValue] = React.useState(0);
    const showToast = useShowToast();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const [values, setValues] = React.useState<State>({
        textmask: '(100) 000-0000',
        numberformat: '1320',
    });

    const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        });
    };

    // select
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [dataValue, setDataValue] = React.useState([]);

    const handleClick = () => {
        console.info(`You clicked ${options[selectedIndex]}`);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    const getPrice = useOracle(['BTC', 'ETH', 'USDC', 'WETH']); //['BTC','ETH']

    const tokenBTCConfig = getTokenConfig('BTC');
    const tokenETHConfig = getTokenConfig('ETH');
    const tokenUSDCConfig = getTokenConfig('USDC');
    const tokenWethConfig = getTokenConfig('WETH');

    const balanceBTC = useBalance({
        address: getAddress(getAdreessPool()),
        token: getAddress(tokenBTCConfig?.address ?? ''),
    });

    const balanceETH = useBalance({
        address: getAddress(getAdreessPool()),
        token: getAddress(tokenETHConfig?.address ?? ''),
    });

    const balanceUSDC = useBalance({
        address: getAddress(getAdreessPool()),
        token: getAddress(tokenUSDCConfig?.address ?? ''),
    });

    const balanceWeth = useBalance({
        address: getAddress(getAdreessPool()),
        token: getAddress(tokenWethConfig?.address ?? ''),
    });

    const valueETH = ((getPrice.ETH as bigint) * balanceETH?.data?.value) as bigint;
    const valueBTC = ((getPrice.BTC as bigint) * balanceBTC?.data?.value) as bigint;
    const valueUSDT = ((getPrice.USDC as bigint) * balanceUSDC?.data?.value) as bigint;
    const valueWeth = ((getPrice.WETH as bigint) * balanceWeth?.data?.value) as bigint;

    const [inputFromAmount, setInputFromAmount] = useState<BigInt>(BigInt(0));
    const [tokenFrom, setTokenFrom] = useState<string>('BTC');

    const tokens = useMemo(() => {
        return getAllTokenSymbol()?.filter((i) => i !== getWrapNativeTokenSymbol());
    }, []);

    const amountFromChange = useCallback((value: BigInt) => {
        if (value) {
            setInputFromAmount(value);
        } else {
            setInputFromAmount(BigInt(0));
        }
    }, []);

    const handleTokenFromChange = useCallback((symbol: string) => {
        setTokenFrom(symbol);
    }, []);

    const { address, isConnected } = useAccount();

    const tokenConfig = getTokenConfig(tokenFrom);
    const addressRouter = getAddress(getAdreessRouter());
    const [refresh, setRefesh] = useState<boolean>();

    const dataAlowance = useContractRead({
        address: getAddress(tokenConfig?.address ?? ''),
        abi: IER,
        functionName: 'allowance',
        args: [address, addressRouter],
    });

    const contractWriteApprove = useContractWrite({
        address: getAddress(tokenConfig?.address ?? ''),
        abi: IER,
        functionName: 'approve',
        args: [addressRouter, inputFromAmount],
    });

    const contractWriteAddLiquidity = useContractWrite({
        address: getAddress(getAdreessRouter()),
        abi: Router,
        functionName: 'addLiquidity',
        args: [tokenConfig?.address, inputFromAmount, 0],
    });

    const handleAddLiquid = useCallback(() => {
        if (dataAlowance?.data < inputFromAmount) {
            contractWriteApprove.write();
            setRefesh(!refresh);
        } else {
            contractWriteAddLiquidity.write();
            setRefesh(!refresh);
        }
    }, [tokenFrom, inputFromAmount, dataAlowance.data]);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: contractWriteAddLiquidity.data?.hash,
    });

    const useForApprove = useWaitForTransaction({
        hash: contractWriteApprove.data?.hash,
    });

    useEffect(() => {
        if (useForApprove.isLoading) {
            showToast(
                `Waiting request for ${inputFromAmount} ${tokenConfig?.symbol}`,
                '',
                'warning',
            );
        }
    }, [inputFromAmount, tokenConfig?.symbol, contractWriteApprove.isLoading, showToast]);

    useEffect(() => {
        if (useForApprove.isSuccess) {
            showToast(
                `Success approve ${inputFromAmount} ${tokenConfig?.symbol}`,
                '',
                'success',
            );
            dataAlowance.refetch();
            contractWriteApprove.reset();
        }
    }, [inputFromAmount, tokenConfig?.symbol, useForApprove.isSuccess, showToast]);

    useEffect(() => {
        if (isLoading) {
            showToast(
                `Waiting request for ${inputFromAmount} ${tokenConfig?.symbol}`,
                '',
                'warning',
            );
        }
    }, [inputFromAmount, tokenConfig?.symbol, isLoading, showToast]);

    useEffect(() => {
        if (isSuccess) {
            showToast(`Success add ${inputFromAmount} ${tokenConfig?.symbol}`, '', 'success');
            dataAlowance.refetch();
            contractWriteAddLiquidity.reset();
        }
    }, [inputFromAmount, tokenConfig?.symbol, isSuccess, showToast]);

    useEffect(() => {
        if (isSuccess) {
            balanceBTC.refetch();
            balanceETH.refetch();
            balanceUSDC.refetch();
            balanceWeth.refetch();
        }
    }, [balanceBTC, balanceETH, balanceUSDC, balanceWeth, isSuccess]);

    return (
        <div className="content-container">
            <div className="table-container">
                <div className="header-container">
                    <div className="header-content">
                        <img src={BankImage} alt="bank" />
                        <p>Assets Under Management</p>
                    </div>
                    <p className="money-header">$7,2223,12312</p>
                </div>

                <div className="bottom-left-container">
                    <div className="table-container-detail">
                        <div className="header-table-liquid">
                            <div className="table-head">Asset</div>
                            <div className="table-head">Amount</div>
                            <div className="table-head">Value</div>
                            <div className="table-head">Utilization</div>
                        </div>
                        <div className="body-content-lq">
                            <div className="body-table-liquid">
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
                                <div className="table-content">26%</div>
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
                                <div className="table-content">26%</div>
                            </div>

                            <div className="body-table-liquid">
                                <div className="table-content">
                                    <img src={TIcon} alt="bank" />
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
                                <div className="table-content">26%</div>
                            </div>

                            <div className="body-table-liquid">
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
                                <div className="table-content">26%</div>
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
                                title="From"
                                refresh={refresh}
                            />
                        </StyledContainerDiv>

                        <div className="content-detail content-detail-first">
                            <p className="title-detail">Receive</p>
                            <p className="info-detail">0 FLP</p>
                        </div>

                        <div className="content-detail">
                            <p className="title-detail">Slipage</p>
                            <p className="info-detail">0.1 %</p>
                        </div>

                        <div className="content-detail">
                            <p className="title-detail">Minimun Received</p>
                            <p className="info-detail">0 FLP</p>
                        </div>

                        <div className="content-detail">
                            <p className="title-detail">Fees</p>
                            <p className="info-detail">-</p>
                        </div>
                        <div className="button-container">
                            <button onClick={handleAddLiquid} className="btn-add">
                                ADD
                            </button>
                        </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        Item Two
                    </CustomTabPanel>
                </Box>
            </div>
        </div>
    );
}

const StyledContainerDiv = style.div`
    margin-bottom: 20px;
`;
