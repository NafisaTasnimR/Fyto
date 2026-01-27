import { ConfirmedPostsProvider } from './Components/Context/ConfirmedPostsContext';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage/LandingPage';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import SocialPage from './Components/SocialPage/SocialPage';
import Store from './Components/Store/Store';
import ProductDetail from './Components/ProductDetail/ProductDetail';
import NewPost from './Components/NewPost/NewPost';
import ScrollToTop from './Components/Scrolltotop/Scrolltotop';
import JournalLanding from './Components/Journal/JournalLanding';
import Journal from './Components/Journal/Journal';
import ProfilePage from './Components/ProfilePage/ProfilePage';
import Challenges from './Components/Challenges/Challenges';
import './App.css';

function App() {
  return (
    <ConfirmedPostsProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginSignup mode="login" />} />
          <Route path="/signup" element={<LoginSignup mode="signup" />} />
          <Route path="/store" element={<Store />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/new-post" element={<NewPost />} />
          <Route path="/journal" element={<JournalLanding />} />
          <Route path="/journal/new" element={<Journal />} />
          <Route path="/journal/continue" element={<Journal />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/challenges" element={<Challenges />} />
        </Routes>
      </Router>
    </ConfirmedPostsProvider>
  );
}

export default App;