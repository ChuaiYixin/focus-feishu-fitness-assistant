import React from "react";
import { createRoot } from "react-dom/client";
import Home from "../../app/page";
import "../../app/globals.css";
window.addEventListener("error", (event) => {
  document.body.innerHTML = `<pre style="padding:24px;color:#b91c1c;white-space:pre-wrap">${event.message}</pre>`;
});
createRoot(document.getElementById("root")!).render(<React.StrictMode><Home /></React.StrictMode>);
