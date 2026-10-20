import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import TelegramContactButton from "./components/TelegramContactButton.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/products/:productId" element={<App />} />
        <Route path="/admin" element={<App />} />
        <Route path="*" element={<App />} />
      </Routes>
      <TelegramContactButton />
    </BrowserRouter>
  </StrictMode>,
);
