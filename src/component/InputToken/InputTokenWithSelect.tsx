import { DropdownSelectToken } from '../../view/Faucet/components/DropdownSelectToken';
import styled from 'styled-components';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ReactComponent as IconArrowDown } from '../../assets/svg/ic-arrow-down.svg';
import { useBalance, useAccount } from 'wagmi';
import { getAddress, parseUnits } from 'viem';
import { TokenSymbol } from '../../component/TokenSymbol';
import { getTokenConfig } from '../../config';
import { useOracle } from '../../hooks/useOracle';
import { BigintDisplay } from '../../component/BigIntDisplay';

interface InputTokenWithSelectProps {
    refresh?: boolean;
    tokens: string[];
    title: string;
    disable?: boolean;
    disableSelect?: boolean;
    disableOverBalance?: boolean;
    value?: string;
    pickToken?: string;
    insufficientBalanceChange?: (check: boolean) => unknown;
    amountChange?: (amount: BigInt) => unknown;
    tokenChange?: (symbol: string) => unknown;
    valueChange?: (symbol: number) => unknown;
}

const InputTokenWithSelect: React.FC<InputTokenWithSelectProps> = ({
    refresh,
    tokens,
    title = 'Amount',
    disable = false,
    disableSelect = false,
    disableOverBalance = false,
    value,
    pickToken,
    amountChange,
    tokenChange,
    valueChange,
    insufficientBalanceChange,
}) => {
    const { address } = useAccount();
    const [isShowMax] = useState(false);
    const [selectToken, setSelectToken] = useState('BTC');
    const configSelectToken = getTokenConfig(selectToken);
    const [amount, setAmount] = useState('');
    const [subValue, setSubValue] = useState<BigInt>();
    const [isSelectWETH,setIsSelectWETH] = useState(false);

    const getPrice = useOracle(tokens); //['BTC','ETH']

    const balance = useBalance({
        address: address,
        token: getAddress(configSelectToken?.address ?? ''),
    });

    const balanceWETH = useBalance({
        address: address,
    });

    useEffect(() => {
        if (tokenChange) {
            tokenChange(selectToken);
        }
    }, [selectToken, tokenChange]);

    const handleInputHandle = useCallback(
        (ev: ChangeEvent<HTMLInputElement>) => {
            const tmp = ev.target.value;
            var regExp = /^0[0-9].*$/;
            const splipDot = tmp.split('.');
            const check =
                (parseUnits(tmp.replace('.', ''), configSelectToken?.decimals ?? 0) ||
                    +tmp === 0) &&
                splipDot.length <= 2 &&
                !tmp.includes(' ') &&
                !regExp.test(tmp);
            if (check) {
                setAmount(tmp);
                const value = parseUnits(tmp, configSelectToken?.decimals ?? 0);
                if (amountChange) {
                    amountChange(value as BigInt);
                }
            }
        },
        
        [amountChange, configSelectToken?.decimals],
    );

    useEffect(() => {
        if (!disableSelect && pickToken) {
            setSelectToken(pickToken);
        }
    }, [pickToken]);

    useEffect(() => {
        const balanceUser = isSelectWETH ?  balanceWETH.data?.value ?? BigInt(0) :  balance?.data?.value ?? BigInt(0);
        if (insufficientBalanceChange) {
            insufficientBalanceChange(
                balanceUser < parseUnits(amount, configSelectToken?.decimals ?? 0),
            );
        }
    }, [amount, balance,balanceWETH, insufficientBalanceChange, configSelectToken]);

    useEffect(() => {
        balance.refetch();
        balanceWETH.refetch();
    }, [balance,balanceWETH, refresh]);

    const onDropDownItemClick = useCallback((symbol: string) => {
        setSelectToken(symbol);
    }, []);

    useEffect(() => {
        if (configSelectToken?.symbol) {
            const amountTmp = parseUnits(amount, configSelectToken?.decimals ?? 0) as BigInt;
            const valueTmp = getPrice[configSelectToken?.symbol] * amountTmp;
            setSubValue(valueTmp);
            if (valueChange) {
                valueChange(valueTmp);
            }
        }
    }, [amount, configSelectToken, getPrice, valueChange]);

    const overBalance = useMemo(() => {
        if (disableOverBalance) {
            return false;
        }
        if (balance.data || balanceWETH.data) {
            return parseUnits(amount, configSelectToken?.decimals ?? 0) > (isSelectWETH ? balanceWETH.data?.value : balance.data?.value)
        }
        return true;
    }, [amount, balance,balanceWETH, configSelectToken?.decimals]);

    useEffect(() => {
        if(selectToken == 'WETH') {
            setIsSelectWETH(true);
        }else {
            setIsSelectWETH(false);
        }
    }, [selectToken]);

    return (
        <div>
            <StyledHeaderBtn>
                <StyledAmount>{title}</StyledAmount>
                <StyledBalance>
                    Balance:{' '}
                    <BigintDisplay
                        value={ isSelectWETH ? balanceWETH.data?.value as BigInt : balance.data?.value as BigInt}
                        decimals={configSelectToken?.decimals ?? 1}
                        threshold={configSelectToken?.threshold}
                        fractionDigits={configSelectToken?.fractionDigits}
                    />{' '}
                    {configSelectToken?.symbol === 'WETH' ? 'BNB' : configSelectToken?.symbol}
                </StyledBalance>
            </StyledHeaderBtn>
            <StyledBodyBtn>
                <StyledContainerInput disable={disable}>
                    <StyledWrapInputAndSubValue>
                        <StyledInput
                            placeholder={amount ? '0' : '0.0'}
                            value={value ?? amount}
                            onChange={handleInputHandle}
                            disabled={disable}
                            isOverBalance={overBalance}
                        ></StyledInput>
                        <StyledSubValue show={+amount !== 0}>
                            ~&nbsp;
                            <BigintDisplay
                                value={subValue}
                                decimals={(configSelectToken?.decimals ?? 0) + 8}
                                currency="USD"
                                threshold={0.1}
                                fractionDigits={2}
                            />
                        </StyledSubValue>
                    </StyledWrapInputAndSubValue>
                    {isShowMax && <StyledMaxValue>Max</StyledMaxValue>}
                    <StyledSelectToken>
                        <DropdownSelectToken
                            selectedToken={selectToken}
                            tokens={tokens}
                            position={'right'}
                            onSelect={onDropDownItemClick}
                            disable={disableSelect}
                        >
                            <StyledTokenSelect pointer={tokens?.length >= 0}>
                                <TokenSymbol symbol={selectToken} size={24} />
                                <span>{selectToken === 'WETH' ? 'BNB' : selectToken}</span>
                                <IconArrowDown />
                            </StyledTokenSelect>
                        </DropdownSelectToken>
                    </StyledSelectToken>
                </StyledContainerInput>
            </StyledBodyBtn>
        </div>
    );
};

export default InputTokenWithSelect;

const StyledInput = styled.input<{ isOverBalance?: boolean }>`
    flex: 1;
    width: 100%;
    border: none;
    color: ${({ isOverBalance }) => (isOverBalance ? '#c42020' : '#fff')};
    padding: 0;
    font-weight: bold;
    font-size: 16px;
    background: transparent;
    ::placeholder {
        color: #fff6;
    }
`;
const StyledSubValue = styled.div<{ show: boolean }>`
    height: ${({ show }) => (show ? 'auto' : '0px')};
    opacity: ${({ show }) => (show ? 1 : 0)};
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    transition: all 0.2s linear;
    word-break: break-word;
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
const StyledSelectToken = styled.div`
    justify-self: self-end;
    align-self: center;
    display: flex;
    align-items: center;
`;

const StyledWrapInputAndSubValue = styled.div`
    width: -webkit-fill-available;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: self-start;
    overflow: hidden;
`;

const StyledAmount = styled.div`
font-family: 'IBM Plex Mono', monospace;
color: rgba(255, 255, 255, 0.8);
`;

const StyledBalance = styled.div`
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    font-weight: 300;
    font-family: 'IBM Plex Mono', monospace;
`;
const StyledContainerInput = styled.div<{ disable?: boolean }>`
    position: relative;
    background-color: ${({ disable }) => (disable ? '#172132' : 'black')};
    border-radius: 10px;
    height: 49px;
    display: flex;
    justify-content: space-between;
    padding: 8px 10px 6px 10px;
    gap: 5px;
`;
const StyledBodyBtn = styled.div`
    margin-top: 4.4px;
    margin-bottom: 5px;
`;
const StyledHeaderBtn = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const StyledToken = styled.div`
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
