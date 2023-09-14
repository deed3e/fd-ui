import './swap.scss';
import styled from 'styled-components';

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
import MockERC20 from '../../abis/MockERC20.json';
import { DropdownSelectToken } from './components/DropdownSelectToken';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';


import { getAddress, parseUnits } from 'viem';

import {
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
    useBalance,
    useAccount,
} from 'wagmi';

import { TokenSymbol } from '../../component/TokenSymbol';
import { getAllTokenSymbol, getWrapNativeTokenSymbol, getTokenConfig } from '../../config';


import BTCRight from '../../assets/image/btc-right.svg';
import btcIcon2 from '../../assets/image/btc-icon-2.svg';
import etcIcon from '../../assets/image/eth-icon.svg';
import refreshIcon from '../../assets/image/Refresh_2_light.png';
import iconSwap from '../../assets/image/Transger_light.png';
import { ReactComponent as IconArrowDown } from '../../assets/svg/ic-arrow-down.svg';

const options1 = ['24H', '1W', '1M', '1Y'];


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

const options2 = [
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
    const [isShowMax, setShowMax] = useState(false);
    const anchorRef2 = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [selectedIndex2, setSelectedIndex2] = React.useState(1);
    const [amount, setAmount] = React.useState('');
    const [subValue, setSubValue] = useState(0);

    const [selectToken, setSelectToken] = React.useState('BTC');

    const { address } = useAccount();


    const configSelectToken = getTokenConfig(selectToken);

    const balance = useBalance({
        address: address,
        token: getAddress(configSelectToken?.address ?? ''),
    });

    const { config } = usePrepareContractWrite({
        address: getAddress(configSelectToken?.address ?? ''),
        abi: MockERC20,
        functionName: 'mint',
        args: [parseUnits(amount, configSelectToken?.decimals ?? 1)],
    });

    const handleInputHandle = useCallback(
        (ev: ChangeEvent<HTMLInputElement>) => {
            const tmp = ev.target.value;
            const slip = tmp.split('.');
            const check =
                parseUnits(tmp.replace('.', ''), configSelectToken?.decimals ?? 1) &&
                    slip.length <= 2
                    ? true
                    : false;
            if (check || +ev.target.value === 0.0) setAmount(ev.target.value);
        },
        [configSelectToken?.decimals],
    );


    const tokens = useMemo(() => {
        return getAllTokenSymbol()?.filter((i) => i !== getWrapNativeTokenSymbol());
    }, []);


    const onDropDownItemClick = useCallback((symbol: string) => {
        setSelectToken(symbol);
    }, []);

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
                            <img src={btcIcon2} alt="" />
                            <img src={etcIcon} alt="" />
                        </div>
                        <div className="detail-icon">
                            <p>BTC/ETH</p>
                            <img src={refreshIcon} alt="" />
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
                {/* <div className="from-container from-container-1">
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
                    </Box>
                </div> */}

                <StyledContainerDiv>
                    <StyledHeaderBtn>
                        <StyledAmount>From</StyledAmount>
                        <StyledBalance>
                            Balance: {balance.data?.formatted}{' '}
                            {configSelectToken?.symbol}
                        </StyledBalance>
                    </StyledHeaderBtn>
                    <StyledBodyBtn>
                        <StyledContainerInput>
                            <div>
                                <StyledInput
                                    placeholder={amount ? '0' : '0.0'}
                                    value={amount}
                                    onChange={handleInputHandle}
                                ></StyledInput>
                                <StyledSubValue>~ ${subValue}</StyledSubValue>
                            </div>
                            {isShowMax && <StyledMaxValue>Max</StyledMaxValue>}
                            <StyledSelectToken>
                                <DropdownSelectToken
                                    selectedToken={selectToken}
                                    tokens={tokens}
                                    position={'right'}
                                    onSelect={onDropDownItemClick}
                                >
                                    <StyledTokenSelect pointer={tokens?.length >= 0}>
                                        <TokenSymbol symbol={selectToken} size={24} />
                                        <span>{selectToken}</span>
                                        <IconArrowDown />
                                    </StyledTokenSelect>
                                </DropdownSelectToken>
                            </StyledSelectToken>
                        </StyledContainerInput>
                    </StyledBodyBtn>
                </StyledContainerDiv>
                <div className="icon-swap">
                    <img src={iconSwap} alt="" />
                </div>
                <div className="from-container">
                    <div>
                        <StyledHeaderBtn>
                            <StyledAmount>From</StyledAmount>
                            <StyledBalance>
                                Balance: {balance.data?.formatted}{' '}
                                {configSelectToken?.symbol}
                            </StyledBalance>
                        </StyledHeaderBtn>
                        <StyledBodyBtn>
                            <StyledContainerInput>
                                <div>
                                    <StyledInput
                                        placeholder={amount ? '0' : '0.0'}
                                        value={amount}
                                        onChange={handleInputHandle}
                                    ></StyledInput>
                                    <StyledSubValue>~ ${subValue}</StyledSubValue>
                                </div>
                                {isShowMax && <StyledMaxValue>Max</StyledMaxValue>}
                                <StyledSelectToken>
                                    <DropdownSelectToken
                                        selectedToken={selectToken}
                                        tokens={tokens}
                                        position={'right'}
                                        onSelect={onDropDownItemClick}
                                    >
                                        <StyledTokenSelect pointer={tokens?.length >= 0}>
                                            <TokenSymbol symbol={selectToken} size={24} />
                                            <span>{selectToken}</span>
                                            <IconArrowDown />
                                        </StyledTokenSelect>
                                    </DropdownSelectToken>
                                </StyledSelectToken>
                            </StyledContainerInput>
                        </StyledBodyBtn>
                    </div>
                    {/* <div className="content-right-header content-right-header2">
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
                    </Box> */}

                </div>
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
    );
}

const StyledInput = styled.input`
    flex: 1;
    width: 100%;
    border: none;
    color: #fff;
    padding: 0;
    font-weight: bold;
    font-size: 16px;
    background: transparent;
    ::placeholder {
        color: #fff6;
    }
`;

const StyledSelectToken = styled.div`
    justify-self: self-end;
    align-self: center;
    display: flex;
    align-items: center;
`;

const StyledMaxValue = styled.div`
    position: absolute;
    justify-self: end;
    right: 22%;
    align-self: center;
    color: #6763e3;
    cursor: pointer;
    :hover {
        color: #9b99c3;
    }
`;

const StyledContainerDiv = styled.div`
    margin-bottom: 20px; `;

const StyledSubValue = styled.div`
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
`;


const StyledHeaderBtn = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const StyledAmount = styled.div``;

const StyledBalance = styled.div`
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    font-weight: 300;
`;
const StyledContainerInput = styled.div`
    position: relative;
    background-color: black;
    border-radius: 10px;
    height: 49px;
    display: flex;
    justify-content: space-between;
    padding: 8px 10px 6px 10px;
`;

const StyledBodyBtn = styled.div`
    margin-top: 4.4px;
    margin-bottom: 5px;
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

const StyledTokenSelect = styled(StyledToken) <{ pointer?: boolean }>`
    cursor: ${({ pointer }) => (pointer ? 'pointer' : 'auto')};
    :hover {
        border: 1px solid #515050;
    }
`;