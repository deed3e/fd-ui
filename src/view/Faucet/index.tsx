import styled from 'styled-components';
import { getAdreessUsdc } from '../../config';
import { useCallback, useEffect } from 'react';
import MockERC20 from '../../abis/MockERC20.json';
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useBalance,
  useAccount,
} from 'wagmi';
import { getAddress } from 'viem';
import { useShowToast } from '../../hooks/useShowToast';

const Faucet: React.FC = () => {
  const usdcAddress = getAdreessUsdc();
  const { address } = useAccount();
  const showToast = useShowToast();

  const balance = useBalance({
    address: address,
    token: getAddress(usdcAddress),
  });

  const { config } = usePrepareContractWrite({
    address: getAddress(usdcAddress),
    abi: MockERC20,
    functionName: 'mint',
    args: [1000000000000000000],
  });

  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const addTokenintoWallet = useCallback(async () => {
    const tokenAddress = usdcAddress;
    const tokenSymbol = 'FDex';
    const tokenDecimals = 18;
    const tokenImage = 'https://i.ibb.co/ykR7C2N/Group-267.png';

    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, [usdcAddress]);

  useEffect(() => {
    if (isSuccess) {
      balance.refetch();
    }
  }, [balance, isSuccess]);

  useEffect(() => {
    if (isLoading) {
      showToast('Waiting for transection', '', 'warning');
    }
  }, [isLoading, showToast]);

  useEffect(() => {
    if (isSuccess) {
      showToast('Success faucet 1 usdc', '', 'success');
    }
  }, [isSuccess, showToast]);

  return (
    <>
      <StyledContainer>
        <StyledBox>
          <div>Balance: {balance.data?.formatted} usdc</div>
          <StyleButton onClick={addTokenintoWallet}>Add token into wallet</StyleButton>
          <br />
          <StyleButton onClick={() => write?.()}>FAUCET</StyleButton>
        </StyledBox>
      </StyledContainer>
    </>
  );
};

export default Faucet;

const StyledContainer = styled.div`
  width: 100%;
`;

const StyledBox = styled.div`
  margin-top: 30px;
  margin-left: 50%;
  margin-right: 50%;
`;

const StyleButton = styled.div`
  cursor: pointer;
  color: red;
`;
