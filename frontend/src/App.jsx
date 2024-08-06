import React from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./routes/AllRoutes";
export default function App() {
  return (
    <BrowserRouter>
      <AllRoutes />
    </BrowserRouter>
  );
}
