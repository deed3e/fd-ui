import styled from 'styled-components';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useContractRead,useBalance } from 'wagmi';
import { parseUnits } from 'viem';
import { getTokenConfig, getLpSymbol } from '../../config';
import { BigintDisplay } from '../../component/BigIntDisplay';

import MockER from '../../abis/MockERC20.json';

interface InputTokenProps {
    refresh?: boolean;
    title: string;
    disable?: boolean;
    disableOverBalance?: boolean;
    value?: string;
    insufficientBalanceChange?: (check: boolean) => unknown;
    amountChange?: (amount: BigInt) => unknown;
}

const InputToken: React.FC<InputTokenProps> = ({
    refresh,
    title = 'Amount',
    disable = false,
    disableOverBalance = false,
    value,
    amountChange,
    insufficientBalanceChange,
}) => {
    const { address } = useAccount();
    const [isShowMax] = useState(false);

    const [decimals, setDecimals] = useState(getTokenConfig(getLpSymbol())?.decimals);
    const [threshold, setThreshold] = useState(getTokenConfig(getLpSymbol())?.threshold);
    const [fractionDigits, setFractionDigits] = useState(getTokenConfig(getLpSymbol())?.fractionDigits);

    const [amount, setAmount] = useState('');

    const balance = useContractRead({
        address: getTokenConfig(getLpSymbol())?.address,
        abi: MockER,
        functionName: 'balanceOf',
        args: [address],
    });

    
    const handleInputHandle = useCallback(
        (ev: ChangeEvent<HTMLInputElement>) => {
            const tmp = ev.target.value;
            var regExp = /^0[0-9].*$/;
            const splipDot = tmp.split('.');
            const check =
                (parseUnits(tmp.replace('.', ''), 18 ?? 0) || +tmp === 0) &&
                splipDot.length <= 2 &&
                !tmp.includes(' ') &&
                !regExp.test(tmp);
            if (check) {
                setAmount(tmp);
                const value = parseUnits(tmp, decimals ?? 0);
                if (amountChange) {
                    amountChange(value as BigInt);
                }
            }
        },
        [amountChange, decimals],
    );

    useEffect(() => {
        const balanceUser = balance?.data ?? BigInt(0);
        if (insufficientBalanceChange) {
            insufficientBalanceChange(
                (balanceUser as bigint) < parseUnits(amount, decimals ?? 0),
            );
        }
    }, [amount, balance, insufficientBalanceChange, decimals]);

    useEffect(() => {
        balance.refetch();
    }, [balance, refresh]);

    const overBalance = useMemo(() => {
        if (disableOverBalance) {
            return false;
        }
        if (balance.data) {
            return parseUnits(amount, decimals ?? 0) > (balance.data as bigint);
        }
        return true;
    }, [amount, balance, decimals]);

    return (
        <div>
            <StyledHeaderBtn>
                <StyledAmount>{title}</StyledAmount>
                <StyledBalance>
                    Balance:{' '}
                    <BigintDisplay
                        value={balance.data as BigInt}
                        decimals={decimals ?? 1}
                        threshold={threshold}
                        fractionDigits={fractionDigits}
                    />{' '}
                    LP
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
                    </StyledWrapInputAndSubValue>
                    {isShowMax && <StyledMaxValue>Max</StyledMaxValue>}
                </StyledContainerInput>
            </StyledBodyBtn>
        </div>
    );
};

export default InputToken;

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

const StyledWrapInputAndSubValue = styled.div`
    width: -webkit-fill-available;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: self-start;
    overflow: hidden;
`;

const StyledAmount = styled.div``;

const StyledBalance = styled.div`
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    font-weight: 300;
`;
const StyledContainerInput = styled.div<{ disable?: boolean }>`
    position: relative;
    background-color: ${({ disable }) => (disable ? 'rgba(255, 255, 255, 0.1);' : 'black')};
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
