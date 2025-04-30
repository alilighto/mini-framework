/**
 * TodoMVC App Entry Point
 */

import { router } from "../framework/index.js"
import { createTodoApp } from "./components/app.js"
import { store } from "./store.js"

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  const appRoot = document.getElementById("app")

  // Set up routes
  router
    .addRoute("/", () => createTodoApp({ store, filter: "all" }))
    .addRoute("/active", () => createTodoApp({ store, filter: "active" }))
    .addRoute("/completed", () => createTodoApp({ store, filter: "completed" }))
    .setRoot(appRoot)
})
