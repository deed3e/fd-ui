import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { DropdownMenu, DropdownToggle } from '../../component/Dropdown';
import { Dropdown } from '../../component/Dropdown/Dropdown';
import { ReactComponent as IconDisconnect } from '../../assets/icons/ic-disconnect.svg';
import { ReactComponent as IconProfile } from '../../assets/icons/ic-profile-detail.svg';
import { ReactComponent as IconHistory } from '../../assets/icons/ic-transaction-profile.svg';

import { useDisconnect } from 'wagmi';
import { TransactionHistory } from '../TransactionHistory';
import { useModal } from '../Modals';
export type DropdownUserProps = {
    position?: 'right' | 'left';
    children: ReactElement;
};

export const DropdownUser: React.FC<DropdownUserProps> = ({ position, children }) => {
    const { disconnect } = useDisconnect();
    const [showAccountModal] = useModal(<TransactionHistory />);
    return (
        <Dropdown>
            <DropdownToggle>{children}</DropdownToggle>
            <StyledDropdownMenu position={position}>
                <StyleDropdownList>
                    <StyleDropdownItem onClick={showAccountModal}>
                        <IconHistory /> Transaction
                    </StyleDropdownItem>
                    <StyleDropdownItem>
                        <IconProfile /> Profile Details
                    </StyleDropdownItem>
                    <StyleDropdownItem onClick={() => disconnect()}>
                        <IconDisconnect /> Disconnect
                    </StyleDropdownItem>
                </StyleDropdownList>
            </StyledDropdownMenu>
        </Dropdown>
    );
};

const StyledDropdownMenu = styled(DropdownMenu)`
    width: 170px;
    min-width: auto;
    overflow-x: auto;
    max-height: 200px;
    background: #363636;
    margin: 18px -10px 0 0;
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
    :not(:last-child) {
        border-bottom: 1px solid #363636;
    }
    :hover {
        color: #6763e3;
        :last-child {
            color: red;
        }
    }
    svg path {
        fill: none;
        stroke: #c7c5c5;
    }
`;
