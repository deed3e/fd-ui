import React, { ReactElement, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { DropdownMenu } from '../../../../../component/Dropdown';
import { Dropdown } from '../../../../../component/Dropdown/Dropdown';
import { DropdownToggle } from '../../../../../component/Dropdown/DropdownToggle';

export type DropdownSelectOrderProps = {
    selectedOrder: string;
    orders?: string[];
    onSelect?: (token: string) => void;
    children: ReactElement;
    position?: 'right' | 'left';
    disable?: boolean;
};

export const DropdownSelectOrder: React.FC<DropdownSelectOrderProps> = ({
    selectedOrder,
    orders,
    onSelect,
    children,
    position,
    disable = false,
}) => {
    const onSelectOrder = useCallback(
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
            <div className="container-order-type">
                <DropdownToggle>{children}</DropdownToggle>
                <StyledDropdownMenu position={position}>
                    <StyleDropdownList>
                        {orders?.map((order) => (
                            <StyleDropdownItem
                                data-symbol={order}
                                key={order}
                                onClick={onSelectOrder}
                                active={order === selectedOrder}
                            >
                                <div className="info">{order}</div>
                            </StyleDropdownItem>
                        ))}
                    </StyleDropdownList>
                </StyledDropdownMenu>
            </div>
        </Dropdown>
    );
};

const StyledDropdownMenu = styled(DropdownMenu)`
    width: 100%;
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
    color: ${(p) => (p.active ? '#6763e3' : '#fff')};
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
                    fill: #6763e3;
                }
                rect {
                    stroke: #6763e3;
                }
            }
        }
    }
    :not(:last-child) {
        border-bottom: 1px solid #363636;
    }
    :hover {
        color: #6763e3;
    }
`;
