import styled from 'styled-components';
import { ReactComponent as IconConnectWallet } from '../../assets/svg/ic-connect-wallet.svg';
import userIcon from '../../assets/image/user-icon.png';
import { shortenAddress } from '../../utils/addresses';
import { screenUp } from '../../utils/styles';
import { useEffect } from 'react';
import { useConnect, useAccount, useDisconnect, useSwitchNetwork } from 'wagmi';

const ConnectWallet: React.FC = () => {
  const { connect, connectors, isSuccess } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork();

  const connector = connectors.findLast((connector) => connector.ready);

  const handleConnectWallet = async () => {
    if (!connector) {
      alert('Please install MetaMask!');
      return;
    }
    connect({ connector });
  };

  useEffect(() => {
    if (isSuccess) {
      switchNetwork?.(97);
    }
  }, [isSuccess, switchNetwork]);

  return (
    <>
      {!isConnected && (
        <StyledButtonConnect onClick={handleConnectWallet}>
          <IconConnectWallet />
          <span>CONNECT</span>
        </StyledButtonConnect>
      )}
      {isConnected && (
        <StyledButtonConnected onClick={()=>disconnect()}>
          <StyledLogo src={userIcon} />
          <span className="address">{shortenAddress(address)}</span>
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
    color: #6763e3;
  }
  border: 1px solid #363636;
  padding: 3px 7px 3px 4px;
  border-radius: 8px;
`;
