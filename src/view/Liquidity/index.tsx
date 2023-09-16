import './liquidity.scss';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { BigintDisplay } from '../../component/BigIntDisplay';

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { IMaskInput } from 'react-imask';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import TextField from '@mui/material/TextField';

// select
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

import BankImage from '../../assets/image/liquidity-bank.svg';
import icon3 from '../../assets/image/icon3.svg';
import icon2 from '../../assets/image/icon2.svg';
import TIcon from '../../assets/image/btclq1.svg';
import WETH from '../../assets/tokens/WETH2.png';
import BTCRight from '../../assets/image/btc-right.svg';

import { useOracle } from '../../hooks/useOracle';

import {
    getAllTokenSymbol,
    getWrapNativeTokenSymbol,
    getAdreessRouter,
    getAdreessPool,
    getTokenConfig,
    getAdreessOracle,
} from '../../config';

import { useBalance, useContractRead } from 'wagmi';
import { formatUnits, getAddress, parseUnits } from 'viem';

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

    console.log('value', balanceUSDC);

    // const tokenETHConfig = getTokenConfig('ETH');
    // const tokenBTCConfig = getTokenConfig('BTC');
    // const tokenUSDCConfig = getTokenConfig('USDC');
    // const tokenWethConfig = getTokenConfig('WETH');

    // const { data } = useContractRead({
    //     address: getAddress(getAdreessOracle()),
    //     abi: OracleAbi,
    //     functionName: 'getMultiplePrices',
    //     args: [
    //         [
    //             tokenBTCConfig?.address,
    //             tokenETHConfig?.address,
    //             tokenUSDCConfig?.address,
    //             tokenWethConfig?.address,
    //         ],
    //     ],
    // });

    // const outValue = useMemo(() => {
    //     if (data) {
    //         data[0] = formatUnits(data[0],30 - tokenBTCConfig?.decimals);
    //         data[1] = formatUnits(data[0], tokenETHConfig?.decimals);
    //         data[2] = formatUnits(data[0], tokenUSDCConfig?.decimals);
    //         data[3] = formatUnits(data[0], tokenWethConfig?.decimals);
    //         return data;
    //     }
    //     return [];
    // }, [data]);

    // console.log('token btc', tokenBTCConfig?.address);

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
                {/* <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Asset</StyledTableCell>
                                <StyledTableCell align="center">Amount</StyledTableCell>
                                <StyledTableCell align="center">Value</StyledTableCell>
                                <StyledTableCell align="center">Utilization</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <StyledTableRow key={row.id}>
                                    <StyledTableCell component="th" scope="row">
                                        <img src="../src/assets/image/bc.svg" alt="bank" />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.calories}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{row.fat}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.carbs}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer> */}

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
                                            decimals={8 + tokenBTCConfig?.decimals}
                                        />
                                    }
                                </div>
                                <div className="table-content">
                                    <BigintDisplay
                                        value={valueBTC as BigInt}
                                        decimals={tokenBTCConfig?.decimals}
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
                        <div className="content-right-header">
                            <p className="title">Amount</p>
                            <p className="balance">Balance: 0 BTC</p>
                        </div>
                        <Box
                            sx={{
                                '& > :not(style)': {
                                    m: 1,
                                },
                            }}
                        >
                            <TextField
                                value={values.numberformat}
                                onChange={handleChange2}
                                name="numberformat"
                                id="formatted-numberformat-input"
                                InputProps={{
                                    inputComponent: NumericFormatCustom as any,
                                }}
                                variant="standard"
                            />

                            {/* Select */}
                            <React.Fragment>
                                <ButtonGroup
                                    variant="contained"
                                    ref={anchorRef}
                                    aria-label="split button"
                                >
                                    <img src={options[selectedIndex].icon} alt="bank" />
                                    <Button onClick={handleClick}>
                                        {options[selectedIndex].name}
                                    </Button>
                                    <Button
                                        size="small"
                                        aria-controls={open ? 'split-button-menu' : undefined}
                                        aria-expanded={open ? 'true' : undefined}
                                        aria-label="select merge strategy"
                                        aria-haspopup="menu"
                                        onClick={handleToggle}
                                    >
                                        <ArrowDropDownIcon />
                                    </Button>
                                </ButtonGroup>
                                <Popper
                                    sx={{
                                        zIndex: 1,
                                    }}
                                    open={open}
                                    anchorEl={anchorRef.current}
                                    role={undefined}
                                    transition
                                    disablePortal
                                >
                                    {({ TransitionProps, placement }) => (
                                        <Grow
                                            {...TransitionProps}
                                            style={{
                                                transformOrigin:
                                                    placement === 'bottom'
                                                        ? 'center top'
                                                        : 'center bottom',
                                            }}
                                        >
                                            <Paper>
                                                <ClickAwayListener onClickAway={handleClose}>
                                                    <MenuList
                                                        id="split-button-menu"
                                                        autoFocusItem
                                                    >
                                                        {options.map((option, index) => (
                                                            <MenuItem
                                                                key={option.name}
                                                                disabled={index === 2}
                                                                selected={
                                                                    index === selectedIndex
                                                                }
                                                                onClick={(event) =>
                                                                    handleMenuItemClick(
                                                                        event,
                                                                        index,
                                                                    )
                                                                }
                                                            >
                                                                {option.name}
                                                                <img
                                                                    src={option.icon}
                                                                    alt="bank"
                                                                />
                                                            </MenuItem>
                                                        ))}
                                                    </MenuList>
                                                </ClickAwayListener>
                                            </Paper>
                                        </Grow>
                                    )}
                                </Popper>
                            </React.Fragment>
                            {/* End Select */}
                        </Box>

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
                            <button className="btn-add">ADD</button>
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
