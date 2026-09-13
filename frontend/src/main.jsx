import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import RealtimeBridge from "./components/RealtimeBridge";
import RealtimeToast from "./components/RealtimeToast";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RealtimeBridge />
    <RealtimeToast />
    <App />
  </React.StrictMode>
);
