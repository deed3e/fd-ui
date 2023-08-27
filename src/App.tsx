import Liquidity from "./view/Liquidity";
import Faucet from "./view/Faucet";
import Swap from "./view/Swap";
import Trading from "./view/Trading";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Liquidity />}></Route>
        <Route path="/liquidity" element={<Liquidity />} />
        <Route path="/trading" element={<Trading />} />
        <Route path="/swap" element={<Swap />} />
        <Route path="/faucet" element={<Faucet />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;