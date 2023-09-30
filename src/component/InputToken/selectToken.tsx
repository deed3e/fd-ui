import { DropdownSelectToken } from '../../view/Faucet/components/DropdownSelectToken';
import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import { ReactComponent as IconArrowDown } from '../../assets/svg/ic-arrow-down.svg';
import { TokenSymbol } from '../TokenSymbol';
interface SelectTokenProps {
    tokens: string[];
    disableSelect?: boolean;
    tokenChange?: (symbol: string) => unknown;
}

const SelectToken: React.FC<SelectTokenProps> = ({
    tokens,
    disableSelect = false,
    tokenChange,
}) => {
    const [selectToken, setSelectToken] = useState('BTC');

    useEffect(() => {
        if (tokenChange) {
            tokenChange(selectToken);
        }
    }, [selectToken, tokenChange]);

    const onDropDownItemClick = useCallback((symbol: string) => {
        setSelectToken(symbol);
    }, []);

    return (
        <div>
            <StyledBodyBtn>
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
            </StyledBodyBtn>
        </div>
    );
};

export default SelectToken;

const StyledSelectToken = styled.div`
    justify-self: self-end;
    align-self: center;
    display: flex;
    align-items: center;
`;

const StyledBodyBtn = styled.div`
    margin-top: 4.4px;
    margin-bottom: 5px;
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
const StyledTokenSelect = styled(StyledToken)<{ pointer?: boolean }>`
    cursor: ${({ pointer }) => (pointer ? 'pointer' : 'auto')};
    :hover {
        border: 1px solid #515050;
    }
`;
