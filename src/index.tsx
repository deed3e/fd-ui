import ReactDOM from 'react-dom/client';
import App from './App';
import { legacy_createStore } from 'redux';
import { Provider } from 'react-redux';
import { userReducer } from './stores/index';
import { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';

const getLibrary = (p: ExternalProvider | JsonRpcFetchFunc) => {
  return new Web3Provider(p);
};

const store = legacy_createStore(userReducer);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Web3ReactProvider getLibrary={getLibrary}>
  <Provider store={store}>
    <App />
  </Provider>
  </Web3ReactProvider>
);
