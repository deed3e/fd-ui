import React, { ReactElement, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { DropdownMenu } from '../../../component/Dropdown';
import { Dropdown } from '../../../component/Dropdown/Dropdown';
import { DropdownToggle } from '../../../component/Dropdown/DropdownToggle';
import { TokenSymbol } from '../../../component/TokenSymbol';
import { getTokenConfig } from '../../../config';

export type DropdownSelectTokenProps = {
    selectedToken: string;
    tokens?: string[];
    onSelect?: (token: string) => void;
    children: ReactElement;
    position?: 'right' | 'left';
    disable?: boolean;
};

export const DropdownSelectToken: React.FC<DropdownSelectTokenProps> = ({
    selectedToken,
    tokens,
    onSelect,
    children,
    position,
    disable = false,
}) => {
    const tokenConfigs = useMemo(() => {
        if (!tokens) return [];
        return tokens.map((t) => {
            const tokenConfig = getTokenConfig(t);
            return {
                symbol: t,
                address: tokenConfig?.address,
                decimals: tokenConfig?.decimals,
                fractionDigits: tokenConfig?.fractionDigits,
                priceFractionDigits: tokenConfig?.priceFractionDigits,
                threshold: tokenConfig?.threshold,
            };
        });
    }, [tokens]);

    const onSelectToken = useCallback(
        (ev: React.MouseEvent<HTMLDivElement>) => {
            const symbol = ev.currentTarget.dataset.symbol;
            if (!disable && symbol && onSelect) {
                onSelect(symbol);
            }
        },
        [onSelect],
    );
    return (
        <Dropdown>
            <DropdownToggle>{children}</DropdownToggle>
            <StyledDropdownMenu position={position}>
                <StyleDropdownList>
                    {tokenConfigs?.map((token, index) => (
                        <StyleDropdownItem
                            data-symbol={token.symbol}
                            key={index}
                            onClick={onSelectToken}
                            active={token?.symbol === selectedToken}
                        >
                            <TokenSymbol symbol={token.symbol} size={28} />
                            <div className="info">{token?.symbol}</div>
                        </StyleDropdownItem>
                    ))}
                </StyleDropdownList>
            </StyledDropdownMenu>
        </Dropdown>
    );
};

const StyledDropdownMenu = styled(DropdownMenu)`
    width: 90px;
    min-width: auto;
    overflow-x: auto;
    max-height: 200px;
    background: #29292c;
    border-radius: 10px;
    padding: 10px 15px 0 15px;
    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        border-radius: 8px;
        background: #29292c;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 8px;
        background: #363636;
    }
`;

const StyleDropdownList = styled.div`
    margin-top: -8px;
    margin-left: -8px;
    margin-right: -8px;
`;

const StyleDropdownItem = styled.div<{ active?: boolean }>`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 8px 0;
    font-size: 14px;
    color: ${(p) => (p.active ? '#ffb313' : '#fff')};
    cursor: pointer;
    .info {
        margin-left: 8px;
        text-align: left;
        .balance {
            padding-top: 2px;
            font-size: 12px;
            font-weight: normal;
            color: #adabab;
        }
    }
    .btn-add {
        margin-left: auto;
        svg {
            path {
                fill: #adabab;
            }
            rect {
                stroke: #adabab;
            }
        }
        :hover {
            svg {
                path {
                    fill: #ffb313;
                }
                rect {
                    stroke: #ffb313;
                }
            }
        }
    }
    :not(:last-child) {
        border-bottom: 1px solid #363636;
    }
    :hover {
        color: #ffb313;
    }
`;
