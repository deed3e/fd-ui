import { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as IconConnectWallet } from '../../assets/svg/ic-connect-wallet.svg';
import userIcon from '../../assets/image/user-icon.png';
import { shortenAddress } from '../../utils/addresses';
import { screenUp } from '../../utils/styles';
import { ethers } from 'ethers';

const ConnectWallet: React.FC = () => {
  const [connect, setConnect] = useState(false);
  const [account, setAccount] = useState('');

  const handleConnect = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Metamask is not installed or not available.');
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const [address] = await provider.send('eth_requestAccounts', []);
    setAccount(address);
    setConnect(true);
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
      {connect === false && (
        <StyledButtonConnect onClick={handleConnect}>
          <IconConnectWallet />
          <span>CONNECT</span>
        </StyledButtonConnect>
      )}
      {connect === true && (
        <StyledButtonConnected>
          <StyledLogo src={userIcon} />
          <span className="address">{shortenAddress(account)}</span>
        </StyledButtonConnected>
      )}
    </>
  );
};

export default ConnectWallet;

const StyledLogo = styled.img`
  height: 22px;
  margin-right: 2px;
`;

const StyledButtonConnect = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  color: #fff;
  svg {
    width: 18px;
    margin-right: 6px;
    path {
      fill: #fff;
    }
  }
  ${screenUp('lg')`
    .mobile {
      display: none ;
    }
    .web {
      display: inline;
    }
  `}
`;
const StyledButtonConnected = styled(StyledButtonConnect)`  
  .address {
    font-weight: normal;
  }
  .web {
    display: none;
  }
  :hover {
    color: #6763E3;
  }
  border: 1px solid #363636;
  padding: 3px 7px 3px 4px;
  border-radius: 8px;
`;

