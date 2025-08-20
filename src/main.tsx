import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Export App component for library mode
export { App as WheelSpinApp };

// Expose App component globally for AEM integration
(window as any).WheelSpinApp = App;

// Check if we're in AEM context (no root element) or standalone
const rootElement = document.getElementById("root");
if (rootElement) {
  // Standalone mode
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
