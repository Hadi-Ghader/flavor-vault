import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import SignUp from "./components/signup/SignUp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import LandingPage from "./components/landingPage/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="SignUp" element={<SignUp />} />
          <Route path="Login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
