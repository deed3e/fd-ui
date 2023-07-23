import styled from "styled-components";
import logo from '../../../assets/icon/logo-tab-3.png';
import tw from "../../../assets/icon/ic-tw.svg";
import tg from "../../../assets/icon/ic-tg.svg";

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
                      0xa611ea82cf9cd4cd0a4117139c3f61fd1e43a135
                      </div>
                      <div>
                      owner@turtleraces.top
                      </div>
                      <div>
                      Copyright TURTLERACES
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
    justify-content: space-between;
    .left img{
          height: 100px;
          padding-left: 50px;
    }
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





