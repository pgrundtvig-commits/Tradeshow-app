﻿import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}
createRoot(document.getElementById("root")!).render(<App />);
