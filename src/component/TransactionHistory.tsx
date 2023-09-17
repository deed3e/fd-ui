import { Modal, ModalProps } from './Modals';
import { ReactComponent as IcSuccess } from '../assets/icons/ic-check-round-fill.svg';
import styled from 'styled-components'; 

export const TransactionHistory = ({ onDismiss }: ModalProps) => {
    const MAX_TRANSACTION_SHOW = 5;

    return (
        <StyledContainer>
            <StyledHeader>
                <div>History Transaction</div>
            </StyledHeader>
            <StyledBody>
                <TransactionItem>
                    <IcSuccess />
                    <div>Approve 100 BTC</div>
                </TransactionItem>
                <TransactionItem>
                    <IcSuccess />
                    <div>Swap 100 BTC to ETH</div>
                </TransactionItem>
            </StyledBody>
        </StyledContainer>
    );
};

const StyledContainer = styled(Modal)`
    padding: 8px 15px 5px 18px;
    border-radius: 0;
    width: 400px;
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
const TransactionItem = styled.div`
    margin-top: 5px;
    margin-bottom: 5px;
    display: flex;
    font-weight: 500;
    font-size: 14px;
    align-items: center;
    cursor: pointer;
    :hover {
        color: #6763e3;
    }
    svg {
        margin-right: 5px;
    }
`;
