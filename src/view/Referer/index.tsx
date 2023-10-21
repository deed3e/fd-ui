import Button from '@mui/material/Button';
import './referer.scss';
import stepOne from '../../assets/svg/steponeimage.svg';
import stepTwo from '../../assets/svg/step2.svg';
import stepThree from '../../assets/svg/step3.svg';
import Polygon from '../../assets/svg/Polygon.svg';
import arrowLeft from '../../assets/svg/arrow-left.svg';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useState, useCallback, useEffect } from 'react';
import { useShowToast } from '../../hooks/useShowToast';
import { getAccountStatus, postReferralUser } from '../../apis/referral';

const Referer: React.FC = () => {
    const { address, isConnected } = useAccount();
    const [addressReferral, setAddressReferral] = useState<string>('');
    const [isReferralState, setIsReferralState] = useState<boolean>(false);
    const showToast = useShowToast();
    const [isSuccessReferral, setIsSuccessReferral] = useState<boolean>(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(address || '');
        showToast('Copied ' + address + ' to clipboard', 'success');
    }, [address]);

    const isReferral = useQuery({
        queryKey: ['GetAccountStatus'],
        queryFn: () => getAccountStatus(address || ''),
    });

    const handleChangeReferral = useCallback((e: any) => {
        setAddressReferral(e.target.value);
    }, []);

    useEffect(() => {
        if (isReferral.data) {
            setAddressReferral('Has been referral');
            setIsReferralState(true);
        } else {
            setAddressReferral('');
            setIsReferralState(false);
        }
    }, [isReferral.data]);

    const postReferalUser = useMutation({
        mutationKey: ['GetAccountStatus'],
        mutationFn: () => postReferralUser(address ?? '', addressReferral),
    });

    useEffect(() => {
        if (postReferalUser.data) {
            setIsSuccessReferral(true);
        } else {
            setIsSuccessReferral(false);
        }
    }, [postReferalUser.data]);

    const handlerConfirmReferral = useCallback(() => {
        if (!isReferralState) {
            postReferalUser.mutate();
        }
    }, []);

    useEffect(() => {
        if (isSuccessReferral) {
            showToast('Referral success', 'success');
            isReferral.refetch();
        }
    }, [isSuccessReferral]);

    return (
        <div className="container-referer">
            <div className="add-info-referer-container">
                <h1 className="header-title-referal">
                    Join the trading floor for extra rewards!
                </h1>

                <div className="insert-referer-box">
                    <p className="title-insert-referer">Enter referral wallet</p>
                    <input
                        type="text"
                        className="input-referer"
                        value={addressReferral}
                        onChange={handleChangeReferral}
                        disabled={isReferral?.data}
                    />
                    <div className="btn-confirm-referer">
                        <Button
                            disabled={isReferral?.data}
                            onClick={handlerConfirmReferral}
                            className="agree-btn-referer"
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </div>

            <div className="referral-wallet-container">
                <p className="referral-wallet-title">Your referral wallet :</p>
                <p className="referaal-wallet-info">
                    {address?.slice(0, 3) +
                        '...' +
                        address?.slice(address.length - 4, address.length)}{' '}
                    <Button onClick={handleCopy} className="agree-copy-referral">
                        copy
                    </Button>
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
                        <div className="box-right-square-img">
                            {/* <div className="image-arrow"> */}
                            <img src={arrowLeft} alt="" />
                            {/* </div> */}
                        </div>
                    </div>
                </div>

                <div className="guide-box-container">
                    <div className="box-square">
                        <div className="img-step">
                            <img src={stepTwo} alt="" />
                        </div>
                        <p className="step-content">Step 2</p>
                        <p className="step-content">
                            Your friend enter your <br /> wallet and trade to get <br />{' '}
                            referral point
                        </p>
                        <div className="box-right-square-img">
                            {/* <div className="image-arrow"> */}
                            <img src={arrowLeft} alt="" />
                            {/* </div> */}
                        </div>
                    </div>
                </div>

                <div className="guide-box-container">
                    <div className="box-square">
                        <div className="img-step">
                            <img src={stepThree} alt="" />
                        </div>
                        <p className="step-content">Step 3</p>
                        <p className="step-content">
                            Trade to get trade point <br /> and get reward!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Referer;
