import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ReactComponent as Logo } from '../../assets/image/logo-navbar.svg';
import { ReactComponent as IcDot } from '../../assets/icons/ic-dot-green.svg';
import { screenUp } from '../../utils/styles';
import ConnectButton from './ConnectButton';
import { useEffect, useMemo, useState } from 'react';
import { useLastBlockUpdate } from '../../contexts/ApplicationProvider';
import { formatUnits } from 'viem';

const Header: React.FC = () => {
    const location = useLocation();
    const lastBlockUpdate = useLastBlockUpdate();
    const [checkOracleHealth, setCheckOracleHealth] = useState<boolean>(false);
    const [checkKeeperHealth, setCheckKeeperHealth] = useState<boolean>(false);

    const isHome = useMemo(() => {
        if (location.pathname === '/') {
            return true;
        }
        return false;
    }, [location]);

    useEffect(() => {
        try {
            fetch('https://api.fdex.me/price-feed/health').then((res) => {
                if (res.status === 200) {
                    setCheckOracleHealth(true);
                }
            });
        } catch (err) { }
    }, []);

    useEffect(() => {
        try {
            fetch('https://api.fdex.me/keeper/health').then((res) => {
                if (res.status === 200) {
                    setCheckKeeperHealth(true);
                }
            });
        } catch (err) { }
    }, []);

    const checkErr = useMemo(() => {
        return checkKeeperHealth && checkOracleHealth;
    }, [checkKeeperHealth, checkOracleHealth]);

    const currentBlock = useMemo(() => {
        return lastBlockUpdate ? formatUnits(lastBlockUpdate, 0) : '-';
    }, [lastBlockUpdate]);

    return (
        <div>
            <StyledHeader isHome={isHome}>
                <StyledNav>
                    <StyledLogoNavItem>
                        <StyledLogoContainer to="/">
                            <Logo />
                        </StyledLogoContainer>
                    </StyledLogoNavItem>
                    <StyledNavItem>
                        <StyledNavItemLink to="/">Dashboard</StyledNavItemLink>
                    </StyledNavItem>
                    <StyledNavItem>
                        <StyledNavItemLink to="/trading/btc">Trading</StyledNavItemLink>
                    </StyledNavItem>
                    <StyledNavItem>
                        <StyledNavItemLink to="/swap">Swap</StyledNavItemLink>
                    </StyledNavItem>
                    <StyledNavItem>
                        <StyledNavItemLink to="/liquidity">Liquidity</StyledNavItemLink>
                    </StyledNavItem>
                    <StyledNavItem>
                        <StyledNavItemLink to="/referer">Referral</StyledNavItemLink>
                    </StyledNavItem>
                    <StyledNavItem>
                        <StyledNavItemLink to="/analytic">Analytics</StyledNavItemLink>
                    </StyledNavItem>
                    <StyledNavItem>
                        <StyledNavItemLink to="/leaderboard">Leaderboard</StyledNavItemLink>
                    </StyledNavItem>
                    <StyledNavItem>
                        <StyledNavItemLink to="/faucet">Faucet</StyledNavItemLink>
                    </StyledNavItem>
                </StyledNav>
                <StyledConnectWallet>
                    <StyledChain>
                        <w3m-network-button />
                    </StyledChain>
                    <ConnectButton />
                </StyledConnectWallet>
            </StyledHeader>
            {!isHome && (
                <StyledLastBlockNumber err={!checkErr}>
                    <IcDot></IcDot>
                    <a
                        data-tooltip-id="my-tooltip"
                        data-tooltip-html={`${currentBlock} is the most recent <br/> block number on this network.<br/> 
The connection is stable.`}
                        style={{ fontFamily: 'IBM Plex Mono' }}
                    >
                        {currentBlock}
                    </a>
                    {!checkOracleHealth && <>&nbsp;&&nbsp;oracle error</>}
                    {!checkKeeperHealth && <>&nbsp;&&nbsp;keeper error</>}
                </StyledLastBlockNumber>
            )}
        </div>
    );
};

export default Header;

const StyledHeader = styled.header<{ isHome: boolean }>`
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    border-bottom: 0.5px solid #363636;
    background: ${(p) => (p.isHome ? '' : 'black')};
    padding: 0 25px;
    z-index: 1000;
`;

const StyledLogoContainer = styled(NavLink)`
    margin-right: 20px;
    display: flex;
    align-items: center;
    svg {
        height: 28px;
        width: 28px;
    }
`;

const StyledNavItem = styled.li`
    padding: 0;
    display: flex;
    margin: 0 15px;
    align-items: center;
    justify-content: center;
`;

const StyledLogoNavItem = styled(StyledNavItem)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    + ${StyledNavItem} {
        margin: 0 15px;
    }
    margin: 0;
`;

const StyledNav = styled.ul<{ visible?: boolean }>`
    padding: 0;
    margin: 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 285px;
    height: 100%;
    z-index: 1001;
    ${screenUp('lg')`
    width: 100%;
    position: static;
    transform: none;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  `}
`;

const StyledNavItemLink = styled(NavLink)`
    padding: 0;
    color: #7e7e7e;
    font-weight: 600;
    &:hover,
    &.active {
        color: #fff;
        font-weight: 700;
    }
    font-size: 14px;
`;

const StyledConnectWallet = styled.div`
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 620px;
`;

const StyledChain = styled.div`
    align-items: center;
    border-right: 1px solid #363636;
    margin-right: 10px;
    padding-right: 10px;
    display: flex;
`;

const StyledLastBlockNumber = styled.div<{ err: boolean }>`
    width: 50%;
    background-image: linear-gradient(to top right, rgba(13,13,13,1), rgba(13,13,13,0));
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 5px 0px 10px 10px;
    font-size: 12px;
    color: ${(p) => (p.err ? '#f0d10a' : '#12d712')};
    svg {
        height: 7px;
        width: 7px;
        circle {
            fill: ${(p) => (p.err ? '#f0d10a' : '#12d712')};
        }
    }
    display: flex;
    align-items: center;
    gap: 3px;
    cursor: pointer;
`;
