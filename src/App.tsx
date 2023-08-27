import Liquidity from "./view/Liquidity";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Liquidity />}></Route>
        <Route path="/liquidity" element={<Liquidity />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;