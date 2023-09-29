import React, {useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import axios from 'axios'; 
import PieChart from "./PieChart/PieChart.js";

import Menu from './Menu/menu.js';
import HomePage from './HomePage/HomePage.js';
import Hero from './Hero/Hero.js';
import Footer from './Footer/footer.js';
import AboutPage from './AboutPage/AboutPage.js';
import LoginPage from './LoginPage/LoginPage.js';

function App() {
  useEffect(() => {
    axios.get('http://localhost:3001/budget').then((response) => {
      console.log(response.data);
    });
  }, []);

  return (
    <Router>
      <Menu />
      <Hero />
      <div className="mainContainer">
        <Routes>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    <PieChart/>
    <Footer />
    </Router>
  );
}
export default App;
 
