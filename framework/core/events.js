/**
 * Mini-Framework Event Handling Module
 * Provides custom event handling with delegation
 */

// Create an event system
export function createEventSystem() {
  const events = {}
  const delegatedEvents = new Set()

  // Handle delegated events
  function handleEvent(e) {
    const eventName = e.type

    // Find all matching delegated handlers
    Object.entries(events)
      .filter(([_, event]) => event.eventName === eventName && event.selector && e.target.matches(event.selector))
      .forEach(([_, event]) => {
        event.callback.call(e.target, e)
      })
  }

  // Generate a unique ID
  function generateId() {
    return "_" + Math.random().toString(36).substr(2, 9)
  }

  // Add an event listener with optional delegation
  function on(element, eventName, selector, callback) {
    // Handle case where selector is omitted (no delegation)
    if (typeof selector === "function") {
      callback = selector
      selector = null
    }

    // Create unique ID for this listener
    const id = generateId()

    // Store the event info
    events[id] = {
      element,
      eventName,
      selector,
      callback,
    }

    // Set up delegation if needed
    if (selector) {
      if (!delegatedEvents.has(eventName)) {
        document.addEventListener(eventName, handleEvent, true)
        delegatedEvents.add(eventName)
      }
    } else {
      // Direct event binding
      element.addEventListener(eventName, callback)
    }

    // Return ID for removal
    return id
  }

  // Remove an event listener
  function off(id) {
    const event = events[id]
    if (!event) return false

    if (event.selector) {
      // For delegated events, just remove from our registry
      delete events[id]
    } else {
      // For direct events, remove the actual listener
      event.element.removeEventListener(event.eventName, event.callback)
      delete events[id]
    }

    return true
  }

  return {
    on,
    off,
  }
}

// Create a singleton event system
export const eventSystem = createEventSystem()

// Helper functions
export function on(element, event, selector, callback) {
  return eventSystem.on(element, event, selector, callback)
}

export function off(id) {
  return eventSystem.off(id)
}

// Create an event emitter
export function createEventEmitter() {
  const events = {}

  // Add event listener
  function on(event, listener) {
    if (!events[event]) {
      events[event] = []
    }

    events[event].push(listener)
    return () => off(event, listener)
  }

  // Remove event listener
  function off(event, listener) {
    if (!events[event]) return false

    const index = events[event].indexOf(listener)
    if (index !== -1) {
      events[event].splice(index, 1)
      return true
    }
    return false
  }

  // Emit event with data
  function emit(event, ...args) {
    if (!events[event]) return false

    events[event].forEach((listener) => {
      listener(...args)
    })

    return true
  }

  // Add one-time event listener
  function once(event, listener) {
    const onceWrapper = (...args) => {
      off(event, onceWrapper)
      listener(...args)
    }

    return on(event, onceWrapper)
  }

  return {
    on,
    off,
    emit,
    once,
  }
}
