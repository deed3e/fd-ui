import ReactDOM from 'react-dom/client';
import App from './App';
import { legacy_createStore } from 'redux';
import { Provider } from 'react-redux';
import { userReducer } from './stores/index';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

const { chains, publicClient } = configureChains([bscTestnet], [publicProvider()]);
const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient,
});

const store = legacy_createStore(userReducer);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <WagmiConfig config={config}>
    <Provider store={store}>
      <App />
    </Provider>
  </WagmiConfig>,
);
