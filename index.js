/**
 * Mini-Framework Main Entry Point
 * Exports all framework functionality
 */

// DOM Module
export {
  createElement,
  createTextNode,
  render,
  Component,
  mount,
} from "./core/dom.js"

// Router Module
export {
  router,
  Link,
} from "./core/router.js"

// State Module
export {
  Store,
  connect,
} from "./core/state.js"

// Events Module
export {
  eventSystem,
  on,
  off,
  EventEmitter,
} from "./core/events.js"

// Helper functions
export { h } from "./utils/helpers.js"
