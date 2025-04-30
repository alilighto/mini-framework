/**
 * Mini-Framework Router Module
 * Handles client-side routing
 */

import { render } from "./dom.js"

// Create a router
export function createRouter() {
  const routes = []
  let currentRoute = null
  let rootElement = null

  // Handle browser back/forward navigation
  function handlePopState() {
    const path = window.location.pathname
    const route = findRoute(path)

    if (route) {
      currentRoute = route
      renderRoute()
    }
  }

  // Find a matching route for a path
  function findRoute(path) {
    // First try exact match
    const route = routes.find((r) => r.path === path)

    if (!route) {
      // Try to match routes with parameters
      for (const r of routes) {
        const routeParts = r.path.split("/")
        const pathParts = path.split("/")

        if (routeParts.length !== pathParts.length) continue

        const params = {}
        let match = true

        for (let i = 0; i < routeParts.length; i++) {
          if (routeParts[i].startsWith(":")) {
            // This is a parameter
            const paramName = routeParts[i].substring(1)
            params[paramName] = pathParts[i]
          } else if (routeParts[i] !== pathParts[i]) {
            match = false
            break
          }
        }

        if (match) {
          return { ...r, params }
        }
      }
    }

    return route
  }

  // Render the current route
  function renderRoute() {
    if (!rootElement || !currentRoute) return

    const { component, params = {} } = currentRoute

    // If component is a function, call it with params
    if (typeof component === "function") {
      render(component(params), rootElement)
    } else {
      // If component is a vNode, render it directly
      render(component, rootElement)
    }
  }

  // Register a route
  function addRoute(path, component) {
    routes.push({ path, component })
    return router
  }

  // Set the root element where components will be rendered
  function setRoot(element) {
    rootElement = element
    renderRoute()
    return router
  }

  // Navigate to a specific route
  function navigate(path) {
    window.history.pushState(null, "", path)
    handlePopState()
    return router
  }

  // Initialize the router
  window.addEventListener("popstate", handlePopState)
  handlePopState()

  // Router object
  const router = {
    addRoute,
    setRoot,
    navigate,
    getRoutes: () => routes,
  }

  return router
}

// Create a singleton router instance
export const router = createRouter()

// Link component for navigation
export function Link({ to, className, children }) {
  return {
    tag: "a",
    attrs: {
      href: to,
      className,
      onclick: (e) => {
        e.preventDefault()
        router.navigate(to)
      },
    },
    children: Array.isArray(children) ? children : [children],
  }
}
