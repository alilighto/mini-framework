/**
 * Mini-Framework State Management Module
 * Provides centralized state management with subscriptions
 */

export class Store {
  constructor(initialState = {}) {
    this.state = initialState
    this.listeners = []
  }

  // Get the current state
  getState() {
    return this.state
  }

  // Update the state
  setState(newState) {
    this.state = { ...this.state, ...newState }
    this.notify()
  }

  // Replace the entire state
  replaceState(newState) {
    this.state = newState
    this.notify()
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.push(listener)

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  // Notify all listeners of state change
  notify() {
    this.listeners.forEach((listener) => listener(this.state))
  }

  // Create an action creator
  createAction(actionFn) {
    return (...args) => {
      const result = actionFn(...args)

      if (typeof result === "function") {
        // Thunk action for async operations
        return result(this.setState.bind(this), this.getState.bind(this))
      } else if (result !== undefined) {
        // Regular action
        this.setState(result)
      }
    }
  }
}

// Create a connected component that reacts to state changes
export function connect(component, mapStateToProps) {
  return function ConnectedComponent(store, ownProps = {}) {
    const render = () => {
      const stateProps = mapStateToProps ? mapStateToProps(store.getState()) : {}
      const props = { ...ownProps, ...stateProps }

      // If component is a class, instantiate it
      if (typeof component === "function" && component.prototype && component.prototype.render) {
        const instance = new component(props)
        return instance.render()
      }

      // If component is a function, call it with props
      return component(props)
    }

    // Subscribe to store changes
    const unsubscribe = store.subscribe(() => {
      // Re-render when state changes
      // This will be handled by the framework's rendering system
    })

    return {
      render,
      unsubscribe,
    }
  }
}
