import styled from "styled-components";
import logo from '../../../assets/icon/logo-tab-3.png';
import tw from "../../../assets/icon/ic-tw.svg";
import tg from "../../../assets/icon/ic-tg.svg";
import { screenUp } from "../../../utils/styles";
const Footer: React.FC = () => {
    return (
        <>
            <StyledContainer>
                <StyledTop>
                    <div className="left">
                        <div className="logo">
                            <img src={logo} />
                        </div>
                    </div>
                    <div className="right">
                        <StyledLinks>
                            <div className="icon">
                                <img src={tw} />
                            </div>
                            <div className="icon">
                                <img src={tg} />
                            </div>
                        </StyledLinks>
                    </div>
                </StyledTop>
                <StyledBody>
                      <div>
                      owner@miladyraces.bnb
                      </div>
                      <div>
                      Copyright Milady
                      </div>
                </StyledBody>

            </StyledContainer>
        </>
    );
}

export default Footer;

const StyledContainer = styled.div`
     padding: 10px;
     background-color: black;
     display: flex;
     flex-direction: column;
     color: #fff;
  `;

const StyledTop = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    .left img{
          height: 100px;
          padding-left: 50px;
    }
    ${screenUp('lg')`
         justify-content: space-between;
         flex-direction:row;
    `}
    flex-direction:column;
`;

const StyledLinks = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 50px;
`;
const StyledBody = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
`;





