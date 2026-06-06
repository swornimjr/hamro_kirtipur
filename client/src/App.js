import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import EmergencyStrip from './components/Layout/EmergencyStrip';
import HomePage from './pages/HomePage';
import WardsPage from './pages/WardsPage';
import WardDetailPage from './pages/WardDetailPage';
import ListingDetailPage from './pages/ListingDetailPage';
import SuggestPage from './pages/SuggestPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import './App.css';

function PublicLayout() {
  return (
    <>
      <EmergencyStrip />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wards" element={<WardsPage />} />
          <Route path="/wards/:wardNumber" element={<WardDetailPage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
          <Route path="/suggest" element={<SuggestPage />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
