import styled from 'styled-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MockERC20 from '../../abis/MockERC20.json';
import { DropdownSelectToken } from './components/DropdownSelectToken';
import { ReactComponent as IconArrowDown } from '../../assets/svg/ic-arrow-down.svg';
import {
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
    useBalance,
    useAccount,
} from 'wagmi';
import { getAddress, parseUnits } from 'viem';
import { useShowToast } from '../../hooks/useShowToast';
import { ReactComponent as IconAddToken } from '../../assets/svg/ic-add-token.svg';
import { TokenSymbol } from '../../component/TokenSymbol';
import { getPoolAssetSymbol, getWrapNativeTokenSymbol, getTokenConfig,getSymbolByAddress } from '../../config';
import { useAddTokenMetamask } from '../../hooks/useAddTokenMetamask';
import IcLoading from '../../assets/image/ic-loading.png';
import { BigintDisplay } from '../../component/BigIntDisplay';

enum ButtonStatus {
    notConnect,
    notInput,
    loading,
    ready,
}

const AmountFaucet: Record<string, number> = {
    BTC: 0.1,
    ETH: 1,
    USDC: 1000,
};

const Faucet: React.FC = () => {
    const { address, isConnected } = useAccount();
    const showToast = useShowToast();
    const [selectToken, setSelectToken] = useState('BTC');
    const configSelectToken = getTokenConfig(selectToken);
    const [amount, setAmount] = useState<string>(
        AmountFaucet[configSelectToken?.symbol ?? ''].toString() ?? '',
    );

    const addToken = useAddTokenMetamask();

    const tokens = useMemo(() => {
        return getPoolAssetSymbol()?.filter((i) => i !== getWrapNativeTokenSymbol());
    }, []);


    const balance = useBalance({
        address: address,
        token: configSelectToken?.address,
    });

    const prepareContractWrite = usePrepareContractWrite({
        address: configSelectToken?.address,
        abi: MockERC20,
        functionName: 'mint',
        args: [parseUnits(amount, configSelectToken?.decimals ?? 0)],
    });

    const { data, write, reset } = useContractWrite(prepareContractWrite?.config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    });

    useEffect(() => {
        setAmount(AmountFaucet[configSelectToken?.symbol ?? ''].toString() ?? '');
    }, [configSelectToken]);

    useEffect(() => {
        if (isSuccess) {
            balance.refetch();
        }
    }, [balance, isSuccess]);

    useEffect(() => {
        if (isLoading) {
            showToast(
                `Waiting request for ${amount} ${configSelectToken?.symbol}`,
                '',
                'warning',
            );
        }
    }, [amount, configSelectToken?.symbol, isLoading, showToast]);

    useEffect(() => {
        if (isSuccess) {
            showToast(`Success faucet ${amount} ${configSelectToken?.symbol}`, '', 'success');
        }
        reset();
    }, [amount, configSelectToken?.symbol, isSuccess, reset, showToast]);

    const onDropDownItemClick = useCallback((symbol: string) => {
        setSelectToken(symbol);
    }, []);

    const handleAddToken = useCallback(() => {

        if (typeof window.ethereum !== 'undefined') {
            addToken(configSelectToken?.symbol ?? '');
        } else {
            alert('MetaMask is not installed. Please consider installing it!');
        }

    }, [addToken, configSelectToken?.symbol]);

    const status = useMemo(() => {
        if (!address) {
            return ButtonStatus.notConnect;
        } else if (isLoading) {
            return ButtonStatus.loading;
        } else if (!amount) {
            return ButtonStatus.notInput;
        }
        return ButtonStatus.ready;
    }, [address, amount, isLoading]);

    const buttonText = useMemo(() => {
        switch (status) {
            case ButtonStatus.notConnect:
                return `Connect wallet`;
            case ButtonStatus.notInput:
                return `Enter an amount`;
            case ButtonStatus.loading:
                return ``;
            default:
                return `Request`;
        }
    }, [status]);

    return (
        <>
            <StyledContainer>
                <StyledTextTitle>FAUCET</StyledTextTitle>
                <StyledWrapBox>
                    <StyledBox>
                        <StyledWrapIconAddToken>
                            <StyledBtnAddToWallet>
                                <IconAddToken onClick={handleAddToken} />
                            </StyledBtnAddToWallet>
                        </StyledWrapIconAddToken>
                        <div>
                            <StyledHeaderBtn>
                                <StyledAmount>Amount</StyledAmount>
                                <StyledBalance>
                                    Balance:{' '}
                                    <BigintDisplay
                                        value={balance.data?.value as BigInt}
                                        decimals={configSelectToken?.decimals ?? 1}
                                        threshold={configSelectToken?.threshold}
                                        fractionDigits={configSelectToken?.fractionDigits}
                                    />{' '}
                                    {configSelectToken?.symbol}
                                </StyledBalance>
                            </StyledHeaderBtn>
                            <StyledBodyBtn>
                                <StyledContainerInput>
                                    <StyledWrapInputAndSubValue>
                                        <StyledInput
                                            placeholder={amount ? '0' : '0.0'}
                                            value={amount}
                                            disabled
                                        ></StyledInput>
                                    </StyledWrapInputAndSubValue>
                                    <StyledSelectToken>
                                        <DropdownSelectToken
                                            selectedToken={selectToken}
                                            tokens={tokens}
                                            position={'right'}
                                            onSelect={onDropDownItemClick}
                                        >
                                            <StyledTokenSelect pointer={tokens?.length >= 0}>
                                                <TokenSymbol symbol={selectToken} size={24} />
                                                <span>{selectToken}</span>
                                                <IconArrowDown />
                                            </StyledTokenSelect>
                                        </DropdownSelectToken>
                                    </StyledSelectToken>
                                </StyledContainerInput>
                            </StyledBodyBtn>
                        </div>
                        <StyledWrapButton>
                            <StyleButton
                                onClick={() => write?.()}
                                disabled={!amount || isLoading || !isConnected}
                            >
                                <div>{buttonText}</div>
                                <img
                                    hidden={status !== ButtonStatus.loading}
                                    src={IcLoading}
                                    alt=""
                                ></img>
                            </StyleButton>
                        </StyledWrapButton>
                    </StyledBox>
                </StyledWrapBox>
            </StyledContainer>
        </>
    );
};

export default Faucet;

const StyledInput = styled.input`
    flex: 1;
    width: 100%;
    border: none;
    color: #c9c9c9;
    padding: 0;
    font-weight: bold;
    font-size: 16px;
    background: transparent;
    ::placeholder {
        color: #fff6;
    }
`;
const StyledSubValue = styled.div<{ show: boolean }>`
    height: ${({ show }) => (show ? 'auto' : '0px')};
    opacity: ${({ show }) => (show ? 1 : 0)};
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    transition: all 0.2s linear;
    word-break: break-word;
`;

const StyledMaxValue = styled.div`
    position: absolute;
    justify-self: end;
    right: 22%;
    align-self: center;
    color: #6763e3;
    cursor: pointer;
    :hover {
        color: #9b99c3;
    }
`;

const StyledSelectToken = styled.div`
    justify-self: self-end;
    align-self: center;
    display: flex;
    align-items: center;
`;

const StyledWrapInputAndSubValue = styled.div`
    width: -webkit-fill-available;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: self-start;
    overflow: hidden;
`;

const StyledAmount = styled.div``;

const StyledBalance = styled.div`
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    font-weight: 300;
`;

const StyledContainerInput = styled.div`
    position: relative;
    background-color: #172132;
    border-radius: 10px;
    height: 49px;
    display: flex;
    justify-content: space-between;
    padding: 8px 10px 6px 10px;
    gap: 5px;
`;

const StyledBodyBtn = styled.div`
    margin-top: 4.4px;
    margin-bottom: 5px;
`;

const StyledHeaderBtn = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const StyledWrapIconAddToken = styled.div`
    display: flex;
    justify-content: end;
    align-items: center;
`;

const StyledBtnAddToWallet = styled.div`
    cursor: pointer;
    :hover {
        svg {
            rect {
                stroke: #6763e3;
            }
        }
    }
`;

const StyledTextTitle = styled.div`
    margin-top: 40px;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
`;

const StyledContainer = styled.div`
    width: 100%;
    font-weight: 500;
    padding-top: 56px;
`;

const StyledBox = styled.div`
    margin-top: 20px;
    background: rgba(54, 54, 54, 0.5);
    padding: 20px 73px 10px 57px;
    width: 600px;
`;

const StyledWrapBox = styled.div`
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
    color: #fff;
    width: 257px;
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

const StyledTokenSelect = styled(StyledToken) <{ pointer?: boolean }>`
    cursor: ${({ pointer }) => (pointer ? 'pointer' : 'auto')};
    :hover {
        border: 1px solid #515050;
    }
`;
