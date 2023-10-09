import styled from 'styled-components';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useContractRead,useBalance } from 'wagmi';
import { parseUnits } from 'viem';
import { BigintDisplay } from '../../../../../component/BigIntDisplay';

interface InputTokenProps {
    disable?: boolean;
    value?: string;
    amountChangeHandler?: (amount: BigInt) => unknown;
}

const InputToken: React.FC<InputTokenProps> = ({
    disable = false,
    value,
    amountChangeHandler,
}) => {
    const { address } = useAccount();

    const [amount, setAmount] = useState('');

    
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
                if (amountChangeHandler) {
                    amountChangeHandler(tmp as BigInt);
                }
            }
        },
        [amountChangeHandler],
    );

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
                        ></StyledInput>
                    </StyledWrapInputAndSubValue>
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