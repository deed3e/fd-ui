import Liquidity from './view/Liquidity';
import Faucet from './view/Faucet';
import Swap from './view/Swap';
import Trading from './view/Trading';
import Dashboard from './view/Dashboard';
import Analytic from './view/Analytic';
import Referer from './view/Referer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../src/component/Header';
import Modals from './component/Modals/Modals';
import { Tooltip } from 'react-tooltip';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Modals>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/liquidity" element={<Liquidity />} />
                        <Route path="/trading/:market/:side" element={<Trading />} />
                        <Route path="/swap" element={<Swap />} />
                        <Route path="/analytic" element={<Analytic />} />
                        <Route path="/faucet" element={<Faucet />} />
                        <Route path="/referer" element={<Referer />} />
                    </Routes>
                    <Tooltip id="my-tooltip" />
                </Modals>
                <ToastContainer position="bottom-right" />
            </BrowserRouter>
        </div>
    );
}

export default App;
