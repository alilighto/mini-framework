/**
 * Mini-Framework State Management Module
 * Provides centralized state management with subscriptions
 */

// Create a store
export function createStore(initialState = {}) {
  let state = { ...initialState }
  const listeners = []

  // Get the current state
  function getState() {
    return state
  }

  // Update the state
  function setState(newState) {
    state = { ...state, ...newState }
    notify()
    return state
  }

  // Replace the entire state
  function replaceState(newState) {
    state = newState
    notify()
    return state
  }

  // Subscribe to state changes
  function subscribe(listener) {
    listeners.push(listener)

    // Return unsubscribe function
    return () => {
      const index = listeners.indexOf(listener)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
    }
  }

  // Notify all listeners of state change
  function notify() {
    listeners.forEach((listener) => listener(state))
  }

  // Create an action creator
  function createAction(actionFn) {
    return (...args) => {
      const result = actionFn(...args)

      if (typeof result === "function") {
        // Thunk action for async operations
        return result(setState, getState)
      } else if (result !== undefined) {
        // Regular action
        setState(result)
      }

      return getState()
    }
  }

  return {
    getState,
    setState,
    replaceState,
    subscribe,
    createAction,
  }
}

// Connect a component to the store
export function connect(renderFn, mapStateToProps) {
  return (store, props = {}) => {
    const render = () => {
      const stateProps = mapStateToProps ? mapStateToProps(store.getState()) : {}
      const combinedProps = { ...props, ...stateProps }
      return renderFn(combinedProps)
    }

    // Subscribe to store changes
    const unsubscribe = store.subscribe(() => {
      // This will be handled by the component's update function
    })

    return {
      render,
      unsubscribe,
    }
  }
}
