import ReactDOM from 'react-dom/client';
import App from './App';
import { legacy_createStore } from 'redux';
import { Provider } from 'react-redux';
import { userReducer } from './stores/index';


const store = legacy_createStore(userReducer);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
