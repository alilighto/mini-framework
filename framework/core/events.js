/**
 * Mini-Framework Event Handling Module
 * Provides custom event handling with delegation
 */

// Event delegation system
class EventSystem {
  constructor() {
    this.events = {}
    this.delegatedEvents = new Set()

    // Bind methods
    this.handleEvent = this.handleEvent.bind(this)
  }

  // Add an event listener with optional delegation
  on(element, eventName, selector, callback) {
    // Handle case where selector is omitted (no delegation)
    if (typeof selector === "function") {
      callback = selector
      selector = null
    }

    // Create unique ID for this listener
    const id = this.generateId()

    // Store the event info
    this.events[id] = {
      element,
      eventName,
      selector,
      callback,
    }

    // Set up delegation if needed
    if (selector) {
      if (!this.delegatedEvents.has(eventName)) {
        document.addEventListener(eventName, this.handleEvent, true)
        this.delegatedEvents.add(eventName)
      }
    } else {
      // Direct event binding
      element.addEventListener(eventName, callback)
    }

    // Return ID for removal
    return id
  }

  // Remove an event listener
  off(id) {
    const event = this.events[id]
    if (!event) return false

    if (event.selector) {
      // For delegated events, just remove from our registry
      delete this.events[id]
    } else {
      // For direct events, remove the actual listener
      event.element.removeEventListener(event.eventName, event.callback)
      delete this.events[id]
    }

    return true
  }

  // Handle delegated events
  handleEvent(e) {
    const eventName = e.type

    // Find all matching delegated handlers
    Object.entries(this.events)
      .filter(([_, event]) => event.eventName === eventName && event.selector && e.target.matches(event.selector))
      .forEach(([_, event]) => {
        event.callback.call(e.target, e)
      })
  }

  // Generate a unique ID
  generateId() {
    return "_" + Math.random().toString(36).substr(2, 9)
  }
}

// Create and export a singleton event system
export const eventSystem = new EventSystem()

// Helper functions
export function on(element, event, selector, callback) {
  return eventSystem.on(element, event, selector, callback)
}

export function off(id) {
  return eventSystem.off(id)
}

// Custom event emitter
export class EventEmitter {
  constructor() {
    this.events = {}
  }

  // Add event listener
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = []
    }

    this.events[event].push(listener)
    return this
  }

  // Remove event listener
  off(event, listener) {
    if (!this.events[event]) return this

    this.events[event] = this.events[event].filter((l) => l !== listener)
    return this
  }

  // Emit event with data
  emit(event, ...args) {
    if (!this.events[event]) return this

    this.events[event].forEach((listener) => {
      listener(...args)
    })

    return this
  }

  // Add one-time event listener
  once(event, listener) {
    const onceListener = (...args) => {
      this.off(event, onceListener)
      listener(...args)
    }

    return this.on(event, onceListener)
  }
}
