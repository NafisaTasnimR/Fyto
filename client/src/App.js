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
import UserProfilePage from './Components/ProfilePage/UserProfilePage';
import Challenges from './Components/Challenges/Challenges';
import PlantInfo from './Components/PlantInfo/PlantInfo';
import './App.css';
import PreviewSocialPage from './Components/LandingPage/PreviewSocialPage';
import PreviewMarketplace from './Components/LandingPage/PreviewMarketplace';
import PreviewPlantInfo from './Components/LandingPage/PreviewPlantInfo';


import PlantCare from './Components/PlantCare/PlantCare';
import AdminLogin from './Components/Admin/AdminLogin';
import Admin from './Components/Admin/Admin';

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
          <Route path="/journal/:id" element={<Journal />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/user/:userId" element={<UserProfilePage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/preview-social" element={<PreviewSocialPage />} />
          <Route path="/preview-marketplace" element={<PreviewMarketplace />} />
          <Route path="/preview-plant-info" element={<PreviewPlantInfo />} />
          <Route path="/plant-info" element={<PlantInfo />} />
          <Route path="/plant-care" element={<PlantCare />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<Admin />} />
        </Routes>
      </Router>
    </ConfirmedPostsProvider>
  );
}

export default App;