import './leaderBoard.scss'

import * as React from 'react';

import { useCallback, useState } from 'react';


const LeaderBoard: React.FC = () => {
    const [tradePositionTabValue, setTradePositionTabValue] = useState(0);
    const [timeSelectLeaderBoard, setTimeSelectLeaderBoard] = useState("24 Hours");

    const handleTraderPositionTab = useCallback((newValue: number) => () => {
        setTradePositionTabValue(newValue);
    }, []);

    const handleTimeSelectLeaderBoard = useCallback((newValue: string) => () => {
        setTimeSelectLeaderBoard(newValue);
    }, []);


    return (
        <>
            <div className="leader-board-container">
                <div className="trader-position-tabs">
                    <div className={tradePositionTabValue === 0 ? 'trader-tab active' : 'trader-tab'} onClick={handleTraderPositionTab(0)}>
                        Traders
                    </div>
                    <div className={tradePositionTabValue === 1 ? 'position-tab active' : 'position-tab'} onClick={handleTraderPositionTab(1)}>
                        Positions
                    </div>
                </div>

                <div className="title-time-leader-board">
                    <p className="title-leader-board">Traders Leaderboard</p>
                    <div className="time-leader-board">
                        <div className={timeSelectLeaderBoard === '24 Hours' ? 'time-select-board active' : 'time-select-board'} onClick={handleTimeSelectLeaderBoard("24 Hours")}>24 Hours</div>
                        <div className={timeSelectLeaderBoard === '7 Days' ? 'time-select-board active' : 'time-select-board'} onClick={handleTimeSelectLeaderBoard("7 Days")}>7 Days</div>
                        <div className={timeSelectLeaderBoard === '1 Month' ? 'time-select-board active' : 'time-select-board'} onClick={handleTimeSelectLeaderBoard("1 Month")}>1 Month</div>
                    </div>
                </div>

                <div className="table-leader-board-container">
                    <div className="header-table-leader-board">
                        <div className="item-header-leader-board">Wallet</div>
                        <div className="item-header-leader-board">Trading Vol.</div>
                        <div className="item-header-leader-board">Avg. Leverage</div>
                        <div className="item-header-leader-board">Win</div>
                        <div className="item-header-leader-board">Loss</div>
                        <div className="item-header-leader-board">PNL w. Fees</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LeaderBoard;