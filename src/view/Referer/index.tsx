import Button from '@mui/material/Button';
import './referer.scss';
import stepOne from '../../assets/svg/steponeimage.svg';
import Polygon from '../../assets/svg/Polygon.svg';

const Referer: React.FC = () => {
    return (
        <div className="container-referer">
            <div className="add-info-referer-container">
                <h1 className="header-title-referal">
                    Join the trading floor for extra rewards!
                </h1>

                <div className="insert-referer-box">
                    <p className="title-insert-referer">Enter referral wallet</p>
                    <input type="text" className="input-referer" />
                    <div className="btn-confirm-referer">
                        <Button className="agree-btn-referer">Confirm</Button>
                    </div>
                </div>
            </div>

            <div className="referral-wallet-container">
                <p className="referral-wallet-title">Your referral wallet :</p>
                <p className="referaal-wallet-info">
                    0x123..456 <Button className="agree-copy-referral">copy</Button>
                </p>
            </div>

            <h1 className="guides-container">Guides:</h1>
            <div className="guides-container-body">
                <div className="guide-box-container">
                    <div className="box-square">
                        <div className="img-step">
                            <img src={stepOne} alt="" />
                        </div>
                        <p className="step-content">Step 1</p>
                        <p className="step-content">
                            Share your referral <br /> wallet to your friend
                        </p>
                        <div className="box-right-square">
                            <div className="image-arrow">
                                <img src={Polygon} alt="" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="guide-box-container">
                    <div className="box-square">
                        <div className="img-step">
                            <img src={stepOne} alt="" />
                        </div>
                        <p className="step-content">Step 1</p>
                        <p className="step-content">
                            Share your referral <br /> wallet to your friend
                        </p>
                        <div className="box-right-square">
                            <div className="image-arrow">
                                <img src={Polygon} alt="" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="guide-box-container">
                    <div className="box-square">
                        <div className="img-step">
                            <img src={stepOne} alt="" />
                        </div>
                        <p className="step-content">Step 1</p>
                        <p className="step-content">
                            Share your referral <br /> wallet to your friend
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Referer;
