import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Store from './Components/Store/Store';
import ProductDetail from './Components/ProductDetail/ProductDetail';
import NewPost from './Components/NewPost/NewPost';
import ScrollToTop from './Components/Scrolltotop/Scrolltotop';
import Journal from './Components/Journal/Journal';
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
         <LoginSignup />
        <Routes>
          <Route path="/" element={<Store />} />
          <Route path="/product/:id" element={<ProductDetail />} />
           <Route path="/new-post" element={<NewPost />} />
          <Route path="/journal" element={<Journal />} />
        </Routes>
      </div>
    </Router>
  );
}



export default App;
