import './swap.scss';

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import Paper from '@mui/material/Paper';

const options1 = ['24H', '1W', '1M', '1Y'];

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

const options2 = [
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

interface State {
    textmask: string;
    numberformat: string;
}

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

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

export default function Swap() {
    const [timeSelect, setTimeSelect] = React.useState(options1[0]);
    // select
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const anchorRef2 = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [selectedIndex2, setSelectedIndex2] = React.useState(1);

    const handleClick = () => {
        console.info(`You clicked ${options[selectedIndex]}`);
    };

    const handleClick2 = () => {
        console.info(`You clicked ${options2[selectedIndex2]}`);
    };
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleToggle2 = () => {
        setOpen2((prevOpen) => !prevOpen);
    };

    const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        });
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleMenuItemClick2 = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex2(index);
        setOpen2(false);
    };

    const handleClose = (event: Event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    const handleClose2 = (event: Event) => {
        if (anchorRef2.current && anchorRef2.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen2(false);
    };

    const [values, setValues] = React.useState<State>({
        textmask: '(100) 000-0000',
        numberformat: '1320',
    });

    return (
        <div className="container">
            <div className="left-content-container">
                <div className="top-left-content-container">
                    <div className="left-swap-icon-container">
                        <div className="image-icon">
                            <img src="../src/assets/image/btc-icon-2.svg" alt="" />
                            <img src="../src/assets/image/eth-icon.svg" alt="" />
                        </div>
                        <div className="detail-icon">
                            <p>BTC/ETH</p>
                            <img src="../src/assets/image/Refresh_2_light@2x.png" alt="" />
                        </div>
                    </div>
                    <div className="right-time-container">
                        <div className="right-time-select">
                            {options1.map((option1) => (
                                <div
                                    onClick={(opt) => setTimeSelect(option1)}
                                    className={
                                        timeSelect === option1
                                            ? 'is-active time-select'
                                            : 'time-select'
                                    }
                                    key={option1}
                                >
                                    {option1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bottom-left-content-container">
                    <div className="header-table">
                        <div className="table-head">From</div>
                        <div className="table-head">To</div>
                        <div className="table-head">Amount</div>
                        <div className="table-head">Receive</div>
                        <div className="table-head">Time</div>
                    </div>
                </div>
            </div>
            <div className="right-content-container">
                <div className="from-container">
                    <div className="content-right-header">
                        <p className="title">From</p>
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
                                                <MenuList id="split-button-menu" autoFocusItem>
                                                    {options.map((option, index) => (
                                                        <MenuItem
                                                            key={option.name}
                                                            disabled={index === 2}
                                                            selected={index === selectedIndex}
                                                            onClick={(event) =>
                                                                handleMenuItemClick(
                                                                    event,
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            {option.name}
                                                            <img src={option.icon} alt="bank" />
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
                </div>
                <div className="from-container">
                    <div className="content-right-header">
                        <p className="title">To</p>
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
                                ref={anchorRef2}
                                aria-label="split button"
                            >
                                <img src={options2[selectedIndex2].icon} alt="bank" />
                                <Button onClick={handleClick2}>
                                    {options2[selectedIndex2].name}
                                </Button>
                                <Button
                                    size="small"
                                    aria-controls={open2 ? 'split-button-menu' : undefined}
                                    aria-expanded={open2 ? 'true' : undefined}
                                    aria-label="select merge strategy"
                                    aria-haspopup="menu"
                                    onClick={handleToggle2}
                                >
                                    <ArrowDropDownIcon />
                                </Button>
                            </ButtonGroup>
                            <Popper
                                sx={{
                                    zIndex: 1,
                                }}
                                open={open2}
                                anchorEl={anchorRef2.current}
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
                                            <ClickAwayListener onClickAway={handleClose2}>
                                                <MenuList id="split-button-menu" autoFocusItem>
                                                    {options2.map((option, index) => (
                                                        <MenuItem
                                                            key={option.name}
                                                            disabled={index === 2}
                                                            selected={index === selectedIndex2}
                                                            onClick={(event) =>
                                                                handleMenuItemClick2(
                                                                    event,
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            {option.name}
                                                            <img src={option.icon} alt="bank" />
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
                        <p className="title-detail">Price</p>
                        <p className="info-detail">1  <span className='title-detail'>USDT</span> = 0.0046 <span className='title-detail'>BNB</span></p>
                    </div>

                    <div className="content-detail">
                        <p className="title-detail">Available Liquidity</p>
                        <p className="info-detail">1,567.22 <span className='title-detail'>BNB</span></p>
                    </div>

                    <div className="content-detail">
                        <p className="title-detail">Slipage</p>
                        <p className="info-detail">0.1%</p>
                    </div>

                    <div className="content-detail">
                        <p className="title-detail">Minimum Receive</p>
                        <p className="info-detail">0 ETH</p>
                    </div>

                    <div className="content-detail">
                        <p className="title-detail">Fees</p>
                        <p className="info-detail">-</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
