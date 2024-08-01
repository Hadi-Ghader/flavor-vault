import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";

import SignUp from "./components/signup/SignUp";
import Login from "./components/login/Login";
import LandingPage from "./components/landingpage/LandingPage";
import RecipeUpload from "./components/recipeupload/RecipeUpload";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="recipeupload" element={<RecipeUpload />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
