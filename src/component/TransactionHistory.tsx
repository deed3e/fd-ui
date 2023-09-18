import { Modal, ModalProps } from './Modals';
import { ReactComponent as IcSuccess } from '../assets/icons/ic-check-round-fill.svg';
import styled from 'styled-components';
import { store } from '../utils/store';
import { useAccount } from 'wagmi';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ExplorerLink } from './ExplorerLink';

export enum StatusHistoryTransaction {
    success,
    false,
}

export interface IHistoryTransaction {
    hash: string;
    title: string;
    status: StatusHistoryTransaction;
}

const MAX_TRANSACTION_SHOW = 5;
export const TransactionHistory = ({ onDismiss }: ModalProps) => {
    const [localStore, setLocalStore] = useState<IHistoryTransaction[] | undefined>(undefined);
    const { address } = useAccount();

    useEffect(() => {
        let allStore: IHistoryTransaction[] | undefined = store.get(address ?? 'guest');
        if (allStore) {
            allStore.reverse();
            allStore = allStore.slice(0, MAX_TRANSACTION_SHOW);
        }
        setLocalStore(allStore);
    }, []);

    const handleClear = useCallback(() => {
        store.set(address ?? 'guest', '');
        setLocalStore(undefined);
    }, []);
    return (
        <StyledContainer>
            <StyledHeader>
                <div>History Transaction</div>
            </StyledHeader>
            <StyledBody>
                <StyledItemClear>
                    <div onClick={handleClear}>clear</div>
                </StyledItemClear>
                {localStore &&
                    localStore?.map((item: IHistoryTransaction) => (
                        <TransactionItem check={item.status === StatusHistoryTransaction.false}>
                            <IcSuccess />
                            <div>{item.title}</div>&nbsp;
                            <ExplorerLink address={item.hash}>Link</ExplorerLink>
                        </TransactionItem>
                    ))}
            </StyledBody>
        </StyledContainer>
    );
};

const StyledItemClear = styled.div`
    display: flex;
    flex-direction: row-reverse;
    div {
        :last-child {
            font-size: 12px;
            color: #d9d9d9;
            cursor: pointer;
        }
        :hover {
            :last-child {
                color: #901919;
            }
        }
    }
`;
const StyledContainer = styled(Modal)`
    padding: 8px 15px 5px 18px;
    border-radius: 0;
    width: 350px;
`;
const StyledBody = styled(Modal)`
    padding-top: 6px;
    padding-bottom: 4px;
`;
const StyledHeader = styled.div`
    padding-bottom: 6px;
    border-bottom: 0.5px solid #d9d9d9;
    font-size: 16px;
    font-weight: 600;
`;
const TransactionItem = styled.div<{ check?: boolean }>`
    margin-top: 5px;
    margin-bottom: 5px;
    display: flex;
    font-weight: 500;
    font-size: 14px;
    align-items: center;
    padding-right: 15px;
    svg {
        margin-right: 5px;
        path {
            fill: ${(p) => (p?.check ? '#982222' : '')};
        }
    }
`;
