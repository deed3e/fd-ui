import ReactDOM from 'react-dom/client';
import App from './App';
import { WagmiConfig, configureChains } from 'wagmi';
import { bscTestnet, celo, polygon, bsc } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ApplicationProvider } from './contexts/ApplicationProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
// import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const projectId = '4c8018896ed5f30125ab50f70f0a66dc';
const metadata = {
    name: 'Web3Modal',
    description: 'Web3Modal',
    url: 'https://web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
};
const { chains } = configureChains([bscTestnet, celo, polygon], [publicProvider()]);
const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
});
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    chainImages: {},
    themeVariables: {
        '--w3m-accent': '#6763e3',
    },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <WagmiConfig config={wagmiConfig}>
        <ApplicationProvider>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </ApplicationProvider>
    </WagmiConfig>,
);
