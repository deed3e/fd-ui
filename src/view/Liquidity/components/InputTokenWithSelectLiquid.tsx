import styled from 'styled-components';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useBalance, useAccount } from 'wagmi';
import { getAddress, parseUnits } from 'viem';
import { getTokenConfig } from '../../../config';
import { useOracle } from '../../../hooks/useOracle';
import { BigintDisplay } from '../../../component/BigIntDisplay';

interface InputTokenWithSelectLiquidProps {
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

const InputTokenWithSelectLiquid: React.FC<InputTokenWithSelectLiquidProps> = ({
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
        const balanceUser = balance?.data?.value ?? BigInt(0);
        if (insufficientBalanceChange) {
            insufficientBalanceChange(
                balanceUser < parseUnits(amount, configSelectToken?.decimals ?? 0),
            );
        }
    }, [amount, balance, insufficientBalanceChange, configSelectToken]);

    useEffect(() => {
        balance.refetch();
    }, [balance, refresh]);

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
    }, [amount, configSelectToken?.decimals, configSelectToken?.symbol, getPrice, valueChange]);

    const overBalance = useMemo(() => {
        if (disableOverBalance) {
            return false;
        }
        if (balance.data) {
            return parseUnits(amount, configSelectToken?.decimals ?? 0) > balance.data?.value
        }
        return true;
    }, [amount, balance, configSelectToken?.decimals]);

    useEffect(() => {
        if(selectToken == 'WETH') {
            setIsSelectWETH(true);
        }
    }, [selectToken]);

    return (
        <div>
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
                </StyledContainerInput>
            </StyledBodyBtn>
        </div>
    );
};

export default InputTokenWithSelectLiquid;

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
const StyledWrapInputAndSubValue = styled.div`
    width: -webkit-fill-available;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: self-start;
    overflow: hidden;
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