import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Routes";
import "./assets/styles/main.css"
import "./assets/styles/theme.css"
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./features/auth/context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
   <AuthProvider>
    <ThemeProvider>
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
   </AuthProvider>
  </StrictMode>
)