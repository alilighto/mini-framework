/**
 * Mini-Framework Main Entry Point
 * Exports all framework functionality
 */

// DOM Module
export {
    createElement,
    createTextNode,
    render,
    createComponent,
} from "./core/dom.js"

// Router Module
export {
    router,
    createRouter,
    Link,
} from "./core/router.js"

// State Module
export {
    createStore,
    connect,
} from "./core/state.js"

// Events Module
export {
    createEventSystem,
    on,
    off,
    createEventEmitter,
} from "./core/events.js"

// Helper functions
export { h } from "./utils/helpers.js"
