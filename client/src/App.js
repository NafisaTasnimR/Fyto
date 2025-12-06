import React from 'react';
import LandingPage from './Components/LandingPage/LandingPage';
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
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginSignup mode="login" />} />
        <Route path="/signup" element={<LoginSignup mode="signup" />} />
        <Route path="/" element={<Store />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/new-post" element={<NewPost />} />
        <Route path="/journal" element={<Journal />} />
      </Routes>
    </Router>
  );
}



export default App;
