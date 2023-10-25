import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { config } from '../config';
import { watchBlockNumber } from '@wagmi/core';

type ApplicationState = {
    ws?: WebSocket;
    lastBlockUpdate?: bigint;
};

export const ApplicationContext = createContext<ApplicationState>({});

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [ws, setWs] = useState<WebSocket>();
    const [lastBlockUpdate, setLastBlockUpdate] = useState(BigInt(0));

    const value = useMemo(() => {
        return {
            ws,
            lastBlockUpdate,
        };
    }, [ws, lastBlockUpdate]);

    useEffect(() => {
        watchBlockNumber(
            {
                listen: true,
            },
            (blockNumber) => {
                if ((blockNumber - lastBlockUpdate) > BigInt(100)) {
                    setLastBlockUpdate(blockNumber);
                }
            },
        );
    }, [lastBlockUpdate]);
    
    useEffect(() => {
        const connect = () => {
            const ws = new WebSocket(config.chartUrlWs);
            ws.onopen = () => {
                setWs(ws);
            };
            ws.onclose = () => {
                setTimeout(function () {
                    connect();
                }, 5000);
                setWs(undefined);
            };
            ws.onerror = () => {
                ws.close();
                setWs(undefined);
            };
        };
        connect();
    }, []);

    return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
};

// QUERY

export const useApplicationContext = () => useContext(ApplicationContext);

export const useWebSocket = () => {
    const context = useApplicationContext();

    return useMemo(() => {
        return context?.ws;
    }, [context?.ws]);
};

export const useLastBlockUpdate = () => {
    const context = useApplicationContext();

    return useMemo(() => {
        return context?.lastBlockUpdate;
    }, [context?.lastBlockUpdate]);
};
