import "./styles/global.css";

import React from "react";

import { createRoot } from "react-dom/client";

import { App } from "./App";

const ROOT_ELEMENT = document.getElementById("root");

if (ROOT_ELEMENT === null) {
  throw new Error("Root element not found");
}

createRoot(ROOT_ELEMENT).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
