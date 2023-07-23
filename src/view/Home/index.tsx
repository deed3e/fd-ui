import styled from "styled-components";
import Header from "../Share/Header";
import Footer from "../Share/Footer";
import Car1 from "../../assets/image/car1.png";
import Car2 from "../../assets/image/car2.png";
import Car3 from "../../assets/image/car3.png";
import COIN from "../../assets/icon/ic-cgc.svg";
import CMK from "../../assets/icon/ic-mexc.svg";
import DEX from "../../assets/icon/ic-dex.svg";
import MEXC from "../../assets/icon/ic-mexc.svg";

const Home: React.FC = () => {
    return (
      <>
       <Header/>
        <StyledContainer>
        <StyledIntro>
            <div className="left">
              <div className="title">
              Milady Races
              </div>
              <div className="content">
              The core gameplay of Milady Races revolves around exciting races between adorable and humorous milady. Each milady is represented by a unique ERC20 token with distinct colors and personalities. Players can select their favorite milady to compete in the race. The outcome is determined by a mix of random factors and individual milady characteristics, creating thrilling and dramatic races.
              </div>
              <div className="play">
                PLAY GAME
              </div>
            </div>
        </StyledIntro>
        <StyledGameFT>
           <div className="title">
              GAME FEATURE
           </div>
           <StyledWrapBlock>
            <StyledBlock1>
             <div className="image">
                <img src={Car2}></img>
              </div>
              <StyleWrapContent>
                  <div className="title">
                  Turtle Betting:
                  </div>
                  <div className="body">
                  Before the race starts, players have the option to place bets on the turtle they believe will win. They can wager their $TURTLE tokens to winning bets and earn rewards proportional to the bet amount. The "Bet" feature adds extra excitement and encourages strategic thinking among players, fostering a competitive and engaging environment.
                  </div>
              </StyleWrapContent>
            </StyledBlock1>
            <StyledBlock2>
            <div className="image">
                <img src={Car3}></img>
              </div>
              <StyleWrapContent>
                  <div className="title">
                  Turtle Race:
                  </div>
                  <div className="body2">
                  Participants will be able to choose their turtle contender from a variety of lovable and creatively designed turtles, each with its own unique attributes and characteristics. These traits may include endurance, determination, agility, and more, all of which will influence the turtle's performance during the race.
                  </div>
              </StyleWrapContent>
            </StyledBlock2>
           </StyledWrapBlock>
        </StyledGameFT>
        <StylePartner>
             <div className="title"> 
                OUR PARTNER
             </div>
             <StyleWrap>
                     <div>
                        <img src={CMK}></img>
                     </div>
                     <div>
                        <img src={COIN}></img>
                     </div>
                     <div>
                        <img src={DEX}></img>
                     </div>
                     <div>
                        <img src={MEXC}></img>
                     </div>
             </StyleWrap>
        </StylePartner>
        </StyledContainer>
        <Footer/>
      </>
    );
  }
  
  export default Home;

  const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    
  `;

  const StyledIntro = styled.div`
     background-image: url("./bg/back-intro-3.png");
     background-size: cover;
     background-position: center;
     width: 100%;
     display: flex;
     padding-bottom: 80px;
    .left{
      padding-top: 70px;
      padding-left: 15%;
      max-width: 500px;
      .title{
        font-family: "Seymour One";
        text-align: center;
        font-size: 50px;
        color: #a82424;
      }
      .content{
        padding-top: 30px;
        line-height: 1.4;
      }
      .play{
        cursor: pointer;
        padding-top: 30px;
        font-family: "Seymour One";
        text-align: center;
        font-size: 18px;
        color: #e9e3e3;
        background-color: #a82424;
        padding: 9px 0px;
        border-radius: 12px;
        width: 200px;
      }
    }
  `;

  const StyledGameFT = styled.div`
       padding-bottom: 70px;
       padding-top: 20px;
       display: flex;
       flex-direction: column;
       width: 100%;
       background-color: rgba(17, 18, 17, 0.8);
       .title{
          padding-top: 20px;
          padding-bottom: 40px;
          font-family: "Seymour One";
          text-align: center;
          font-size: 34px;
          color: #a82424;
          text-shadow: 2px 2px 2px rgba(0,0,0,0.3), 
    0px -2px 3px rgba(255,255,255,0.3);
       }
  `; 

  const StyledWrapBlock = styled.div`
       display: flex;
       justify-content: space-between;
       padding-left: 15%;
       padding-right: 15%;
       padding-bottom: 20px;
  `; 

  const StyledBlock1 = styled.div`
     width: 500px;
     height: 300px;
     background-color:  #a82424;
     clip-path: polygon(0% 0%, 80% 0%, 100% 100%, 0% 100%);
     border-radius: 5px;
     box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
     
          img{
              height: 120px;
              margin-left: 150px;
              transform: scaleX(-1);
              margin-top: -30px;
              z-index: 9999;
           }
    
  `; 
  const StyledBlock2 = styled.div`
      width: 500px;
      height: 300px;
     background-color: #a82424;
     clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 20% 100%);
     border-radius: 5px;
     box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
     img{
              height: 120px;
              margin-left: 150px;
              margin-top: -30px;
              z-index: 9999;
           }
 `; 
  const StyleWrapContent = styled.div`
       margin-top: -30px;
       .title{
        margin-left: -100px;
        font-family: "Seymour One";
        font-size: 22px;
        color: #f7f4f4;
      }
      .body{
        margin-top: -60px;
        padding-left: 20px;
        padding-top: 30px;
        line-height: 1.4;
        color: #f7f4f4;
        max-width: 380px;
      }
      .body2{
        margin-top: -60px;
        padding-left: 100px;
        padding-top: 30px;
        line-height: 1.4;
        color: #f7f4f4;
        max-width: 380px;
      }
  `; 


  const  StylePartner = styled.div`
     width: 100%;
     background-color: #160303;
      padding-top: 30px;
      display: flex;
      flex-direction: column;
      .title{
        padding-top: 20px;
          padding-bottom: 40px;
          font-family: "Seymour One";
          text-align: center;
          font-size: 34px;
          color: #a82424;
          text-shadow: 2px 2px 2px rgba(0,0,0,0.3), 
    0px -2px 3px rgba(255,255,255,0.3);
      }

  `;
  const  StyleWrap = styled.div`
      display: flex;
      flex-direction: row;
      justify-content: center;
      img{
        width: 80px;
      }
      
  `;