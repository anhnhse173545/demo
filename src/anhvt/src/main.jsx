import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ConsultingStaff from "./pages/ConsultingStaff/ConsultingStaff";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ConsultingStaff />
  </BrowserRouter>
);
