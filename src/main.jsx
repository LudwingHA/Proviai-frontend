import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvier } from "./features/auth/context/AuthContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Routes";
import "./assets/styles/main.css"

createRoot(document.getElementById("root")).render(
  <StrictMode>
   <AuthProvier>
    <RouterProvider router={router}></RouterProvider>
   </AuthProvier>
  </StrictMode>
)