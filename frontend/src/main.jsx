import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import RealtimeBridge from "./components/RealtimeBridge";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RealtimeBridge />
    <App />
  </React.StrictMode>
);
