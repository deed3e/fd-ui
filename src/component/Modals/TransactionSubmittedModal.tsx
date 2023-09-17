import styled from 'styled-components';
import Modal, { ModalCloseButton, ModalContent, ModalProps } from './ModalComponent';
import iconTransactionSubmitted from '../../assets/icons/ic-transaction-submitted.svg';
import { ReactComponent as AddressIcon } from '../../assets/icons/ic-view-address.svg';
import { ExplorerLink } from '../ExplorerLink';
import { config } from '../../config';

export interface TransactionSubmittedModalProps extends ModalProps {
  message: string;
  hash: string;
}

export const TransactionSubmittedModal: React.FC<TransactionSubmittedModalProps> = ({
  hash,
  onDismiss,
  message,
}) => {
  return (
    <Modal size="sxs">
      <StyledHeader>
        <ModalCloseButton onClick={onDismiss} />
      </StyledHeader>
      <StyledModalContent>
        <StyledImageSuccess src={iconTransactionSubmitted} />
        <StyledTitle>Transaction Submitted</StyledTitle>
        <StyledMessage>{message}</StyledMessage>
        <StyledLink>
          <ExplorerLink type="tx" address={hash}>
            <AddressIcon />
            View On {config.etherscanName}
          </ExplorerLink>
        </StyledLink>
      </StyledModalContent>
    </Modal>
  );
};

const StyledHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 18px 18px 0 0;
`;

const StyledModalContent = styled(ModalContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 0px;
`;

const StyledImageSuccess = styled.img`
  width: 50px;
`;

const StyledTitle = styled.div`
  padding-top: 20px;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
`;

const StyledMessage = styled.div`
  padding-top: 12px;
  font-size: 14px;
  text-align: center;
  color: #adabab;
  line-height: 1.5;
`;

const StyledLink = styled.div`
  margin-top: 25px;
  a {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    color: #ffb313;
    svg {
      width: 14px;
      margin-right: 5px;
      path {
        fill: #ffb313;
      }
    }
    :hover {
      text-decoration: underline;
    }
  }
`;
