/*import './App.css';
//import LoginSignup from './Components/LoginSignup/LoginSignup';
//import Store from './Components/Store/Store';
import ProductDetail from './Components/ProductDetail/ProductDetail';

function App() {
  return (
    <div className="App">
      
      <ProductDetail />
    </div>

  );
}*/
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Store from './Components/Store/Store';
import ProductDetail from './Components/ProductDetail/ProductDetail';
import NewPost from './Components/NewPost/NewPost';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Store />} />
          <Route path="/product/:id" element={<ProductDetail />} />
           <Route path="/new-post" element={<NewPost />} />
        </Routes>
      </div>
    </Router>
  );
}



export default App;
