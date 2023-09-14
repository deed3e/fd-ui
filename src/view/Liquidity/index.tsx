import './liquidity.scss';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

const options = [
    {
        name: 'BTC',
        icon: '../src/assets/image/btc-right.svg',
    },
    {
        name: 'USDT',
        icon: '../src/assets/image/btc-right.svg',
    },
    {
        name: 'ETH',
        icon: '../src/assets/image/btc-right.svg',
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
                                    <img src="../src/assets/image/icon3.svg" alt="bank" />
                                </div>
                                <div className="table-content">46.2312</div>
                                <div className="table-content">$34.234124</div>
                                <div className="table-content">26%</div>
                            </div>

                            <div className="body-table-liquid">
                                <div className="table-content">
                                    <img src="../src/assets/image/icon2.svg" alt="bank" />
                                </div>
                                <div className="table-content">46.2312</div>
                                <div className="table-content">$34.234124</div>
                                <div className="table-content">26%</div>
                            </div>

                            <div className="body-table-liquid">
                                <div className="table-content">
                                    <img src="../src/assets/image/btclq1.svg" alt="bank" />
                                </div>
                                <div className="table-content">46.2312</div>
                                <div className="table-content">$34.234124</div>
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
