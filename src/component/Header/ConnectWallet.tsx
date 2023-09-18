import styled from 'styled-components';
import { ReactComponent as IconConnectWallet } from '../../assets/svg/ic-connect-wallet.svg';
import userIcon from '../../assets/image/user-icon.png';
import { shortenAddress } from '../../utils/addresses';
import { useCallback, useEffect } from 'react';
import { useConnect, useAccount, useSwitchNetwork } from 'wagmi';
import { DropdownUser } from './DropdownUser';

const ConnectWallet: React.FC = () => {
    const { connect, connectors, isSuccess } = useConnect();
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

    const handleUserModal = useCallback(() => {}, []);

    return (
        <>
            {!isConnected && (
                <StyledButtonConnect onClick={handleConnectWallet}>
                    <IconConnectWallet />
                    <span>CONNECT</span>
                </StyledButtonConnect>
            )}
            {isConnected && (
                <StyledButtonConnected onClick={handleUserModal}>
                    <DropdownUser position="right">
                        <StyledWrapChild>
                            <StyledLogo src={userIcon} />
                            <span className="address">{shortenAddress(address)}</span>
                        </StyledWrapChild>
                    </DropdownUser>
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
        path{
            fill: #fff;
        }
    }
`;

const StyledWrapChild = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    color: #fff;
    svg {
        width: 18px;
        margin-right: 6px;
    }
    .address {
        font-weight: normal;
    }
    :hover {
        color: #6763e3;
    }
`;
const StyledButtonConnected = styled(StyledButtonConnect)`
    border: 1px solid #363636;
    padding: 3px 7px 3px 4px;
    border-radius: 8px;
`;
