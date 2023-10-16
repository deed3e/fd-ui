import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import logoChain from '../../assets/image/logo-bnb.png';
import { ReactComponent as Logo } from '../../assets/image/logo-navbar.svg';
import { screenUp } from '../../utils/styles';
import ConnectButton from './ConnectButton';

const Header: React.FC = () => {
    return (
        <div>
            <StyledHeader>
                <StyledNav>
                    <StyledLogoNavItem>
                        <StyledLogoContainer to="/">
                            <Logo />
                        </StyledLogoContainer>
                    </StyledLogoNavItem>
                    <StyledNavItem>
                        <StyledNavItemLink to="/">DASHBOARD</StyledNavItemLink>
                    </StyledNavItem>
                    <StyledNavItem>
                        <StyledNavItemLink to="/trading/btc/long">TRADING</StyledNavItemLink>
                    </StyledNavItem>
                    <StyledNavItem>
                        <StyledNavItemLink to="/swap">SWAP</StyledNavItemLink>
                    </StyledNavItem>
                    <StyledNavItem>
                        <StyledNavItemLink to="/liquidity">LIQUIDITY</StyledNavItemLink>
                    </StyledNavItem>
                    <StyledNavItem>
                        <StyledNavItemLink to="/analytic">ANALYTIC</StyledNavItemLink>
                    </StyledNavItem>
                    <StyledNavItem>
                        <StyledNavItemLink to="/faucet">FAUCET</StyledNavItemLink>
                    </StyledNavItem>
                </StyledNav>
                <StyledConnectWallet>
                    <StyledChain>
                        <w3m-network-button />
                    </StyledChain>
                    <ConnectButton />
                </StyledConnectWallet>
            </StyledHeader>
        </div>
    );
};

export default Header;

const StyledHeader = styled.header`
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
    ${screenUp('lg')`
    padding: 0 25px;
    z-index: 1000;
  `}
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
    margin: 24px 21px 0 21px;
    padding: 0;
    display: flex;
    ${screenUp('lg')`
    margin: 0 15px;
    align-items: center;
    justify-content: center;
  `};
`;

const StyledLogoNavItem = styled(StyledNavItem)`
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    + ${StyledNavItem} {
        margin-top: 36px;
        ${screenUp('lg')`
      margin: 0 15px;
    `}
    }
    ${screenUp('lg')`
    margin: 0;
  `}
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
    color: #979595;
    font-size: 16px;
    font-weight: 500;
    &:hover,
    &.active {
        color: #6763e3;
    }
    ${screenUp('lg')`
    font-size: 14px;
  `}
`;

const StyledConnectWallet = styled.div`
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 620px;
`;

const StyledChain = styled.div`
    display: none;
    align-items: center;
    border-right: 1px solid #363636;
    margin-right: 10px;
    padding-right: 10px;
    display: flex;
`;
