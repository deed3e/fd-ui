import './swap.scss';
import styled from 'styled-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import InputTokenWithSelect from '../../component/InputToken/InputTokenWithSelect';
import {
    getAllTokenSymbol,
    getWrapNativeTokenSymbol,
    getAdreessRouter,
    getAdreessPool,
    getTokenConfig,
} from '../../config';
import PoolAbi from '../../abis/Pool.json';
import RouterAbi from '../../abis/Router.json';

import btcIcon2 from '../../assets/image/btc-icon-2.svg';
import etcIcon from '../../assets/image/eth-icon.svg';
import refreshIcon from '../../assets/image/Refresh_2_light.png';
import iconSwap from '../../assets/image/Transger_light.png';
import { useShowToast } from '../../hooks/useShowToast';
import {
    useAccount,
    useContractRead,
    useContractReads,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from 'wagmi';
import { formatUnits, getAddress, maxUint256, parseUnits } from 'viem';
import IcLoading from '../../assets/image/ic-loading.png';
import MockErc20 from '../../abis/MockERC20.json';

const options1 = ['24H', '1W', '1M', '1Y'];

enum ButtonStatus {
    notConnect,
    notInput,
    loading,
    notApprove,
    ready,
    insufficient,
    sameToken,
}

const contractPool = {
    address: getAddress(getAdreessPool()),
    abi: PoolAbi,
};

const contractRouter = {
    address: getAddress(getAdreessRouter()),
    abi: RouterAbi,
};

export default function Swap() {
    const [timeSelect, setTimeSelect] = useState(options1[0]);
    const [inputFromAmount, setInputFromAmount] = useState<BigInt>(BigInt(0));
    const [tokenFrom, setTokenFrom] = useState<string>('');
    const [tokenTo, setTokenTo] = useState<string>('');
    const [refresh, setRefesh] = useState<boolean>();
    const showToast = useShowToast();

    const tokenFromConfig = getTokenConfig(tokenFrom);
    const tokenToConfig = getTokenConfig(tokenTo);

    const { address, isConnected } = useAccount();

    const tokens = useMemo(() => {
        return getAllTokenSymbol()?.filter((i) => i !== getWrapNativeTokenSymbol());
    }, []);

    const contractMockErc20 = useMemo(() => {
        return {
            address: tokenFromConfig?.address,
            abi: MockErc20,
        };
    }, [tokenFromConfig?.address]);

    const contracInfoRead = useContractReads({
        contracts: [
            {
                ...contractPool,
                functionName: 'calcSwapOutput',
                args: [tokenFromConfig?.address, tokenToConfig?.address, inputFromAmount],
            },
            {
                ...contractMockErc20,
                functionName: 'allowance',
                args: [address, getAdreessRouter()],
            },
        ],
    });

    const amountFromChange = useCallback((value: BigInt) => {
        if (value) {
            setInputFromAmount(value);
        } else {
            setInputFromAmount(BigInt(0));
        }
    }, []);

    const handleTokenFromChange = useCallback((symbol: string) => {
        setTokenFrom(symbol);
    }, []);

    const handleTokenToChange = useCallback((symbol: string) => {
        setTokenTo(symbol);
    }, []);

    const outValue = useMemo(() => {
        if (contracInfoRead?.isSuccess && contracInfoRead?.data) {
            if (contracInfoRead?.data[0]?.status === 'success') {
                if (contracInfoRead?.data[0]?.result) {
                    return formatUnits(
                        contracInfoRead?.data[0]?.result[0],
                        tokenToConfig?.decimals ?? 0,
                    );
                }
            } else if (contracInfoRead?.data[0]?.status === 'failure') {
                return 'Insufficient Pool';
            }
        }
        return undefined;
    }, [contracInfoRead?.data, contracInfoRead?.isSuccess, tokenToConfig?.decimals]);

    const amountToChange = useCallback((value: BigInt) => {}, []);

    const { config } = usePrepareContractWrite({
        ...contractRouter,
        functionName: 'swap',
        args: [tokenFromConfig?.address, tokenToConfig?.address, inputFromAmount, 0],
    });

    const prepareContractApproveWrite = usePrepareContractWrite({
        ...contractMockErc20,
        functionName: 'approve',
        args: [getAdreessRouter(), maxUint256],
    });

    const contractApproveWrite = useContractWrite(prepareContractApproveWrite.config);

    const contractRouterWrite = useContractWrite(config);

    const waitingTransaction = useWaitForTransaction({
        hash: contractRouterWrite?.data?.hash,
    });

    const waitingTransactionApprove = useWaitForTransaction({
        hash: contractApproveWrite?.data?.hash,
    });

    useEffect(() => {
        if (waitingTransaction?.isLoading) {
            showToast(
                `Waiting swap from ${formatUnits(
                    inputFromAmount as bigint,
                    tokenFromConfig?.decimals ?? 0,
                )} ${tokenFromConfig?.symbol}`,
                '',
                'warning',
            );
        } else if (waitingTransaction?.isSuccess) {
            showToast(`Success swap`, '', 'success');
            contractRouterWrite?.reset();
        } else if (waitingTransaction?.isError) {
            showToast(`Can not swap`, '', 'error');
        }
    }, [
        showToast,
        waitingTransaction?.isLoading,
        inputFromAmount,
        tokenFromConfig?.symbol,
        waitingTransaction?.isSuccess,
        contractRouterWrite,
        waitingTransaction?.isError,
        tokenFromConfig?.decimals,
    ]);

    useEffect(() => {
        if (waitingTransactionApprove?.isLoading) {
            showToast(`Waiting approve from token ${tokenFromConfig?.symbol}`, '', 'warning');
        } else if (waitingTransactionApprove?.isSuccess) {
            showToast(`Success approve`, '', 'success');
            contractApproveWrite?.reset();
            contracInfoRead?.refetch();
            setRefesh(!refresh);
        } else if (waitingTransactionApprove?.isError) {
            showToast(`Can not approve`, '', 'error');
        }
    }, [
        showToast,
        waitingTransaction.isLoading,
        inputFromAmount,
        tokenFromConfig?.symbol,
        waitingTransaction.isSuccess,
        contractRouterWrite,
        waitingTransaction.isError,
        waitingTransactionApprove?.isLoading,
        waitingTransactionApprove?.isSuccess,
        waitingTransactionApprove?.isError,
        contractApproveWrite,
        contracInfoRead,
        refresh,
        tokenFromConfig?.decimals,
    ]);

    const status = useMemo(() => {
        if (!isConnected) {
            return ButtonStatus.notConnect;
        } else if (tokenFrom === tokenTo) {
            return ButtonStatus.sameToken;
        } else if (outValue === 'Insufficient Pool') {
            return ButtonStatus.insufficient;
        } else if (!inputFromAmount) {
            return ButtonStatus.notInput;
        } else if (waitingTransactionApprove?.isLoading || waitingTransaction?.isLoading) {
            return ButtonStatus.loading;
        } else if (
            contracInfoRead?.data &&
            (contracInfoRead?.data[1]?.result ||
                contracInfoRead?.data[1]?.result === BigInt(0)) &&
            inputFromAmount > contracInfoRead?.data[1]?.result
        ) {
            return ButtonStatus.notApprove;
        }
        return ButtonStatus.ready;
    }, [
        contracInfoRead?.data,
        inputFromAmount,
        isConnected,
        outValue,
        tokenFrom,
        tokenTo,
        waitingTransaction?.isLoading,
        waitingTransactionApprove?.isLoading,
    ]);

    const buttonText = useMemo(() => {
        switch (status) {
            case ButtonStatus.notConnect:
                return 'Connect Wallet';
            case ButtonStatus.sameToken:
                return 'Not same token';
            case ButtonStatus.notInput:
                return 'Enter an amount';
            case ButtonStatus.insufficient:
                return 'Insufficient Pool';
            case ButtonStatus.loading:
                return ``;
            case ButtonStatus.notApprove:
                return 'Approve';
            default:
                return 'Swap';
        }
    }, [status]);

    const disableButton = useMemo(() => {
        if (status !== ButtonStatus.ready && status !== ButtonStatus.notApprove) {
            return true;
        }
        return false;
    }, [status]);

    const handleOnClick = useCallback(() => {
        switch (status) {
            case ButtonStatus.notApprove:
                contractApproveWrite?.write?.();
                break;
            case ButtonStatus.ready:
                contractRouterWrite?.write?.();
        }
    }, [contractApproveWrite, contractRouterWrite, status]);

    return (
        <div className="container">
            <div className="left-content-container">
                <div className="top-left-content-container">
                    <div className="left-swap-icon-container">
                        <div className="image-icon">
                            <img src={btcIcon2} alt="" />
                            <img src={etcIcon} alt="" />
                        </div>
                        <div className="detail-icon">
                            <p>BTC/ETH</p>
                            <img src={refreshIcon} alt="" />
                        </div>
                    </div>
                    <div className="right-time-container">
                        <div className="right-time-select">
                            {options1.map((option1) => (
                                <div
                                    onClick={(opt) => setTimeSelect(option1)}
                                    className={
                                        timeSelect === option1
                                            ? 'is-active time-select'
                                            : 'time-select'
                                    }
                                    key={option1}
                                >
                                    {option1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bottom-left-content-container">
                    <div className="header-table">
                        <div className="table-head">From</div>
                        <div className="table-head">To</div>
                        <div className="table-head">Amount</div>
                        <div className="table-head">Receive</div>
                        <div className="table-head">Time</div>
                    </div>
                </div>
            </div>
            <div className="right-content-container">
                <StyledContainerDiv>
                    <InputTokenWithSelect
                        tokens={tokens}
                        amountChange={amountFromChange}
                        tokenChange={handleTokenFromChange}
                        title="From"
                        refresh={refresh}
                    />
                </StyledContainerDiv>
                <div className="icon-swap">
                    <img src={iconSwap} alt="" />
                </div>
                <div className="from-container">
                    <div>
                        <InputTokenWithSelect
                            title="To"
                            disable
                            value={outValue}
                            tokens={tokens}
                            amountChange={amountToChange}
                            tokenChange={handleTokenToChange}
                            refresh={refresh}
                        />
                    </div>
                </div>
                <div className="content-detail content-detail-first">
                    <p className="title-detail">Price</p>
                    <p className="info-detail">
                        1 <span className="title-detail">USDT</span> = 0.0046{' '}
                        <span className="title-detail">BNB</span>
                    </p>
                </div>

                <div className="content-detail">
                    <p className="title-detail">Available Liquidity</p>
                    <p className="info-detail">
                        1,567.22 <span className="title-detail">BNB</span>
                    </p>
                </div>

                <div className="content-detail">
                    <p className="title-detail">Slipage</p>
                    <p className="info-detail">0.1%</p>
                </div>

                <div className="content-detail">
                    <p className="title-detail">Minimum Receive</p>
                    <p className="info-detail">0 ETH</p>
                </div>

                <div className="content-detail">
                    <p className="title-detail">Fees</p>
                    <p className="info-detail">-</p>
                </div>

                <StyledWrapButton>
                    <StyleButton onClick={handleOnClick} disabled={disableButton}>
                        <div>{buttonText}</div>
                        <img
                            hidden={status !== ButtonStatus.loading}
                            src={IcLoading}
                            alt=""
                        ></img>
                    </StyleButton>
                </StyledWrapButton>
            </div>
        </div>
    );
}

const StyledWrapButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 18px;
    margin-bottom: 5px;
`;
const StyleButton = styled.button`
    width: 100%;
    color: #fff;
    height: 37px;
    border-radius: 10px;
    background: #6763e3;
    display: flex;
    justify-content: center;
    align-items: center;
    :hover {
        background: #5552a9;
    }
    :disabled {
        background: #2a2a38;
    }
    div {
        font-weight: 700;
        font-size: 15px;
    }
    img {
        height: 15px;
        animation: loading 1.5s linear infinite;
    }
`;

const StyledContainerDiv = styled.div`
    margin-bottom: 20px;
`;

export const StyledToken = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: fit-content;
    padding: 2px;
    border-radius: 1000px;
    border: solid 1px #363636;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    span {
        padding-right: 6px;
        padding-left: 6px;
    }
    svg {
        width: 8px;
        margin-right: 6px;
        path {
            fill: #adabab;
        }
    }
`;
