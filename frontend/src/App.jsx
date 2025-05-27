import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/authentication/LoginPage";
import SignupPage from "./pages/authentication/SignUpPage";
import VerificationPage from "./pages/authentication/VerificationPage";
import UserDashboard from "./pages/UserDashboard";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import ForgotPasswordPage from "./pages/authentication/ForgotPasswordPage";
import ResetPasswordPage from "./pages/authentication/ResetPasswordPage";
//import Browse from "./pages/Browse";
import SearchPage from "./pages/SearchPage";
import UploadListingPage from "./pages/UploadListingPage"
import ListingDetailsPage from "./pages/ListingDetailsPage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute> } />
        <Route path="/verify" element={
          <PublicRoute>
            <VerificationPage />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        } />
        <Route path="/reset-password" element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        } />
        <Route path="/browse" element={
          <PrivateRoute>
            <SearchPage />
          </PrivateRoute>
        } />
        <Route path="/upload" element={
          <PrivateRoute>
            <UploadListingPage />
          </PrivateRoute>
        } />
        <Route path="/listings/:id" element={
          <PrivateRoute>
            <ListingDetailsPage />
          </PrivateRoute>
        } />
        <Route path="/chat" element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
