import Liquidity from './view/Liquidity';
import Faucet from './view/Faucet';
import Swap from './view/Swap';
import Trading from './view/Trading';
import Dashboard from './view/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../src/component/Header';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/liquidity" element={<Liquidity />} />
          <Route path="/trading" element={<Trading />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/faucet" element={<Faucet />} />
        </Routes>
        <ToastContainer position="bottom-right" />
      </BrowserRouter>
    </div>
  );
}

export default App;
