import styled from "styled-components";
import Header from "../Share/Header";
import Footer from "../Share/Footer";
import Car1 from "../../assets/image/car1.png";
import Car2 from "../../assets/image/car2.png";
import Car3 from "../../assets/image/car3.png";
import Car4 from "../../assets/image/car4.png";
import Car5 from "../../assets/image/car5.png";
import { useState } from "react";
import { screenUp } from "../../utils/styles";
const Game: React.FC = () => {
    const [take,setTake] = useState(0);
    return (
      <>
       <Header/>
        <StyledContainer>
         <State1>
            <div>
                <img src={Car1}></img>
            </div>
            <div>
                <img src={Car2}></img>
            </div>
            <div>
                <img src={Car3}></img>
            </div>
            <div>
                <img src={Car4}></img>
            </div>
            <div>
                <img src={Car5}></img>
            </div>
         </State1>
         <State2>
           <Take take={take==1} onClick={()=>setTake(1)}> 
                <img src={Car1}></img>
            </Take>
            <Take take={take==2} onClick={()=>setTake(2)}>
                <img src={Car2}></img>
            </Take>
            <Take take={take==3} onClick={()=>setTake(3)}>
                <img src={Car3}></img>
            </Take>
            <Take take={take==4} onClick={()=>setTake(4)}>
                <img src={Car4}></img>
            </Take>
            <Take take={take==5} onClick={()=>setTake(5)}>
                <img src={Car5}></img>
            </Take>
         </State2>
         <State3>
            <div className="same">Balance:0 $MILADY</div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="90" height="94" viewBox="0 0 90 94" fill="none"><path d="M45.1002 93.5258C69.8977 93.5258 90 73.4235 90 48.626C90 23.8285 69.8977 3.72614 45.1002 3.72614C20.3027 3.72614 0.200317 23.8285 0.200317 48.626C0.200317 73.4235 20.3027 93.5258 45.1002 93.5258Z" fill="#0072AB"></path><path d="M45.1 89.7997C69.8975 89.7997 89.9999 69.6973 89.9999 44.8998C89.9999 20.1023 69.8975 0 45.1 0C20.3025 0 0.200195 20.1023 0.200195 44.8998C0.200195 69.6973 20.3025 89.7997 45.1 89.7997Z" fill="url(#paint0_linear_13_3306)"></path><path d="M45.0999 81.9748C65.5758 81.9748 82.1748 65.3758 82.1748 44.8999C82.1748 24.4239 65.5758 7.82489 45.0999 7.82489C24.6239 7.82489 8.0249 24.4239 8.0249 44.8999C8.0249 65.3758 24.6239 81.9748 45.0999 81.9748Z" fill="#215900"></path><path d="M45.0999 80.4843C64.7527 80.4843 80.6844 64.5526 80.6844 44.8998C80.6844 25.247 64.7527 9.31528 45.0999 9.31528C25.4471 9.31528 9.51538 25.247 9.51538 44.8998C9.51538 64.5526 25.4471 80.4843 45.0999 80.4843Z" fill="url(#paint1_linear_13_3306)"></path><path d="M45.4728 75.0815C29.6368 75.2678 16.0364 65.9525 10.6335 52.7248C14.1734 68.7471 28.519 80.6707 45.6591 80.4844C62.4267 80.2981 76.586 68.1882 79.9395 52.1658C74.7229 65.3936 61.1226 74.8952 45.4728 75.0815Z" fill="url(#paint2_linear_13_3306)"></path><path d="M44.9137 14.7181C29.0777 14.9044 15.6636 24.4061 10.447 37.8201C13.6142 21.7978 27.7735 9.50154 44.9137 9.50154C61.8676 9.31524 76.2132 21.2388 79.9393 37.2612C74.3501 24.0334 60.7498 14.7181 44.9137 14.7181Z" fill="url(#paint3_linear_13_3306)"></path><path opacity="0.15" d="M73.4187 41.9189C74.5365 35.2119 67.6432 27.5733 62.2403 24.965C56.6511 22.1704 49.9441 20.8663 43.6097 21.2389C36.7163 21.6115 30.3819 24.2198 25.1653 28.8774C18.4583 34.6529 15.85 42.2915 17.1542 47.6944C20.3214 59.8043 40.2561 57.196 51.4345 54.5877C65.9664 51.0479 72.3008 47.8807 73.4187 41.9189Z" fill="white"></path><path opacity="0.53" d="M37.834 14.7182C37.0888 13.7867 35.412 13.4141 34.2942 13.4141C32.6174 13.4141 30.3818 14.3456 28.8913 15.2771C26.283 16.9539 19.576 21.6115 22.9295 24.2198C24.9789 25.8966 27.4009 22.3568 32.2448 20.4937C34.1079 19.7485 37.834 19.0033 38.2066 16.5813C38.3929 15.836 38.2066 15.2771 37.834 14.7182Z" fill="white"></path><path opacity="0.53" d="M45.4725 12.2963C43.6094 11.551 39.5107 11.9236 39.8833 14.7182C40.2559 16.7676 43.982 17.1402 45.4725 16.5813C46.404 16.395 47.1492 15.4635 47.1492 14.3456C47.1492 13.4141 46.404 12.6689 45.4725 12.2963Z" fill="white"></path><path opacity="0.33" d="M70.9966 60.5496C68.3883 59.8044 67.2705 62.599 63.1717 64.8347C60.5635 66.3251 51.9934 68.1882 53.1112 72.2869C53.4838 73.5911 54.6017 74.15 55.9058 74.3363C57.0236 74.5226 57.5826 74.7089 59.073 74.3363C60.0045 74.15 60.7498 73.7774 61.6813 73.4048C63.5444 72.6595 65.2211 71.728 66.8979 70.4239C68.5746 69.1197 70.2514 67.8156 71.3692 65.9525C72.3008 64.4621 73.6049 61.2948 70.9966 60.5496Z" fill="white"></path><path d="M64.6624 39.1243L42.4919 24.2198C37.2753 20.68 30.1957 24.4061 30.1957 30.7405V64.462C30.1957 70.4238 37.4616 73.9636 42.3056 70.6101L64.6624 55.1466C70.4379 51.2342 70.4379 42.8504 64.6624 39.1243Z" fill="#215900"></path><path d="M64.1032 39.4969L42.119 24.5924C37.4613 21.4252 31.3132 24.7787 31.3132 30.3679V63.5304C31.3132 69.1196 37.4613 72.4732 42.119 69.3059L64.1032 54.4014C69.3197 50.8616 69.3197 43.0367 64.1032 39.4969Z" fill="white"></path><defs><linearGradient id="paint0_linear_13_3306" x1="45.1474" y1="89.8941" x2="45.1474" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#00A2D4"></stop><stop offset="0.3156" stop-color="#32BEE1"></stop><stop offset="1" stop-color="#AAFFFF"></stop></linearGradient><linearGradient id="paint1_linear_13_3306" x1="45.1472" y1="80.4562" x2="45.1472" y2="9.43787" gradientUnits="userSpaceOnUse"><stop stop-color="#3A8A00"></stop><stop offset="0.1583" stop-color="#339900"></stop><stop offset="0.4194" stop-color="#2AAB00"></stop><stop offset="0.6924" stop-color="#25B600"></stop><stop offset="0.9944" stop-color="#23BA00"></stop></linearGradient><linearGradient id="paint2_linear_13_3306" x1="10.6209" y1="66.7489" x2="80.0444" y2="66.1519" gradientUnits="userSpaceOnUse"><stop stop-color="#4DCC46"></stop><stop offset="0.3216" stop-color="#51C122"></stop><stop offset="0.6002" stop-color="#54BA09"></stop><stop offset="0.7701" stop-color="#55B700"></stop></linearGradient><linearGradient id="paint3_linear_13_3306" x1="10.2504" y1="23.7423" x2="79.6741" y2="23.1452" gradientUnits="userSpaceOnUse"><stop stop-color="white"></stop><stop offset="0.0567024" stop-color="#DBEDE3"></stop><stop offset="0.1333" stop-color="#B0D7C2"></stop><stop offset="0.2024" stop-color="#91C7AB"></stop><stop offset="0.2609" stop-color="#7EBD9C"></stop><stop offset="0.3017" stop-color="#77BA97"></stop><stop offset="0.3986" stop-color="#7DBD9C"></stop><stop offset="0.5284" stop-color="#8EC6A9"></stop><stop offset="0.6767" stop-color="#AAD4BE"></stop><stop offset="0.8383" stop-color="#D1E8DC"></stop><stop offset="1" stop-color="white"></stop></linearGradient></defs></svg>
              </div>
            <div className="same">Bet:$0</div>
         </State3>
        </StyledContainer>
        <Footer/>
      </>
    );
  }
  
  export default Game;

  const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background-image: url("./bg/back-intro-3.png");
     background-size: cover;
     background-position: center;

    
  `;
  const State1 = styled.div`
    ${screenUp('lg')`
      
      width: 70%;
     `}
     margin-top: 50px;
     width: 95%;
     height: 320px;
     background-color: rgba(12, 11, 11, 0.8);
     border-radius: 5px;
     box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
     img{
        width: 60px;
        transform: scalex(-1);
     }
  `;
  const State2 = styled.div`
   ${screenUp('lg')`
      
      width: 70%;
     `}
    padding-left: 10px;
    padding-right: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
     margin-top: 50px;
     width: 95%;
     align-items: center;
     height: 100px;
     background-color: rgba(12, 11, 11, 0.8);
     border-radius: 5px;
     box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
     img{
         width: 80px;
         ${screenUp('lg')`
         width: 120px;
     `}
        transform: scalex(-1);
     }
 `;
  const State3 = styled.div`
    
     padding: 40px;
     width: 60%;
     display: flex;
     align-items: center;
     justify-content: space-between;
     flex-direction: column;
     ${screenUp('lg')`
      flex-direction: row;
      
     `}
     font-family: "Seymour One";
     text-align: center;
    font-size: 20px;
    color: #f1e8e8;
    .same{
        background-color: #fff;
        padding: 6px 10px;
        border-radius: 16px;
        color: black;
        border: 3px solid #20a1b8;
    }

  `;
 
  const Take = styled.div<{take:boolean}>`
  cursor: pointer;
      img{
          transform: ${p=>p.take?"scalex(-1) scale(1.5)":""}
      }

  `;
 