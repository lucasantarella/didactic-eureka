import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import IBDCompetitiveIntel from "../ibd-competitive-intel.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <IBDCompetitiveIntel />
  </StrictMode>
);
