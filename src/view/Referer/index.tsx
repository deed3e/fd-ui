import Button from '@mui/material/Button';
import './referer.scss';
import stepOne from '../../assets/svg/steponeimage.svg';
import stepTwo from '../../assets/svg/step2.svg';
import stepThree from '../../assets/svg/step3.svg';
import arrowLeft from '../../assets/svg/arrow-left.svg';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useShowToast } from '../../hooks/useShowToast';
import {
    GetReferralLevelInformation,
    getAccountStatus,
    getReferredUsers,
    postReferralUser,
} from '../../apis/referral';

import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { parseDatetimeToDate } from '../../utils/times';

import { formatUnits, getAddress, parseEther, parseUnits } from 'viem';

import { Link, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

enum ButtonStatus {
    notConnect,
    notInput,
    loading,
    notApprove,
    ready,
    insufficientPool,
    insufficientBalance,
    sameToken,
    minInput, // min 10 u
    timeOutOracle,
}

const Referer: React.FC = () => {
    const { address, isConnected } = useAccount();
    const [addressReferral, setAddressReferral] = useState<string>('');
    const [isReferralState, setIsReferralState] = useState<boolean>(false);
    const showToast = useShowToast();
    const [isSuccessReferral, setIsSuccessReferral] = useState<boolean>(false);
    const [isShowReferral, setIsShowReferral] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [numberOfPage, setNumberOfPage] = useState<number>(0);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(address || '');
        showToast('Copied to clipboard', '', 'success');
    }, [address]);

    const isReferral = useQuery({
        queryKey: ['GetAccountStatus'],
        queryFn: () => getAccountStatus(address || ''),
    });

    const referredUsers = useQuery({
        queryKey: ['getReferredUsers'],
        queryFn: () => getReferredUsers(address || '', page, 3),
    });

    useEffect(() => {
        if (referredUsers.data) {
            setNumberOfPage(referredUsers.data.numberOfPage);
        }
    }, [referredUsers.data]);

    const referralLevelInformation = useQuery({
        queryKey: ['GetReferralLevelInformation'],
        queryFn: () => GetReferralLevelInformation(address || ''),
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
            try {
                if (addressReferral === address) {
                    showToast('Referral failed,Can not referral with same wallet', '', 'error');
                    setIsSuccessReferral(false);
                    return;
                }
                var isValidAdress = getAddress(addressReferral);
                postReferalUser.mutate();
            } catch (error) {
                showToast('Referral failed,Invalid address', '', 'error');
                setIsSuccessReferral(false);
            }
        }
    }, [addressReferral]);

    const handlePageChange = useCallback((event: any, page: number) => {
        setPage(page);
    }, []);

    useEffect(() => {
        referredUsers.refetch();
    }, [page]);

    useEffect(() => {
        if (isSuccessReferral) {
            showToast('Referral success', '', 'success');
            isReferral.refetch();
        }
    }, [isSuccessReferral]);

    const status = useMemo(() => {
        if (!isConnected) {
            return ButtonStatus.notConnect;
        } else if (addressReferral.length === 0) {
            return ButtonStatus.notInput;
        }
        return ButtonStatus.ready;
    }, [addressReferral, isConnected]);

    const buttonText = useMemo(() => {
        switch (status) {
            case ButtonStatus.notConnect:
                return 'Connect Wallet';
            case ButtonStatus.notInput:
                return 'Enter referral wallet';
            default:
                return 'Confirm';
        }
    }, [status]);

    const disableButton = useMemo(() => {
        if (status !== ButtonStatus.ready || isReferral?.data) {
            return true;
        }
        return false;
    }, [status, isReferral?.data]);

    const handleClickShow = useCallback(() => {
        setIsShowReferral((prev) => !prev);
    }, []);

    const textShowReferral = useMemo(() => {
        if (!isShowReferral) {
            return 'Click here to show your referral infomation';
        } else {
            return 'Click here to show guide';
        }
    }, [isShowReferral]);

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
                            disabled={disableButton}
                            onClick={handlerConfirmReferral}
                            className="agree-btn-referer"
                        >
                            {buttonText}
                        </Button>
                    </div>
                </div>
            </div>
            {isConnected && (
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
            )}
            {isConnected && (
                <div className="show-info-referral">
                    <div className="click-referral" onClick={handleClickShow}>
                        {textShowReferral}
                    </div>
                </div>
            )}
            {!isShowReferral && (
                <div className="guide-container-referral">
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
            )}
            {isShowReferral && (
                <div>
                    <div className="referral-table-container">
                        <div className="table-info-referral">
                            <div className="table-info-referral-header">
                                <div className="left-header">
                                    <p className="title-head">Trading Point</p>
                                    <p className="amount">
                                        {referralLevelInformation?.data?.tradePoint ?? 0}
                                    </p>
                                </div>
                                <div className="right-header">
                                    <p className="title-head">Referral Point</p>
                                    <p className="amount">
                                        {referralLevelInformation?.data?.referralPoint ?? 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="table-info-detail-container">
                            <div className="header-table-detail">
                                <div className="title-table-info-referral">Wallet</div>
                                <div className="title-table-info-referral">Referral Point</div>
                                <div className="title-table-info-referral">Referred Date</div>
                            </div>
                            <div className="body-tb-referral">
                                {referredUsers.data?.users.map((item: any, index: number) => (
                                    <div className="body-table-detail-referral">
                                        <div className="title-table-info-referral">
                                            {item.wallet?.slice(0, 3) +
                                                '...' +
                                                item.wallet?.slice(
                                                    item.wallet.length - 4,
                                                    item.wallet.length,
                                                )}{' '}
                                        </div>
                                        <div className="title-table-info-referral">
                                            {item.referralPoint}
                                        </div>
                                        <div className="title-table-info-referral">
                                            {item.referredDate != null &&
                                                parseDatetimeToDate(item.referredDate)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="paging-referral">
                            <Pagination
                                page={page}
                                onChange={handlePageChange}
                                count={referredUsers.data?.numberOfPage ?? 0}
                                renderItem={(item) => (
                                    <PaginationItem
                                        slots={{
                                            previous: ArrowBackIcon,
                                            next: ArrowForwardIcon,
                                        }}
                                        {...item}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="your-referral-reward">
                        <div className="title-reward">Your referral reward: </div>
                        <div className="amount-reward-container">
                            <p className="amount-reward">1000$</p>
                            <Button className="claim-referral">Claim</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Referer;
