import Header from '../../component/Header';
import styled from 'styled-components';
import { getAdreessUsdc } from '../../config';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { mockERC20Interface } from '../../abis';
import { ethers, formatEther } from 'ethers';
import { useSelector } from 'react-redux';
import { TypeUser } from '../../stores';

const Faucet: React.FC = () => {
  const [balance, setBalance] = useState<BigInt>(BigInt(0));
  const [input, setInput] = useState<string>('0');
  const usdcAdress = getAdreessUsdc();
  const userRedux = useSelector((state: TypeUser) => state);

  const provider = useMemo(() => {
    return new ethers.BrowserProvider(window.ethereum);
  }, []);

  const contractFaucet = useMemo(() => {
    return new ethers.Contract(usdcAdress, mockERC20Interface, provider);
  }, [provider, usdcAdress]);

  const handleFaucet = async () => {
    if (!userRedux?.connected) {
      alert('Please, connect wallet');
      return;
    }
    const signer = await provider.getSigner();
    const contractFaucetWithSigner = contractFaucet.connect(signer);

    if (contractFaucetWithSigner) {
      const tx = await contractFaucetWithSigner?.mint(BigInt(input) * BigInt(1e18));
      await tx.wait();
      fetchBalance();
      setInput('0');
    }
  };

  const addTokenintoWallet = useCallback(async () => {
    const tokenAddress = usdcAdress;
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
  }, [usdcAdress]);

  const fetchBalance = useCallback(async () => {
    if (userRedux?.wallet) {
      const balance = await contractFaucet?.balanceOf(userRedux?.wallet);
      setBalance(balance);
    }
  }, [contractFaucet, userRedux?.wallet]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return (
    <>
      <Header />
      <StyledContainer>
        <StyledBox>
          <div>Balance: {formatEther(balance.toString()).toString()} FDex</div>

          <StyleButton onClick={addTokenintoWallet}>Add token into wallet</StyleButton>
          <div>
            <input onChange={(e: any) => setInput(e?.target.value)}></input>
          </div>
          <StyleButton onClick={handleFaucet}>FAUCET</StyleButton>
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
