import React from "react";
import "./App.css"; 
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import {Edit} from "./components/Edit"; 
import ElementHome from "./ElementHome";

const App: React.FC = () => {
   
  return (
    <div className="">
    <Routes>
      <Route path="/" element={<ElementHome />} />
      <Route path="/edit" element={<Edit />} />
    </Routes>
  </div>
  );
};

export default App;
