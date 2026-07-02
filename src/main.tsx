import "./lang";
import "./lib/env";
import "./index.css";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";
import App from "@/App.tsx";

const rootElement = document.getElementById("root")!;
const tree = (
  <StrictMode>
    <App />
    <Toaster />
  </StrictMode>
);

// Hydrate when the markup was prerendered (flag ON); otherwise create a fresh
// root exactly as before (flag OFF -> identical to the previous behavior).
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, tree);
} else {
  createRoot(rootElement).render(tree);
}
