import ReactDOM from 'react-dom/client';
import App from './App';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { ApplicationProvider } from './contexts/ApplicationProvider';

const { chains, publicClient } = configureChains([bscTestnet], [publicProvider()]);
const config = createConfig({
    autoConnect: true,
    connectors: [new MetaMaskConnector({ chains })],
    publicClient,
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <WagmiConfig config={config}>
        <ApplicationProvider>
            <App />
        </ApplicationProvider>
    </WagmiConfig>,
);
