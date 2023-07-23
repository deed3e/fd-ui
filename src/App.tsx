import Home from "./view/Home"
import Game from "./view/Game";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="game" element={<Game />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;