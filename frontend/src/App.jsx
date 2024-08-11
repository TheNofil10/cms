import React from "react";
import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./routes/AllRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AllRoutes />
        <ToastContainer />
      </BrowserRouter>
    </AuthProvider>
  );
}
