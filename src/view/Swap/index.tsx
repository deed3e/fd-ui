import './swap.scss';
import styled from 'styled-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import InputTokenWithSelect from '../../component/InputToken/InputTokenWithSelect';
import {
    getPoolAssetSymbol,
    getWrapNativeTokenSymbol,
    getAddressRouter,
    getAddressPool,
    getTokenConfig,
    getSymbolByAddress,
} from '../../config';
import PoolAbi from '../../abis/Pool.json';
import RouterAbi from '../../abis/Router.json';
import { useShowToast } from '../../hooks/useShowToast';
import {
    useAccount,
    useBalance,
    useContractReads,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from 'wagmi';
import { formatUnits, getAddress, maxUint256, parseUnits } from 'viem';
import IcLoading from '../../assets/image/ic-loading.png';
import MockErc20 from '../../abis/MockERC20.json';
import { BigintDisplay } from '../../component/BigIntDisplay';
import { useOracle } from '../../hooks/useOracle';
import { store } from '../../utils/store';
import {
    IHistoryTransaction,
    StatusHistoryTransaction,
} from '../../component/TransactionHistory';
import { ReactComponent as IcSwap } from '../../assets/icons/ic-swap.svg';
import { getSwapsByCondition } from "../../apis/swap";
import {
    SwapType
  } from "../../types";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../../component/Table/table";
import { useQuery } from "@tanstack/react-query";
import { number } from 'zod';
import { splitDate } from "../../utils/times";
import { TokenSymbol } from '../../component/TokenSymbol';

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

const contractPool = {
    address: getAddressPool(),
    abi: PoolAbi,
};

const contractRouter = {
    address: getAddressRouter(),
    abi: RouterAbi,
};

const MIN_VALUE_INPUT = 10; // 10u

export default function Swap() {
    const { address, isConnected } = useAccount();
    
    const swapQuery = useQuery({
        queryKey: ["getSwapsByCondition", address, '1'],
        queryFn: () => getSwapsByCondition(address, '1'),
    });
    const [inputFromAmount, setInputFromAmount] = useState<BigInt>(BigInt(0));
    const [tokenFrom, setTokenFrom] = useState<string>('BTC');
    const [tokenTo, setTokenTo] = useState<string>('BTC');
    const [pickTokenFrom, setPickTokenFrom] = useState<string>('BTC');
    const [pickTokenTo, setPickTokenTo] = useState<string>('USDC');
    const [valueInput, setValueInput] = useState<number>(0);
    const [refresh, setRefesh] = useState<boolean>();
    const [insufficientBalance, setInsufficientBalance] = useState<boolean>(true);
    const showToast = useShowToast();
    const tokenFromConfig = getTokenConfig(tokenFrom);
    const tokenToConfig = getTokenConfig(tokenTo);
    const getPrice = useOracle([tokenFromConfig?.symbol ?? '', tokenToConfig?.symbol ?? '']);


    const tokens = useMemo(() => {
        return getPoolAssetSymbol()?.filter((i) => i !== getWrapNativeTokenSymbol());
    }, []);

    const contractMockErc20 = useMemo(() => {
        return {
            address: tokenFromConfig?.address,
            abi: MockErc20,
        };
    }, [tokenFromConfig?.address]);

    const balancePool = useBalance({
        address: getAddressPool(),
        token: tokenToConfig?.address,
    });

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
                args: [address, getAddressRouter()],
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
                if (contracInfoRead?.data[0]?.result[0]) {
                    return formatUnits(
                        contracInfoRead?.data[0]?.result[0],
                        tokenToConfig?.decimals ?? 0,
                    );
                }
            }
        }
        return undefined;
    }, [contracInfoRead?.data, contracInfoRead?.isSuccess, tokenToConfig?.decimals]);

    const amountToChange = useCallback((value: BigInt) => { }, []);

    const handleInsufficientBalance = useCallback((check: boolean) => {
        setInsufficientBalance(check);
    }, []);

    const prepareContractWrite = usePrepareContractWrite({
        ...contractRouter,
        functionName: 'swap',
        args: [tokenFromConfig?.address, tokenToConfig?.address, inputFromAmount, 0],
    });

    const prepareContractApproveWrite = usePrepareContractWrite({
        ...contractMockErc20,
        functionName: 'approve',
        args: [getAddressRouter(), maxUint256],
    });

    const contractApproveWrite = useContractWrite(prepareContractApproveWrite.config);

    const contractRouterWrite = useContractWrite(prepareContractWrite.config);

    const waitingTransaction = useWaitForTransaction({
        hash: contractRouterWrite?.data?.hash,
    });

    const waitingTransactionApprove = useWaitForTransaction({
        hash: contractApproveWrite?.data?.hash,
    });

    useEffect(() => {
        const handleStore = () => {
            const localStore: IHistoryTransaction[] | undefined = store.get(address ?? 'guest');
            const current = {
                hash: contractRouterWrite?.data?.hash,
                title: `Swap ${formatUnits(
                    inputFromAmount as bigint,
                    tokenFromConfig?.decimals ?? 0,
                )} ${tokenFromConfig?.symbol} to ${tokenToConfig?.symbol}`,
                status: waitingTransaction?.isSuccess
                    ? StatusHistoryTransaction.success
                    : StatusHistoryTransaction.false,
            };
            const newLocalStore = localStore ? [...localStore, current] : [current];
            store.set(address ?? 'guest', newLocalStore);
            contractRouterWrite?.reset();
            contracInfoRead?.refetch();
        };

        if (waitingTransaction?.isLoading) {
            showToast(
                `Waiting Swap from ${formatUnits(
                    inputFromAmount as bigint,
                    tokenFromConfig?.decimals ?? 0,
                )} ${tokenFromConfig?.symbol}`,
                '',
                'warning',
            );
        } else {
            if (waitingTransaction?.isSuccess) {
                showToast(`Success Swap`, '', 'success');
                handleStore();
                setRefesh(!refresh);
            } else if (waitingTransaction?.isError) {
                showToast(`Can not Swap`, '', 'error');
                handleStore();
            }
        }
    }, [
        contracInfoRead,
        contractRouterWrite,
        inputFromAmount,
        refresh,
        showToast,
        tokenFromConfig?.decimals,
        tokenFromConfig?.symbol,
        waitingTransaction?.isError,
        waitingTransaction?.isLoading,
        waitingTransaction?.isSuccess,
    ]);

    useEffect(() => {
        const handleStore = () => {
            const localStore: IHistoryTransaction[] | undefined = store.get(address ?? 'guest');
            const current = {
                hash: contractApproveWrite?.data?.hash,
                title: `Approve ${formatUnits(
                    inputFromAmount as bigint,
                    tokenFromConfig?.decimals ?? 0,
                )} ${tokenFromConfig?.symbol} `,
                status: waitingTransactionApprove?.isSuccess
                    ? StatusHistoryTransaction.success
                    : StatusHistoryTransaction.false,
            };
            const newLocalStore = localStore ? [...localStore, current] : [current];
            store.set(address ?? 'guest', newLocalStore);
            contractApproveWrite?.reset();
        };

        if (waitingTransactionApprove?.isLoading) {
            showToast(`Waiting Approve from token ${tokenFromConfig?.symbol}`, '', 'warning');
        } else {
            if (waitingTransactionApprove?.isSuccess) {
                showToast(`Success Approve`, '', 'success');
                contracInfoRead?.refetch();
                handleStore();
                setRefesh(!refresh);
            } else if (waitingTransactionApprove?.isError) {
                showToast(`Can not Approve`, '', 'error');
                handleStore();
            }
        }
    }, [
        contracInfoRead,
        contractApproveWrite,
        showToast,
        refresh,
        tokenFromConfig?.symbol,
        waitingTransactionApprove?.isError,
        waitingTransactionApprove?.isLoading,
        waitingTransactionApprove?.isSuccess,
    ]);

    const handleValueInput = useCallback(
        (value: bigint) => {
            setValueInput(
                Number.parseFloat(formatUnits(value, tokenFromConfig?.decimals ?? 0 + 8)),
            );
        },
        [tokenFromConfig?.decimals],
    );

    const status = useMemo(() => {
        if (!isConnected) {
            return ButtonStatus.notConnect;
        } else if (tokenFrom === tokenTo) {
            return ButtonStatus.sameToken;
        } else if (
            contracInfoRead?.isSuccess &&
            contracInfoRead?.data &&
            contracInfoRead?.data[0]?.status === 'failure'
        ) {
            if (contracInfoRead?.data[0]?.error?.message.includes('TimeOutOracle')) {
                return ButtonStatus.timeOutOracle;
            }

            return ButtonStatus.insufficientPool;
        } else if (!inputFromAmount) {
            return ButtonStatus.notInput;
        } else if (insufficientBalance) {
            return ButtonStatus.insufficientBalance;
        } else if (valueInput < MIN_VALUE_INPUT) {
            return ButtonStatus.minInput;
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
        valueInput,
        waitingTransaction?.isLoading,
        waitingTransactionApprove?.isLoading,
        insufficientBalance,
    ]);

    const buttonText = useMemo(() => {
        switch (status) {
            case ButtonStatus.notConnect:
                return 'Connect Wallet';
            case ButtonStatus.sameToken:
                return 'Not Same Token';
            case ButtonStatus.notInput:
                return 'Enter An Amount';
            case ButtonStatus.timeOutOracle:
                return 'Oracle TimeOut';
            case ButtonStatus.insufficientBalance:
                return 'Insufficient Your Balance';
            case ButtonStatus.minInput:
                return 'Min Amount 10 USD';
            case ButtonStatus.insufficientPool:
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
        prepareContractWrite?.refetch();
        switch (status) {
            case ButtonStatus.notApprove:
                contractApproveWrite?.write?.();
                break;
            default:
                contractRouterWrite?.write?.();
        }
    }, [contractApproveWrite, contractRouterWrite, status]);

    const fee = useMemo(() => {
        if (
            contracInfoRead?.data &&
            contracInfoRead?.data[0]?.status === 'success' &&
            inputFromAmount !== BigInt(0)
        ) {
            return contracInfoRead?.data[0]?.result[1] * getPrice[tokenFromConfig?.symbol];
        }
        return BigInt(0);
    }, [contracInfoRead?.data, inputFromAmount]);

    const minAmountOut = useMemo(() => {
        if (
            (status === ButtonStatus.ready || status === ButtonStatus.notApprove) &&
            outValue &&
            BigInt(outValue * 1e30)
        ) {
            return (BigInt(outValue * 1e30) * BigInt(999)) / BigInt(1000);
        }
        return undefined;
    }, [outValue, status]);

    const priceRatio = useMemo(() => {
        if (
            tokenToConfig?.symbol &&
            tokenFromConfig?.symbol &&
            getPrice[tokenToConfig?.symbol] &&
            getPrice[tokenFromConfig?.symbol]
        ) {
            return parseUnits(
                (
                    (getPrice[tokenFromConfig?.symbol] * BigInt(1e8)) /
                    getPrice[tokenToConfig?.symbol]
                ).toString(),
                10,
            );
        }
        return undefined;
    }, [getPrice, tokenFromConfig?.symbol, tokenToConfig?.symbol]);

    const handleSwapSelectToken = useCallback(() => {
        if (tokenToConfig?.symbol === tokenFromConfig?.symbol) return;
        const tokenTmp = tokenFromConfig?.symbol ?? '';
        setPickTokenFrom(tokenToConfig?.symbol ?? '');
        setPickTokenTo(tokenTmp);
    }, [tokenFromConfig, tokenToConfig]);

    return (
        
        <div className="container">
            <div className="left-content-container">
                <div className="bottom-left-content-container">
                    <div className="header-table">
                        <div className="table-head">From</div>
                        <div className="table-head">To</div>
                        <div className="table-head">Amount</div>
                        <div className="table-head">Receive</div>
                        <div className="table-head">Time</div>
                    </div>
                        <TableBody>
                            {swapQuery.data?.map((item: SwapType) => (
                                <TableRow>
                                    <TableCell>
                                        <TokenSymbol symbol={getSymbolByAddress(getAddress(item.tokenIn)) ?? 'BTC' } size={24} />
                                    </TableCell>
                                    <TableCell>
                                        <TokenSymbol symbol={getSymbolByAddress(getAddress(item.tokenOut)) ?? 'BTC' } size={24} />
                                    </TableCell>
                                    <TableCell>
                                        <BigintDisplay
                                            value={item.amountIn} 
                                            decimals={getTokenConfig(getAddress(item.tokenIn))?.decimals ?? 0}
                                            fractionDigits={2}
                                            threshold={0.01}
                                            />
                                    </TableCell>
                                    <TableCell>
                                        <BigintDisplay
                                            value={item.amountOut} 
                                            decimals={getTokenConfig(getAddress(item.tokenOut))?.decimals ?? 0}
                                            fractionDigits={2}
                                            threshold={0.01}
                                            />
                                        </TableCell>
                                    <TableCell>
                                        {splitDate(item.time)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                </div>
            </div>
            <div className="right-content-container">
                <StyledContainerDiv>
                    <InputTokenWithSelect
                        title="From"
                        tokens={tokens}
                        amountChange={amountFromChange}
                        tokenChange={handleTokenFromChange}
                        refresh={refresh}
                        valueChange={handleValueInput}
                        disable={status === ButtonStatus.loading}
                        disableSelect={status === ButtonStatus.loading}
                        insufficientBalanceChange={handleInsufficientBalance}
                        pickToken={pickTokenFrom}
                    />
                </StyledContainerDiv>
                <StyledContainerIconSwap>
                    <StyledIconSwap onClick={handleSwapSelectToken}>
                        <IcSwap></IcSwap>
                    </StyledIconSwap>
                </StyledContainerIconSwap>
                <div className="from-container">
                    <div>
                        <InputTokenWithSelect
                            title="To"
                            disable
                            disableSelect={status === ButtonStatus.loading}
                            disableOverBalance
                            value={outValue}
                            tokens={tokens}
                            amountChange={amountToChange}
                            tokenChange={handleTokenToChange}
                            refresh={refresh}
                            pickToken={pickTokenTo}
                        />
                    </div>
                </div>
                <div className="content-detail content-detail-first">
                    <p className="title-detail">Price</p>
                    <p className="info-detail">
                        1 <span className="title-detail">{tokenFromConfig?.symbol}</span> ={' '}
                        <BigintDisplay
                            value={priceRatio}
                            decimals={18}
                            fractionDigits={tokenToConfig?.fractionDigits + 2}
                            threshold={tokenToConfig?.threshold}
                        ></BigintDisplay>{' '}
                        <span className="title-detail">{tokenToConfig?.symbol}</span>
                    </p>
                </div>

                <div className="content-detail">
                    <p className="title-detail">Available Liquidity</p>
                    <p className="info-detail">
                        <BigintDisplay
                            value={balancePool?.data?.value}
                            decimals={tokenToConfig?.decimals ?? 0}
                            fractionDigits={tokenToConfig?.fractionDigits}
                            threshold={tokenToConfig?.threshold}
                        ></BigintDisplay>{' '}
                        <span className="title-detail">{tokenToConfig?.symbol}</span>
                    </p>
                </div>

                <div className="content-detail">
                    <p className="title-detail">Slipage</p>
                    <p className="info-detail">0.1 %</p>
                </div>

                <div className="content-detail">
                    <p className="title-detail">Minimum Receive</p>
                    <p className="info-detail">
                        <BigintDisplay
                            value={minAmountOut}
                            decimals={30}
                            fractionDigits={tokenToConfig?.fractionDigits + 2}
                            threshold={tokenToConfig?.threshold}
                        ></BigintDisplay>{' '}
                        {tokenToConfig?.symbol}
                    </p>
                </div>

                <div className="content-detail">
                    <p className="title-detail">Fees</p>
                    <p className="info-detail">
                        {fee === BigInt(0) ? (
                            0
                        ) : (
                            <BigintDisplay
                                value={fee}
                                decimals={tokenFromConfig?.decimals + 8}
                                fractionDigits={2}
                                currency='USD'
                            ></BigintDisplay>
                        )}
                    </p>
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

const StyledIconSwap = styled.div`
    cursor: pointer;
    :hover {
        svg {
            path {
                stroke: #5552a9;
            }
        }
    }
`;
const StyledContainerIconSwap = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;
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
