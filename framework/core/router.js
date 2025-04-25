/**
 * Mini-Framework Router Module
 * Handles client-side routing
 */

import { render } from "./dom.js"

class Router {
  constructor() {
    this.routes = []
    this.currentRoute = null
    this.rootElement = null

    // Bind methods
    this.navigate = this.navigate.bind(this)
    this.handlePopState = this.handlePopState.bind(this)

    // Set up event listeners
    window.addEventListener("popstate", this.handlePopState)

    // Initial route
    this.handlePopState()
  }

  // Register a route
  addRoute(path, component) {
    this.routes.push({ path, component })
    return this
  }

  // Set the root element where components will be rendered
  setRoot(element) {
    this.rootElement = element
    this.render()
    return this
  }

  // Navigate to a specific route
  navigate(path) {
    window.history.pushState(null, "", path)
    this.handlePopState()
    return this
  }

  // Handle browser back/forward navigation
  handlePopState() {
    const path = window.location.pathname
    const route = this.findRoute(path)

    if (route) {
      this.currentRoute = route
      this.render()
    }
  }

  // Find a matching route for a path
  findRoute(path) {
    // First try exact match
    const route = this.routes.find((r) => r.path === path)

    if (!route) {
      // Try to match routes with parameters
      for (const r of this.routes) {
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
  render() {
    if (!this.rootElement || !this.currentRoute) return

    const { component, params = {} } = this.currentRoute

    // If component is a class, instantiate it with params
    if (typeof component === "function" && component.prototype && component.prototype.render) {
      const instance = new component(params)
      render(instance.render(), this.rootElement)
    } else if (typeof component === "function") {
      // If component is a function, call it with params
      render(component(params), this.rootElement)
    } else {
      // If component is a vNode, render it directly
      render(component, this.rootElement)
    }
  }
}

// Create and export a singleton router instance
export const router = new Router()

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
