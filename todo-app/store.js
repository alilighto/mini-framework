/**
 * TodoMVC State Store
 */

import { createStore } from "../framework/index.js"

// Initial state
const initialState = {
  todos: [],
  filter: "all",
}

// Create the store
export const store = createStore(initialState)

// Actions
export const actions = {
  // Add a new todo
  addTodo: store.createAction((text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    }

    return {
      todos: [...store.getState().todos, newTodo],
    }
  }),

  // Toggle a todo's completed status
  toggleTodo: store.createAction((id) => {
    const todos = store
      .getState()
      .todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))

    return { todos }
  }),

  // Update a todo's text
  updateTodo: store.createAction((id, text) => {
    const todos = store.getState().todos.map((todo) => (todo.id === id ? { ...todo, text } : todo))

    return { todos }
  }),

  // Delete a todo
  deleteTodo: store.createAction((id) => {
    const todos = store.getState().todos.filter((todo) => todo.id !== id)
    return { todos }
  }),

  // Clear completed todos
  clearCompleted: store.createAction(() => {
    const todos = store.getState().todos.filter((todo) => !todo.completed)
    return { todos }
  }),

  // Toggle all todos
  toggleAll: store.createAction((completed) => {
    const todos = store.getState().todos.map((todo) => ({ ...todo, completed }))
    return { todos }
  }),

  // Set the current filter
  setFilter: store.createAction((filter) => {
    return { filter }
  }),
}
