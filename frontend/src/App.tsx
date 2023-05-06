import React, { useState } from "react";
// import reactLogo from './assets/react.svg'
import { Route, Routes } from "react-router-dom";
import "./App.css";
import PageNotFound from "../pages/PageNotFound";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";

const App: React.FC = () => {
  return (
    <>
      <section>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </section>
    </>
  );
};

export default App;
