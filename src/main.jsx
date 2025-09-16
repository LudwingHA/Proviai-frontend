import { StrictMode } from "react";

const { createRoot } = require("react-dom/client");

createRoot(document.getElementById("root"
)).render(
  <StrictMode>
    <h1>Hola React</h1>
  </StrictMode>
)