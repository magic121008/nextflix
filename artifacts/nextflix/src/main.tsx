import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { setBaseUrl } from "@workspace/api-client-react";

// Backend API URL
setBaseUrl("https://stream-hub-api-server.vercel.app");

createRoot(document.getElementById("root")!).render(<App />);