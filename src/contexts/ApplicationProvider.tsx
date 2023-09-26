import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { config } from '../config';

type ApplicationState = {
    ws?: WebSocket;
};

export const ApplicationContext = createContext<ApplicationState>({});

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [ws, setWs] = useState<WebSocket>();

    const value = useMemo(() => {
        return {
            ws,
        };
    }, [ws]);

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
