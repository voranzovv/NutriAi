import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RecipeDetails from "./pages/RecipeDetails";
import Navbar from "./components/Navbar";
// import AIAnalysis from "./pages/AIAnalysis";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          {/* <Route path="/analysis/:id" element={<AIAnalysis />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
