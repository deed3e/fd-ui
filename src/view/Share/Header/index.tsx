import styled from "styled-components";
import logo from '../../../assets/icon/logo-tab-3.png';
const Header: React.FC = () => {
    return (
        <>
            <StyledContainer>
                <StyledButton>
                    <div className="logo">
                        <img src={logo} />
                    </div>
                </StyledButton>
                <StyledButton>
                    About Us
                </StyledButton>
                <StyledButton>
                    Product
                </StyledButton>
                <StyledButton>
                    Developers
                </StyledButton>
                <StyledButton>
                </StyledButton>
                <StyledButton>
                    Deposit
                </StyledButton>
                <StyledButton>
                    Withdraw
                </StyledButton>
                <StyledButton>
                </StyledButton>
                <StyledContainerButtonWallet>
                    <StyledButtonConnect>
                            <div>
                            Connect Wallet
                            </div>
                    </StyledButtonConnect>
                </StyledContainerButtonWallet>
               



            </StyledContainer>
        </>
    );
}

export default Header;

const StyledContainer = styled.div`
     padding: 10px;
     background-color: black;
     display: grid;
     grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 2fr;
     color: #fff;
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
`;

const StyledButtonConnect= styled.div`
    background-color: #fff;
    padding: 9px 15px;
    border-radius: 12px;
    color: black;
`;





