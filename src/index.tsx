import ReactDOM from 'react-dom/client';
import App from './App';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { ApplicationProvider } from './contexts/ApplicationProvider';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { chains, publicClient } = configureChains([bscTestnet], [publicProvider()]);
const config = createConfig({
    autoConnect: true,
    connectors: [new MetaMaskConnector({ chains })],
    publicClient,
});
const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <WagmiConfig config={config}>
        <ApplicationProvider>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </ApplicationProvider>
    </WagmiConfig>,
);
