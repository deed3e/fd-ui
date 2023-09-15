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

import btcIcon2 from '../../assets/image/btc-icon-2.svg';
import etcIcon from '../../assets/image/eth-icon.svg';
import refreshIcon from '../../assets/image/Refresh_2_light.png';
import iconSwap from '../../assets/image/Transger_light.png';
import { useContractRead } from 'wagmi';
import { formatUnits, getAddress, parseUnits } from 'viem';

const options1 = ['24H', '1W', '1M', '1Y'];

export default function Swap() {
    const [timeSelect, setTimeSelect] = useState(options1[0]);
    const [inputFromAmount, setInputFromAmount] = useState<BigInt>(BigInt(0));
    const [tokenFrom, setTokenFrom] = useState<string>('BTC');
    const [tokenTo, setTokenTo] = useState<string>('BTC');

    const tokenFromConfig = getTokenConfig(tokenFrom);
    const tokenToConfig = getTokenConfig(tokenTo);

    const { data, isError } = useContractRead({
        address: getAddress(getAdreessPool()),
        abi: PoolAbi,
        functionName: 'calcSwapOutput',
        args: [tokenFromConfig?.address, tokenToConfig?.address, inputFromAmount],
    });

    console.log('aaa1', tokenFromConfig?.symbol);
    console.log('aaa2', tokenToConfig?.symbol);
    console.log('aaa3', data);
    console.log('aaa3', inputFromAmount);

    const tokens = useMemo(() => {
        return getAllTokenSymbol()?.filter((i) => i !== getWrapNativeTokenSymbol());
    }, []);

    const amountFromChange = useCallback((value: BigInt) => {
        setInputFromAmount(value);
    }, []);

    const handleTokenFromChange = useCallback((symbol: string) => {
        setTokenFrom(symbol);
    }, []);

    const handleTokenToChange = useCallback((symbol: string) => {
        setTokenTo(symbol);
    }, []);

    const outValue = useMemo(() => {
        if (data) {
            return formatUnits(data[0],tokenToConfig?.decimals);
        }else if(isError){
            return 'not enough pool'
        }
        return 0;
    }, [data, isError, tokenToConfig?.decimals]);

    const amountToChange = useCallback((value: BigInt) => {}, []);

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
            </div>
        </div>
    );
}

const StyledInput = styled.input`
    flex: 1;
    width: 100%;
    border: none;
    color: #fff;
    padding: 0;
    font-weight: bold;
    font-size: 16px;
    background: transparent;
    ::placeholder {
        color: #fff6;
    }
`;

const StyledSelectToken = styled.div`
    justify-self: self-end;
    align-self: center;
    display: flex;
    align-items: center;
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

const StyledContainerDiv = styled.div`
    margin-bottom: 20px;
`;

const StyledSubValue = styled.div`
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
`;

const StyledHeaderBtn = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const StyledAmount = styled.div``;

const StyledBalance = styled.div`
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    font-weight: 300;
`;
const StyledContainerInput = styled.div`
    position: relative;
    background-color: black;
    border-radius: 10px;
    height: 49px;
    display: flex;
    justify-content: space-between;
    padding: 8px 10px 6px 10px;
`;

const StyledBodyBtn = styled.div`
    margin-top: 4.4px;
    margin-bottom: 5px;
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

const StyledTokenSelect = styled(StyledToken)<{ pointer?: boolean }>`
    cursor: ${({ pointer }) => (pointer ? 'pointer' : 'auto')};
    :hover {
        border: 1px solid #515050;
    }
`;
