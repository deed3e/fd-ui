import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { config } from '../../../../config';
import { store } from '../../../../utils/store';
import { DataFeed } from './DataFeed';
import { TimeZones } from './zone';
import imgNoChart from '../../../../assets/image/img-nochart-data.png';
import { useWebSocket } from '../../../../contexts/ApplicationProvider';
import { type } from 'os';

interface Candle {
    time: number;
    high: number;
    low: number;
    open: number;
    close: number;
}

const Resolution = {
    '5': { server: '5', value: 5 * 60 * 1000 },
    '15': { server: '15', value: 15 * 60 * 1000 },
    '60': { server: '60', value: 60 * 60 * 1000 },
    '240': { server: '240', value: 4 * 60 * 60 * 1000 },
    '1D': { server: '1D', value: 24 * 60 * 60 * 1000 },
};

export const ChartContainer = memo(() => {
    const interval = useRef<keyof typeof Resolution>('15');
    const lastBar = useRef<Candle>();
    const datafeed = useRef<DataFeed>();
    const { market } = useParams();
    const token = market?.toUpperCase();
    const currentToken = useRef<string>('BTC');
    const [loading, setLoading] = useState<boolean>();
    const [noChartData, setNoChartData] = useState<boolean>(false);
    const ws = useWebSocket();
    const [responseData, setResponseData] = useState(null);

    const subscribe = useCallback(() => {
        if (!ws) return;
        console.log('subscribe');
        ws.send(
            JSON.stringify({
                type: 'subscribe',
                product_ids: ['BTC-USD'],
                channels: ['ticker'],
            }),
        );
    }, [token, ws]);

    // const unSubscribe = useCallback(() => {
    //     if (!ws) return;
    //     ws.send(
    //         JSON.stringify({
    //             method: 'UNSUBSCRIBE',
    //             data: {
    //                 market: currentToken.current,
    //             },
    //         }),
    //     );
    //     lastBar.current = undefined;
    //     currentToken.current = token;
    // }, [token, ws]);

    const getBars = useCallback(
        async (
            symbolInfo: TradingView.LibrarySymbolInfo,
            resolution: TradingView.ResolutionString,
            from: any,
            to: any,
            onResult: TradingView.HistoryCallback,
            onError: TradingView.ErrorCallback,
            firstDataRequest: boolean,
        ) => {
            if (resolution !== interval.current) {
                interval.current = resolution as keyof typeof Resolution;
            }
            const bars: TradingView.Bar[] = [];
            const res = await fetch(
                //`https://api.exchange.coinbase.com/products/${token}-USD/candles?start=${from}&end=${to}&granularity=${Resolution[interval.current].value}`,
                `https://api.level.finance/udf/history?symbol=${token}&resolution=${
                    Resolution[interval.current].server
                }&from=${from}&to=${to}&countback=2`,
            )
                .then((res) => res.json())
                .catch((err) => onError(err));
            if (!res?.t?.length) {
                onResult(bars, { noData: true });
                return;
            }
            for (let i = 0; i < res.t.length; i++) {
                bars.push({
                    time: +res.t[i] * 1000,
                    open: +res.o[i],
                    high: +res.h[i],
                    low: +res.l[i],
                    close: +res.c[i],
                });
            }
            console.log('bars after', bars);
            if (firstDataRequest) {
                lastBar.current = bars[bars.length - 1];
                subscribe();
            }
            onResult(bars, { noData: false });
        },
        [subscribe, token],
    );

    const initDatafeed = useCallback(() => {
        const supported_resolutions = Object.keys(Resolution) as never;
        datafeed.current = new DataFeed({
            SymbolInfo: {
                name: '',
                full_name: '',
                description: '',
                type: 'crypto',
                listed_exchange: '',
                session: '24x7',
                timezone:
                    (TimeZones.find((t) => t.offset === new Date().getTimezoneOffset())
                        ?.timeZone as TradingView.Timezone) || 'Etc/UTC',
                ticker: '',
                exchange: '',
                minmov: 1,
                pricescale: 1e5,
                has_intraday: true,
                has_no_volume: true,
                has_weekly_and_monthly: true,
                supported_resolutions: Object.keys(Resolution) as never,
                data_status: 'streaming',
                format: 'price',
            },
            DatafeedConfiguration: {
                supported_resolutions: supported_resolutions,
            },
            getBars: getBars,
        });
    }, [getBars]);

    const initTradingView = useCallback(() => {
        if (!datafeed.current || !window.TradingView || !token) return;
        const intervalWidgetKey = 'tradingview.IntervalWidget.quicks';
        if (!store.get(intervalWidgetKey, true)) {
            store.set(
                'tradingview.IntervalWidget.quicks',
                ['5', '15', '60', '240', '1D'],
                true,
            );
        }
        const widget = new window.TradingView.widget({
            debug: false,
            symbol: `${token}/USD`,
            interval: interval.current as never,
            datafeed: datafeed.current,
            container_id: 'chart-container',
            charts_storage_url: 'https://api.fdex.me/',
            charts_storage_api_version: '1.1',
            library_path: '/charting_library/',
            locale: 'en',
            timezone: 'exchange',
            enabled_features: [
                'custom_resolutions',
                'chart_style_hilo',
                'no_min_chart_width',
                'caption_buttons_text_if_possible',
                'end_of_period_timescale_marks',
            ],
            disabled_features: [
                'save_chart_properties_to_local_storage',
                'show_trading_notifications_history',
                'chart_crosshair_menu',
                'trading_notifications',
                'timeframes_toolbar',
                'show_logo_on_all_charts',
                'header_compare',
                'compare_symbol',
                'header_saveload',
                'header_undo_redo',
                'header_symbol_search',
                'header_widget_buttons_mode',
            ],
            client_id: 'fdex.me',
            fullscreen: false,
            autosize: true,
            theme: 'Dark',
            overrides: {
                'mainSeriesProperties.showCountdown': false,
                'paneProperties.background': '#161618',
                'paneProperties.vertGridProperties.color': '#3737375e',
                'paneProperties.horzGridProperties.color': '#3737375e',
                'paneProperties.crossHairProperties.color': '#404040',
                'symbolWatermarkProperties.transparency': 90,
                'scalesProperties.lineColor': '#3737375e',
                'scalesProperties.textColor': '#adabab',
                'mainSeriesProperties.candleStyle.wickUpColor': '#35ca65',
                'mainSeriesProperties.candleStyle.wickDownColor': '#E43E53',
                'mainSeriesProperties.candleStyle.upColor': '#35ca65',
                'mainSeriesProperties.candleStyle.downColor': '#E43E53',
                'mainSeriesProperties.candleStyle.borderUpColor': '#35ca65',
                'mainSeriesProperties.candleStyle.borderDownColor': '#E43E53',
                'overrides."painProperties.background': '#161618',
            },
            custom_css_url: '/css/tradingview_chart.css',
        });
        widget.onChartReady(() => {
            setLoading(false);
        });
    }, [interval, token]);

    useEffect(() => {
        if (!ws) return;
        ws.onmessage = (ev) => {
            if (!ev.data) return;
            const data = JSON.parse(ev.data);
            const { product_id, price } = data;
            const symbol =
                typeof product_id === 'string' ? product_id.split('-')[0] : undefined;
            if (!symbol || !price || symbol !== currentToken.current || !lastBar.current) {
                return;
            }
            const timestamp = Date.now();
            const time =
                Math.floor(timestamp / Resolution[interval.current].value) *
                Resolution[interval.current].value;
            let bar = {} as Candle;
            if (time > lastBar.current.time) {
                bar = {
                    time: time,
                    open: lastBar.current.close,
                    close: +price,
                    high: price,
                    low: price,
                };
            } else {
                bar = {
                    ...lastBar.current,
                    close: price,
                    high: price > lastBar.current.high ? price : lastBar.current.high,
                    low: price < lastBar.current.low ? price : lastBar.current.low,
                };
            }
            lastBar.current = bar;
            datafeed.current?.updateBar(bar);
        };
    }, [initDatafeed, initTradingView, interval, lastBar, token, ws]);

    useEffect(() => {
        if (!token) {
            return;
        }
        setLoading(true);
        initDatafeed();
        initTradingView();
        return () => {
            // unSubscribe();
        };
    }, [initDatafeed, initTradingView, token]);

    // useEffect(() => {
    //     if (currentToken?.current !== token) {
    //         unSubscribe();
    //     }
    // }, [
    //     token,
    //     unSubscribe
    // ]);

    // useEffect(() => {
    //     const checkApiResponse = async () => {
    //         try {
    //             const res = await fetch(`${config.apiUrl}/prices`);
    //             if (!res.ok) setNoChartData(true);
    //             else setNoChartData(false);
    //         } catch {
    //             setNoChartData(true);
    //         }
    //     };
    //     checkApiResponse();
    // }, []);

    console.log('render');
    return (
        <StyledContent>
            {/* {loading ? (
                <StyledLoading>
                    LOADING
                </StyledLoading>
            ) : noChartData ? (
                <StyledNoChartData>
                    <img src={imgNoChart} />
                    <div>No data available</div>
                </StyledNoChartData>
            ) : null} */}
            <div>{responseData}</div>
            <div
                id="chart-container"
                className="container"
                //hidden={loading || noChartData}
            ></div>
        </StyledContent>
    );
});

const StyledContent = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
`;

const StyledLoading = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
        width: 150px;
        height: 150px;
        opacity: 0.6;
    }
`;

const StyledNoChartData = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    div {
        margin-top: 7px;
        color: #979595;
        font-size: 13px;
    }
`;
