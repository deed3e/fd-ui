import './leaderBoard.scss';

import * as React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import imgWallet from '../../assets/svg/img-wallet-lb.svg';
import imgWallet2 from '../../assets/svg/wallet-icon-2.svg';
import arrowBottom from '../../assets/image/arrow-bottom.png';
import { useCallback, useState, useEffect } from 'react';
import { get } from 'lodash';
import { GetLeaderboards } from '../../apis/leaderboard';
import debounce from 'lodash.debounce';
import _ from 'lodash';

const LeaderBoard: React.FC = () => {
    const [tradePositionTabValue, setTradePositionTabValue] = useState(0);
    const [timeSelectLeaderBoard, setTimeSelectLeaderBoard] = useState('24 Hours');
    const [IsTradingVolumnAsc, setIsTradingVolumnAsc] = useState<boolean | null>(null);
    const [IsAvgLeverageAsc, setIsAvgLeverageAsc] = useState<boolean | null>(null);
    const [IsWinAsc, setIsWinAsc] = useState<boolean | null>(null);
    const [IsLossAsc, setIsLossAsc] = useState<boolean | null>(null);
    const [IsPNLwFeesAsc, setIsPNLwFeesAsc] = useState<boolean | null>(null);
    const [TimeRange, setTimeRange] = useState(0);

    const handleTraderPositionTab = useCallback(
        (newValue: number) => () => {
            setTradePositionTabValue(newValue);
        },
        [],
    );

    const handleTimeSelectLeaderBoard = useCallback(
        (newValue: string) => () => {
            setTimeSelectLeaderBoard(newValue);
        },
        [],
    );

    const leaderboards = useQuery({
        queryKey: ['leaderboards'],
        queryFn: () =>
            GetLeaderboards(
                IsTradingVolumnAsc,
                IsAvgLeverageAsc,
                IsWinAsc,
                IsLossAsc,
                IsPNLwFeesAsc,
                TimeRange,
            ),
    });

    const handleClickDebounce = useCallback(
        (numberOfPage: any) => {
            switch (numberOfPage) {
                case 2:
                    if (IsTradingVolumnAsc != null) {
                        setIsTradingVolumnAsc(!IsTradingVolumnAsc);
                    } else {
                        setIsTradingVolumnAsc(true);
                    }

                    setIsAvgLeverageAsc(null);
                    setIsWinAsc(null);
                    setIsLossAsc(null);
                    setIsPNLwFeesAsc(null);

                    break;
                case 3:
                    if (IsAvgLeverageAsc != null) {
                        setIsAvgLeverageAsc(!IsAvgLeverageAsc);
                    } else {
                        setIsAvgLeverageAsc(true);
                    }

                    setIsTradingVolumnAsc(null);
                    setIsWinAsc(null);
                    setIsLossAsc(null);
                    setIsPNLwFeesAsc(null);

                    break;
                case 4:
                    if (IsWinAsc != null) {
                        setIsWinAsc(!IsWinAsc);
                    } else {
                        setIsWinAsc(true);
                    }

                    setIsTradingVolumnAsc(null);
                    setIsAvgLeverageAsc(null);
                    setIsLossAsc(null);
                    setIsPNLwFeesAsc(null);

                    break;
                case 5:
                    if (IsLossAsc != null) {
                        setIsLossAsc(!IsLossAsc);
                    } else {
                        setIsLossAsc(true);
                    }

                    setIsTradingVolumnAsc(null);
                    setIsAvgLeverageAsc(null);
                    setIsWinAsc(null);
                    setIsPNLwFeesAsc(null);

                    break;
                case 6:
                    if (IsPNLwFeesAsc != null) {
                        setIsPNLwFeesAsc(!IsPNLwFeesAsc);
                    } else {
                        setIsPNLwFeesAsc(true);
                    }

                    setIsTradingVolumnAsc(null);
                    setIsAvgLeverageAsc(null);
                    setIsWinAsc(null);
                    setIsLossAsc(null);

                    break;
            }
        },
        [IsTradingVolumnAsc, IsAvgLeverageAsc, IsWinAsc, IsLossAsc, IsPNLwFeesAsc],
    );

    useEffect(() => {
        setTimeRange(
            timeSelectLeaderBoard === '24 Hours'
                ? 0
                : timeSelectLeaderBoard === '7 Days'
                ? 1
                : timeSelectLeaderBoard === '1 Month'
                ? 2
                : 0,
        );
        leaderboards.refetch();
    }, [
        IsTradingVolumnAsc,
        IsAvgLeverageAsc,
        IsWinAsc,
        IsLossAsc,
        IsPNLwFeesAsc,
        timeSelectLeaderBoard,
        TimeRange,
    ]);

    const handleClickSortASC = _.debounce(handleClickDebounce, 1000);

    return (
        <div className="leader-board-bg">
            <div className="leader-board-container">
                <div className="trader-position-tabs">
                    <div
                        className={
                            tradePositionTabValue === 0 ? 'trader-tab active' : 'trader-tab'
                        }
                        onClick={handleTraderPositionTab(0)}
                    >
                        Traders
                    </div>
                    <div
                        className={
                            tradePositionTabValue === 1 ? 'position-tab active' : 'position-tab'
                        }
                        onClick={handleTraderPositionTab(1)}
                    >
                        Positions
                    </div>
                </div>

                <div className="title-time-leader-board">
                    <p className="title-leader-board">Traders Leaderboard</p>
                    <div className="time-leader-board">
                        <div
                            className={
                                timeSelectLeaderBoard === '24 Hours'
                                    ? 'time-select-board active'
                                    : 'time-select-board'
                            }
                            onClick={handleTimeSelectLeaderBoard('24 Hours')}
                        >
                            24 Hours
                        </div>
                        <div
                            className={
                                timeSelectLeaderBoard === '7 Days'
                                    ? 'time-select-board active'
                                    : 'time-select-board'
                            }
                            onClick={handleTimeSelectLeaderBoard('7 Days')}
                        >
                            7 Days
                        </div>
                        <div
                            className={
                                timeSelectLeaderBoard === '1 Month'
                                    ? 'time-select-board active'
                                    : 'time-select-board'
                            }
                            onClick={handleTimeSelectLeaderBoard('1 Month')}
                        >
                            1 Month
                        </div>
                    </div>
                </div>

                <div className="table-leader-board-container">
                    <div className="header-table-leader-board">
                        <div className="item-header-leader-board">
                            Wallet
                            <img src={arrowBottom} alt="arrow" />
                        </div>
                        <div className="item-header-leader-board">
                            Trading Vol.
                            <img
                                onClick={() => handleClickSortASC(2)}
                                src={arrowBottom}
                                alt="arrow"
                                className={`rotate-on-click ${
                                    IsTradingVolumnAsc ? 'rotated' : ''
                                }`}
                            />
                        </div>
                        <div className="item-header-leader-board">
                            Avg. Leverage
                            <img
                                onClick={() => handleClickSortASC(3)}
                                src={arrowBottom}
                                alt="arrow"
                                className={`rotate-on-click ${
                                    IsAvgLeverageAsc ? 'rotated' : ''
                                }`}
                            />
                        </div>
                        <div className="item-header-leader-board">
                            Win
                            <img
                                onClick={() => handleClickSortASC(4)}
                                src={arrowBottom}
                                alt="arrow"
                                className={`rotate-on-click ${IsWinAsc ? 'rotated' : ''}`}
                            />
                        </div>
                        <div className="item-header-leader-board">
                            Loss
                            <img
                                onClick={() => handleClickSortASC(5)}
                                src={arrowBottom}
                                alt="arrow"
                                className={`rotate-on-click ${IsLossAsc ? 'rotated' : ''}`}
                            />
                        </div>
                        <div className="item-header-leader-board">
                            PNL w. Fees
                            <img
                                onClick={() => handleClickSortASC(6)}
                                src={arrowBottom}
                                alt="arrow"
                                className={`rotate-on-click ${IsPNLwFeesAsc ? 'rotated' : ''}`}
                            />
                        </div>
                    </div>
                    <div className="body-table-leader-board-container">
                        {leaderboards.data?.map((item: any, index: number) => (
                            <div
                                key={index}
                                className={
                                    (index + 1) % 2 === 0
                                        ? 'body-table-leader-board active'
                                        : 'body-table-leader-board'
                                }
                            >
                                <div className="item-body-leader-board wallet-body-info">
                                    <img src={imgWallet2} alt="icon" />
                                    <p className="info-table-leader-board">
                                        {item.wallet?.slice(0, 3) +
                                            '...' +
                                            item.wallet?.slice(
                                                item.wallet.length - 4,
                                                item.wallet.length,
                                            )}{' '}
                                    </p>
                                </div>
                                <div className="item-body-leader-board">
                                    <p className="info-table-leader-board">
                                        {item?.tradingVol}$
                                    </p>
                                </div>
                                <div className="item-body-leader-board">
                                    <p className="info-table-leader-board">
                                        {item?.avgLeverage}x
                                    </p>
                                </div>
                                <div className="item-body-leader-board">
                                    <p className="info-table-leader-board">{item.win}</p>
                                </div>
                                <div className="item-body-leader-board">
                                    <p className="info-table-leader-board">{item.loss}</p>
                                </div>
                                <div className="item-body-leader-board">
                                    <p className="info-table-leader-board">{item.pnLwFees}$</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderBoard;
