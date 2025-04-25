/**
 * TodoMVC App Entry Point
 */

import { router } from "../framework/index.js"
import { App } from "./components/app.js"
import { store } from "./store.js"

// Set up routes
router
  .addRoute("/", () => new App({ store, filter: "all" }))
  .addRoute("/active", () => new App({ store, filter: "active" }))
  .addRoute("/completed", () => new App({ store, filter: "completed" }))
  .setRoot(document.getElementById("app"))

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  // Initial render happens through the router
})
