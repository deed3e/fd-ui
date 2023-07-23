import styled from 'styled-components';
import { ethers } from 'ethers';
import logo from '../../../assets/icon/logo-tab-3.png';
import { useEffect, useState } from 'react';
import { screenUp } from '../../../utils/styles';
const Header: React.FC = () => {
  const [connect, setConnect] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');

  const handleConnect = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Metamask is not installed or not available.');
    }
    const provider =new ethers.providers.Web3Provider(window.ethereum); 
    const [address] = await provider.send('eth_requestAccounts', []);
    setAddress(address);
    localStorage.setItem('address', address);
    try {
      const { chainId } = await provider.getNetwork();
      setConnect(true);
      if (chainId !== 1) throw 'Error network';
      console.log('chainId', chainId);
    } catch (error) {
      await window.ethereum.request({
        id: 1,
        jsonrpc: '2.0',
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: '0x1',
          },
        ],
      });
    }
  };

  return (
    <>
      <StyledContainer>
        <StyledButton>
          <div className="logo">
            <img src={logo} />
          </div>
        </StyledButton>
        <StyledButton>About Us</StyledButton>
        <StyledButton>Product</StyledButton>
        <StyledButton>Developers</StyledButton>
        <StyledButton></StyledButton>
        <StyledButton>Deposit</StyledButton>
        <StyledButton>Withdraw</StyledButton>
        <StyledButton></StyledButton>
        <StyledContainerButtonWallet>
          <StyledButtonConnect>
            <div onClick={handleConnect}>Connect Wallet</div>
          </StyledButtonConnect>
        </StyledContainerButtonWallet>
      </StyledContainer>
    </>
  );
};

export default Header;

const StyledContainer = styled.div`
  padding: 10px;
  background-color: black;
  display: grid;
  color: #fff;
  ${screenUp('lg')`
     grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 2fr;
    `}
  grid-template-rows: auto;
`;

const StyledButton = styled.div`
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 200px;
  }
`;
const StyledContainerButtonWallet = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
`;

const StyledButtonConnect = styled.div`
  background-color: #fff;
  padding: 9px 15px;
  border-radius: 12px;
  color: black;
`;
const StyledButtonConnected = styled.div`
  background-color: #fff;
  padding: 9px 15px;
  border-radius: 12px;
  color: #f4efef;
`;
