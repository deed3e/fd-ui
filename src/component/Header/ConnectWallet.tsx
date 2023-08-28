import styled from 'styled-components';
import { ReactComponent as IconConnectWallet } from '../../assets/svg/ic-connect-wallet.svg';
import userIcon from '../../assets/image/user-icon.png';
import logo from '../../assets/svg/logo-token-fdex.svg';
import { shortenAddress } from '../../utils/addresses';
import { screenUp } from '../../utils/styles';
import injectedModule from '@web3-onboard/injected-wallets';
import { useConnectWallet, init } from '@web3-onboard/react';
import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setWallet, TypeUser } from '../../stores';
import { store } from '../../utils/store';
import { getRpcUrl } from '../../config';

const injected = injectedModule();
const rpcUrl = getRpcUrl();

const appMetadata = {
  name: 'FDex',
  icon: logo,
  logo: logo,
  description: 'Fdex',
};

init({
  theme: 'dark',
  accountCenter: {
    desktop: {
      enabled: false,
    },
    mobile: {
      enabled: false,
    },
  },
  appMetadata,
  wallets: [injected],
  chains: [
    {
      id: '0x61',
      token: 'tBNB',
      label: 'BNB Chain testnet',
      rpcUrl,
    },
  ],
});

const ConnectWallet: React.FC = () => {
  const [{ wallet }, connect] = useConnectWallet();
  const userRedux = useSelector((state: TypeUser) => state);
  const dispatch = useDispatch();

  const handleConnectWallet = useCallback(async () => {
    const info = await connect();
    const _wallet = info[0]?.accounts[0].address;
    dispatch(setWallet(_wallet));
    store.set('wallet', _wallet);
    await window.ethereum.request({
      id: 97,
      jsonrpc: '2.0',
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: '0x61',
        },
      ],
    });
  }, [connect, dispatch]);

  useEffect(() => {
    //const _wallet = store.get('wallet');
    //dispatch(setWallet(_wallet));
  }, [dispatch]);

  return (
    <>
      {!userRedux?.wallet && (
        <StyledButtonConnect onClick={handleConnectWallet}>
          <IconConnectWallet />
          <span>CONNECT</span>
        </StyledButtonConnect>
      )}
      {userRedux?.wallet && (
        <StyledButtonConnected>
          <StyledLogo src={userIcon} />
          <span className="address">{shortenAddress(userRedux?.wallet)}</span>
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
