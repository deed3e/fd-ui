import { useWeb3Modal } from '@web3modal/wagmi/react';
import styled from 'styled-components';
import { useAccount, useConnect, useSwitchNetwork } from 'wagmi';
import userIcon from '../../assets/image/user-icon.png';
import { DropdownUser } from './DropdownUser';
import { useCallback, useEffect } from 'react';
import { shortenAddress } from '../../utils/addresses';
import { watchAccount } from '@wagmi/core';

export default function ConnectButton() {
    const { open } = useWeb3Modal();
    const { isSuccess } = useConnect();
    const { address, isConnected } = useAccount();
    const { switchNetwork } = useSwitchNetwork();
    const handleUserModal = useCallback(() => {}, []);

    useEffect(() => {
        if (isSuccess) {
            switchNetwork?.(97);
        }
    }, [isSuccess, switchNetwork, address]);

    watchAccount(() => () => open())

    return (
        <>
            {!isConnected && (
                <StyledButtonConnect onClick={() => open()}>
                    {/* <IconConnectWallet />
                    <span>CONNECT</span> */}
                    <w3m-connect-button size='sm' />
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
}
const StyledLogo = styled.img`
    height: 22px;
    margin-right: 2px;
`;

const StyledButtonConnect = styled.div`
    cursor: pointer;
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
