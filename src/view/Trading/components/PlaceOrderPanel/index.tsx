import { memo, useState, useCallback, useMemo, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { formatUnits, getAddress, maxUint256, parseAbi, parseUnits } from 'viem';
import { useOracle } from '../../../../hooks/useOracle';
import twoIconDown from '../../../../assets/svg/two-icon-down.svg';
import { DropdownSelectOrder } from '../PlaceOrderPanel/components/DropdownSelectOrder';
import { ReactComponent as IconArrowDown } from '../../../../assets/svg/ic-arrow-down.svg';
import InputTokenWithSelect from '../../../../component/InputToken/InputTokenWithSelect';
import InputTokenWithoutSelect from './components/InputTokenWithoutSelect';
import OrderManager from '../../../../abis/OrderManager.json';
import PoolAbi from '../../../../abis/Pool.json';
import { BigintDisplay } from '../../../../component/BigIntDisplay';
import IcLoading from '../../../../assets/image/ic-loading.png';
import ERC20 from '../../../../abis/MockERC20.json';
import { useShowToast } from '../../../../hooks/useShowToast';
import {
    useAccount,
    useWaitForTransaction,
    useContractWrite,
    usePrepareContractWrite,
    useContractReads,
} from 'wagmi';
import { Leverage } from './components/Leverage';
import { getAddressOrderManager, getAddressPool, getTokenConfig } from '../../../../config';
import { liqPrice } from '../../../../utils/calculator';

enum ButtonStatus {
    notConnect,
    notInput,
    loading,
    notApprove,
    ready,
    insufficientPool,
    insufficientBalance,
    timeOutOracle,
}

enum OrderType {
    MATKET,
    LIMIT,
}

enum Side {
    LONG,
    SHORT,
}

const ContractOm = {
    address: getAddressOrderManager(),
    abi: OrderManager,
};

const PlaceOrderPanel: React.FC = () => {
    const { address, isConnected } = useAccount();
    const { market } = useParams();
    const indexToken = market?.toUpperCase() || 'BTC';
    const [collateralToken, setCollateralToken] = useState('USDC');
    const [collateralAmount, setCollateralAmount] = useState(BigInt(0));
    const [collateralValue, setCollateralValue] = useState(BigInt(0));
    const [orderType, setOrderType] = useState(OrderType.MATKET);
    const [price, setPrice] = useState('');
    const [levarage, setLaverage] = useState(2);
    const [indexAmount, setIndexAmount] = useState(BigInt(0));
    const [sizeChange, setSizeChange] = useState(BigInt(0));
    const [side, setSide] = useState(Side.LONG);
    const [refreshCollateral, setRefreshCollateral] = useState(true);
    const indexTokenConfig = getTokenConfig(indexToken);
    const collateralTokenConfig = getTokenConfig(collateralToken);
    const priceIndex = useOracle(['BTC', 'ETH', 'USDC']);
    const [insufficientBalance, setInsufficientBalance] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const showToast = useShowToast();

    const pricecOm = useMemo(() => {
        return parseUnits(price, 30 - (indexTokenConfig?.decimals || 0));
    }, [price, indexTokenConfig]);

    const prepareContractOMWrite = usePrepareContractWrite({
        ...ContractOm,
        functionName: 'placeOrder',
        value: BigInt(1e16),
        args: [
            0,
            side,
            indexTokenConfig?.address,
            collateralTokenConfig?.address,
            collateralAmount,
            sizeChange,
            pricecOm,
            orderType,
        ],
    });

    const contractOMWrite = useContractWrite(prepareContractOMWrite.config);

    const waitingTransactionPlaceOrder = useWaitForTransaction({
        hash: contractOMWrite?.data?.hash,
    });

    const handleCollateralAmountChange = useCallback((amount: BigInt) => {
        setCollateralAmount(amount as bigint);
    }, []);

    const handleCollateralTokenChange = useCallback((token: string) => {
        setCollateralToken(token);
    }, []);

    const handleInsufficientBalance = useCallback(
        (check: boolean) => {
            insufficientBalance !== check ? setInsufficientBalance(check) : ';';
        },
        [insufficientBalance],
    );

    const onChangeLeverage = useCallback((value: number) => {
        setLaverage(value);
    }, []);

    const handleSetOrderType = useCallback((_orderType: string) => {
        _orderType === 'Market Order'
            ? setOrderType(OrderType.MATKET)
            : setOrderType(OrderType.LIMIT);
    }, []);

    const handlePrice = useCallback(
        (ev: ChangeEvent<HTMLInputElement>) => {
            const value = ev.target.value;
            if (orderType === OrderType.MATKET) {
                return;
            }
            var regExp = /^0[0-9].*$/;
            const splipDot = value.split('.');
            const check =
                (parseUnits(value.replace('.', ''), 0) || +value === 0) &&
                splipDot.length <= 2 &&
                !value.includes(' ') &&
                !regExp.test(value);
            if (check) {
                setPrice(value);
            }
        },
        [orderType],
    );

    const contracInfoRead = useContractReads({
        contracts: [
            {
                address: collateralTokenConfig?.address,
                abi: ERC20,
                functionName: 'allowance',
                args: [getAddress(address || ''), getAddressOrderManager()],
            },
            {
                address: getAddressPool(),
                abi: PoolAbi,
                functionName: 'poolAssets',
                args: [collateralTokenConfig?.address || getAddress('')],
            },
        ],
    });

    const prepareContractApproveWrite = usePrepareContractWrite({
        address: collateralTokenConfig?.address,
        abi: ERC20,
        functionName: 'approve',
        args: [getAddressOrderManager(), maxUint256],
    });

    const contractApproveWrite = useContractWrite(prepareContractApproveWrite.config);

    const waitingTransactionApprove = useWaitForTransaction({
        hash: contractApproveWrite?.data?.hash,
    });

    useEffect(() => {
        if (waitingTransactionApprove?.isLoading && !loading) {
            setLoading(true);
            showToast(`Waiting approve`, '', 'warning');
        } else {
            if (waitingTransactionApprove?.isSuccess) {
                showToast(`Success approve`, '', 'success');
                setRefreshCollateral(!refreshCollateral);
                contractApproveWrite?.reset();
                contracInfoRead?.refetch();
                setLoading(false);
            } else if (waitingTransactionApprove?.isError) {
                showToast(`Can not approve`, '', 'error');
                setLoading(false);
            }
        }
    }, [
        waitingTransactionApprove?.isError,
        waitingTransactionApprove?.isLoading,
        waitingTransactionApprove?.isSuccess,
        refreshCollateral,
        loading,
    ]);

    useEffect(() => {
        if (waitingTransactionPlaceOrder?.isLoading && !loading) {
            setLoading(true);
            showToast(`Waiting place order`, '', 'warning');
        } else {
            if (waitingTransactionPlaceOrder?.isSuccess) {
                showToast(`Success place order`, '', 'success');
                contractOMWrite?.reset();
                contracInfoRead?.refetch();
                setRefreshCollateral(!refreshCollateral);
                setLoading(false);
            } else if (waitingTransactionPlaceOrder?.isError) {
                showToast(`Can not place order`, '', 'error');
                contractOMWrite?.reset();
                contracInfoRead?.refetch();
                setLoading(false);
            }
        }
    }, [
        waitingTransactionPlaceOrder?.isError,
        waitingTransactionPlaceOrder?.isLoading,
        waitingTransactionPlaceOrder?.isSuccess,
        refreshCollateral,
        loading,
    ]);

    console.log('render');

    const handleCollateralValueChange = useCallback(
        (value: number) => {
            if (loading) {
                return;
            }
            setSizeChange(
                (BigInt(levarage) * BigInt(value) * BigInt(1e22)) /
                    BigInt(10 ** (collateralTokenConfig?.decimals || 0)),
            );
            setIndexAmount(
                (BigInt(levarage) * BigInt(value) * BigInt(1e22)) /
                    (priceIndex[indexToken] as bigint) /
                    BigInt(10 ** (collateralTokenConfig?.decimals || 0)),
            );
            setCollateralValue(BigInt(value));
        },
        [
            levarage,
            priceIndex,
            indexToken,
            collateralTokenConfig,
            waitingTransactionPlaceOrder?.isLoading,
        ],
    );

    const status = useMemo(() => {
        if (!isConnected) {
            return ButtonStatus.notConnect;
        } else if (
            contracInfoRead?.isSuccess &&
            contracInfoRead?.data &&
            contracInfoRead?.data[0]?.status === 'failure'
        ) {
            if (contracInfoRead?.data[0]?.error?.message.includes('TimeOutOracle')) {
                return ButtonStatus.timeOutOracle;
            }
            return ButtonStatus.insufficientPool;
        } else if (!collateralAmount) {
            return ButtonStatus.notInput;
        } else if (insufficientBalance) {
            return ButtonStatus.insufficientBalance;
        } else if (
            waitingTransactionApprove?.isLoading ||
            waitingTransactionPlaceOrder?.isLoading
        ) {
            return ButtonStatus.loading;
        } else if (
            contracInfoRead?.data &&
            (contracInfoRead?.data[0]?.result ||
                contracInfoRead?.data[0]?.result === BigInt(0)) &&
            collateralAmount > (contracInfoRead?.data[0]?.result as bigint)
        ) {
            return ButtonStatus.notApprove;
        }
        return ButtonStatus.ready;
    }, [
        contracInfoRead?.data,
        collateralAmount,
        isConnected,
        waitingTransactionApprove?.isLoading,
        waitingTransactionPlaceOrder?.isLoading,
        insufficientBalance,
    ]);

    const handleOnClick = useCallback(() => {
        prepareContractOMWrite?.refetch();
        try {
            switch (status) {
                case ButtonStatus.notApprove:
                    contractApproveWrite?.write?.();
                    break;
                default:
                    contractOMWrite?.write?.();
            }
        } catch (err) {
            alert('Rpc maybe error!');
        }
    }, [status, contractApproveWrite, contractOMWrite]);

    const disableButton = useMemo(() => {
        if (status !== ButtonStatus.ready && status !== ButtonStatus.notApprove) {
            return true;
        }
        return false;
    }, [status]);

    const buttonText = useMemo(() => {
        switch (status) {
            case ButtonStatus.notConnect:
                return 'Connect Wallet';
            case ButtonStatus.notInput:
                return 'Enter An Amount';
            case ButtonStatus.timeOutOracle:
                return 'Oracle TimeOut';
            case ButtonStatus.insufficientBalance:
                return 'Insufficient Your Balance';
            case ButtonStatus.insufficientPool:
                return 'Insufficient Pool';
            case ButtonStatus.loading:
                return ``;
            case ButtonStatus.notApprove:
                return 'Approve';
            default:
                return 'Place Order';
        }
    }, [status]);

    const assetPoolInfo = useMemo(() => {
        const data: any = contracInfoRead?.data?.[1]?.result;
        if (data?.length) {
            return {
                borrowIndex: data[1],
                poolAmount: data[4],
            };
        }
        return {
            borrowIndex: BigInt(0),
            poolAmount: BigInt(0),
        };
    }, [contracInfoRead]);

    const liquidityPrice = useMemo(() => {
        try {
            const _entryPrice = orderType
                ? BigInt(price) * BigInt(1e8)
                : BigInt(priceIndex[indexToken] as bigint);
            return liqPrice(
                _entryPrice as bigint,
                side === Side.LONG,
                (collateralValue * BigInt(1e22)) /
                    BigInt(10 ** (collateralTokenConfig?.decimals || 0)),
                sizeChange,
            );
        } catch (error) {
            return BigInt(0);
        }
    }, [price, orderType, priceIndex, indexToken, side, collateralValue, sizeChange]);

    return (
        <StyledContainer>
            <StyledTab>
                <StyledTabChild
                    active={side !== Side.LONG}
                    onClick={() => {
                        side !== Side.LONG ? setSide(Side.LONG) : '';
                    }}
                >
                    LONG
                </StyledTabChild>
                <StyledTabChild
                    active={side !== Side.SHORT}
                    onClick={() => {
                        side !== Side.SHORT ? setSide(Side.SHORT) : '';
                    }}
                >
                    SHORT
                </StyledTabChild>
            </StyledTab>
            <StyledBody>
                <StyledWrapOrderType>
                    <StyledOrderType>
                        <StyledTextTitle>Order Type</StyledTextTitle>
                        <div>
                            <StyledSelectToken>
                                <DropdownSelectOrder
                                    selectedOrder={!orderType ? 'Market Order' : 'Limit Order'}
                                    orders={['Market Order', 'Limit Order']}
                                    position={'right'}
                                    onSelect={handleSetOrderType}
                                >
                                    <StyledTokenSelect
                                        pointer={['Market Order', 'Limit Order']?.length >= 0}
                                    >
                                        <span>
                                            {!orderType ? 'Market Order' : 'Limit Order'}
                                        </span>
                                        <IconArrowDown />
                                    </StyledTokenSelect>
                                </DropdownSelectOrder>
                            </StyledSelectToken>
                        </div>
                    </StyledOrderType>
                    <StyledOrderType>
                        <StyledTextTitle>Price</StyledTextTitle>
                        <StyledInputOrderType
                            disable={!orderType}
                            onChange={handlePrice}
                            value={!orderType ? 'Market price' : price}
                        ></StyledInputOrderType>
                    </StyledOrderType>
                </StyledWrapOrderType>

                <InputTokenWithSelect
                    title="Pay"
                    tokens={['BTC', 'ETH', 'USDC']}
                    amountChange={handleCollateralAmountChange}
                    tokenChange={handleCollateralTokenChange}
                    refresh={refreshCollateral}
                    valueChange={handleCollateralValueChange}
                    disable={status === ButtonStatus.loading}
                    disableSelect={status === ButtonStatus.loading}
                    insufficientBalanceChange={handleInsufficientBalance}
                    pickToken={'USDC'}
                />

                <StyledWrapIconDown>
                    <img src={twoIconDown} />
                </StyledWrapIconDown>

                <InputTokenWithoutSelect
                    title="Position Size"
                    tokens={['BTC', 'ETH']}
                    disable={true}
                    pickToken={indexToken}
                    value={formatUnits(indexAmount as bigint, 22)}
                />

                <StyledLeverageContainer>
                    <Leverage value={levarage} onChange={onChangeLeverage} />
                </StyledLeverageContainer>

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
                <StyledOrderInfo>
                    <StyledRowInfo>
                        <StyledLeftItem>Collateral Asset</StyledLeftItem>
                        <StyledRightItem>{collateralToken}</StyledRightItem>
                    </StyledRowInfo>
                    <StyledRowInfo>
                        <StyledLeftItem>Collateral Value</StyledLeftItem>
                        <StyledRightItem>
                            <BigintDisplay
                                value={collateralValue}
                                decimals={8 + (collateralTokenConfig?.decimals || 0)}
                                fractionDigits={2}
                                currency="usd"
                            ></BigintDisplay>
                        </StyledRightItem>
                    </StyledRowInfo>
                    <StyledRowInfo>
                        <StyledLeftItem>Laverage</StyledLeftItem>
                        <StyledRightItem>{levarage}</StyledRightItem>
                    </StyledRowInfo>
                    <StyledRowInfo>
                        <StyledLeftItem>Entry Price</StyledLeftItem>
                        <StyledRightItem>
                            <BigintDisplay
                                value={orderType ? BigInt(price) : priceIndex[indexToken]}
                                decimals={orderType ? 0 : 8}
                                fractionDigits={2}
                                currency="usd"
                            ></BigintDisplay>
                        </StyledRightItem>
                    </StyledRowInfo>
                    <StyledRowInfo>
                        <StyledLeftItem>Liq. Price</StyledLeftItem>
                        <StyledRightItem>
                            <BigintDisplay
                                value={liquidityPrice}
                                decimals={8}
                                fractionDigits={2}
                                currency="usd"
                            ></BigintDisplay>
                        </StyledRightItem>
                    </StyledRowInfo>
                </StyledOrderInfo>
                <StyledOrderInfo>
                    <StyledTextRowInfo>Market Info</StyledTextRowInfo>
                    <StyledRowInfo>
                        <StyledLeftItem>Borrow Fee</StyledLeftItem>
                        <StyledRightItem>
                            <BigintDisplay
                                value={assetPoolInfo?.['borrowIndex'] ?? BigInt(0)}
                                decimals={12}
                                fractionDigits={3}
                                percentage
                            ></BigintDisplay>
                        </StyledRightItem>
                    </StyledRowInfo>
                    <StyledRowInfo>
                        <StyledLeftItem>Available Liquidity</StyledLeftItem>
                        <StyledRightItem>
                            <BigintDisplay
                                value={assetPoolInfo?.['poolAmount'] ?? BigInt(0)}
                                decimals={collateralTokenConfig?.decimals || 0}
                                fractionDigits={collateralTokenConfig?.fractionDigits}
                                currency="usd"
                            ></BigintDisplay>
                        </StyledRightItem>
                    </StyledRowInfo>
                </StyledOrderInfo>
                {/* <p>{side}</p>
                <p>{orderType}</p>
                <p>{indexToken}</p>
                <p>{collateralToken}</p>
                <p>{collateralAmount.toString()}</p>
                <p>{sizeChange.toString()}</p>
                <p>{pricecOm.toString()}</p>
                <p>{levarage}</p> */}
            </StyledBody>
        </StyledContainer>
    );
};

export default memo(PlaceOrderPanel);

const StyledContainer = styled.div`
    height: 100%;
`;

const StyledTextRowInfo = styled.div`
    margin-bottom: 2px;
    margin-left: -8px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
`;

const StyledOrderInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 32px;
    gap: 12px;
    margin-bottom: 10px;
`;
const StyledRowInfo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const StyledLeftItem = styled.div`
    font-size: 13px;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.8);
`;
const StyledRightItem = styled.div`
    font-size: 14px;
    font-weight: 500;
`;

const StyledLeverageContainer = styled.div`
    padding-top: 15px;
`;

const StyledWrapIconDown = styled.div`
    padding: 10px;
    display: flex;
    justify-content: center;
`;
const StyledInputOrderType = styled.input<{ disable?: boolean }>`
    margin-top: 8px;
    max-width: 160px;
    padding: 10px 10px 10px 12px;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    background: ${(p) => (p.disable ? '#172132' : 'black')};
    color: ${(p) => (!p.disable ? '#fff' : '#fff6')};
    border: none;
`;
const StyledTextTitle = styled.div`
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
`;
const StyledBody = styled.div`
    padding: 22px 18px 0 22px;
`;

const StyledWrapOrderType = styled.div`
    display: flex;
    margin-bottom: 18px;
`;

const StyledOrderType = styled.div`
    width: 50%;
`;

const StyledTab = styled.div`
    height: 42px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
`;

const StyledTabChild = styled.div<{ active?: boolean }>`
    background: ${(p) => (p.active ? '#0F091E' : '')};
    height: 100%;
    width: 100%;
    color: ${(p) => (p.active ? '#' : '#6763E3')};
    display: flex;
    justify-content: center;
    align-items: center;
    :hover {
        color: #4a46bb;
    }
`;

const StyledWrapButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 22px;
    margin-bottom: 5px;
`;

const StyledSelectToken = styled.div`
    justify-self: self-end;
    display: flex;
    align-self: center;
    align-items: center;
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
    padding: 6px 0px;
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

const StyledTokenSelect = styled(StyledToken)<{ pointer?: boolean }>`
    cursor: ${({ pointer }) => (pointer ? 'pointer' : 'auto')};
    :hover {
        border: 1px solid #515050;
    }
    padding: 10px 10px 10px 6px;
    border-radius: 10px;
    min-width: 160px;
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
`;

const StyleButton = styled.button`
    width: 100%;
    color: #fff;
    border-radius: 10px;
    background: #6763e3;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    :hover {
        background: #5552a9;
    }
    :disabled {
        background: #2a2a38;
    }
    div {
        font-weight: 700;
        font-size: 16px;
    }
    img {
        height: 15px;
        animation: loading 1.5s linear infinite;
    }
`;
