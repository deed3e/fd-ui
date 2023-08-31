import { toast, TypeOptions } from 'react-toastify';
import successIcon from '../../assets/svg/ic-toast-success.svg';
import errorIcon from '../../assets/svg/ic-toast-error.svg';
import pendingIcon from '../../assets/svg/ic-toast-pending.svg';
import loadingIcon from '../../assets/image/ic-loading.png';
import styled from 'styled-components';
import './index.css';
import { useEffect, useMemo } from 'react';
import { useTransaction } from 'wagmi'
import { config } from '../../config';
import { getAddress } from 'viem'
export const TransactionToast: React.FC<{ hash: string }> = ({ hash }) => {
  const transaction = useTransaction({hash: getAddress(hash)});

  const url = useMemo(() => {
    return [config.explorerUrl, 'tx', transaction.data?.hash].join('/');
  }, [transaction.data?.hash]);

  const status = useMemo(() => {
    if (transaction.error) {
      return 'error';
    }
    if (transaction.isLoading) {
      return 'submitted';
    }

    if (transaction.isSuccess) {
      return 'success';
    }
    return 'error';
  }, [transaction]);

  const icon = useMemo(() => {
    switch (status) {
      case 'success':
        return successIcon;
      case 'submitted':
        return loadingIcon;
      default:
        return errorIcon;
    }
  }, [status]);

  const title = useMemo(() => {
    switch (status) {
      case 'success':
        return 'Transaction completed';
      case 'submitted':
        return 'Processing transaction';
      default:
        return 'Failed';
    }
  }, [status]);

  useEffect(() => {
    switch (status) {
      case 'success':
        toast.update(hash, {
          type: 'success',
          autoClose: 5000,
        });
        break;
      case 'submitted':
        toast.update(hash, {
          type: 'warning',
          autoClose: 500000000000,
        });
        break;
      default:
        toast.update(hash, {
          type: 'error',
          autoClose: 5000,
        });
        break;
    }
  }, [hash, status]);

  return (
    <StyledTransactionContainer target="_blank" href={url}>
      {status === 'submitted' ? (
        <StyledIconLoading>
          <img src={icon}  alt=""/>
        </StyledIconLoading>
      ) : (
        <StyledIcon src={icon} />
      )}
      <StyledContentContainer>
        <StyledTitle>{title}</StyledTitle>
      </StyledContentContainer>
    </StyledTransactionContainer>
  );
};

export const SimpleToast: React.FC<{ title: string; message: string; type?: TypeOptions }> = ({
  title,
  message,
  type,
}) => {
  const icon = useMemo(() => {
    switch (type) {
      case 'success':
        return successIcon;
      case 'error':
        return errorIcon;
      case 'warning':
        return pendingIcon;
      default:
        return pendingIcon;
    }
  }, [type]);

  return (
    <StyledContainer>
      <StyledIcon src={icon} />
      <StyledContentContainer>
        <StyledTitle>{title}</StyledTitle>
        <StyledContent>{message}</StyledContent>
      </StyledContentContainer>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledTransactionContainer = styled.a`
  display: flex;
  align-items: center;
`;

const StyledContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #fff;
`;

const StyledContent = styled.div`
  padding-top: 5px;
  font-size: 13px;
  line-height: 1.5;
  color: #979595;
`;

const StyledIcon = styled.img`
  margin-right: 16px;
  width: 36px;
  height: 36px;
`;

const StyledIconLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-right: 16px;
  img {
    width: 25px;
    height: 25px;
    animation: loading 1s infinite linear;
  }
`;
