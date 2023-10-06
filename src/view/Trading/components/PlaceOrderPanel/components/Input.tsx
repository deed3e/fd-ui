import styled from 'styled-components';
import { ChangeEvent, useState, useCallback } from 'react';

interface InputTokenProps {
    disable?: boolean;
    value?: string;
    addressChange?: (address: string) => unknown;
}

const InputToken: React.FC<InputTokenProps> = ({
    disable = false,
    value,
    addressChange
}) => {

    const [address, setAddress] = useState('');


    const handleInputHandle = useCallback(
        (ev: ChangeEvent<HTMLInputElement>) => {
            setAddress(ev.target.value);
            if (addressChange) addressChange(ev.target.value);
        },
        [addressChange],
    );


    return (
        <div>
            <StyledBodyBtn>
                <StyledContainerInput disable={disable}>
                    <StyledWrapInputAndSubValue>
                        <StyledInput
                            placeholder='0x...'
                            value={value ?? address}
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

