/**
 * TodoMVC Main App Component
 */

import { createElement as h, render } from "../../framework/index.js"
import { createTodoInput } from "./todo-input.js"
import { createTodoList } from "./todo-list.js"
import { createTodoFooter } from "./todo-footer.js"
import { actions } from "../store.js"

export function createTodoApp(props) {
  const { store, filter } = props
  let editing = null

  // Get current state
  const state = store.getState()
  const { todos } = state

  // Filter todos based on current filter
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed
    if (filter === "completed") return todo.completed
    return true
  })

  const activeTodoCount = todos.filter((todo) => !todo.completed).length
  const completedCount = todos.length - activeTodoCount
  const allCompleted = todos.length > 0 && activeTodoCount === 0

  // Event handlers
  function handleNewTodo(text) {
    actions.addTodo(text)
  }

  function handleToggle(id) {
    actions.toggleTodo(id)
  }

  function handleDelete(id) {
    actions.deleteTodo(id)
  }

  function handleEdit(id) {
    editing = id
    // Force re-render
    store.subscribe(() => { })()
  }

  function handleUpdate(id, text) {
    actions.updateTodo(id, text)
    editing = null
  }

  function handleCancelEdit() {
    editing = null
    // Force re-render
    store.subscribe(() => { })()
  }

  function handleToggleAll(e) {
    actions.toggleAll(e.target.checked)
  }

  function handleClearCompleted() {
    actions.clearCompleted()
  }

  // Subscribe to store changes to update the UI
  store.subscribe(() => {
    render(createTodoApp(props), document.getElementById("app"))
  })

  // Create the todo input component
  const todoInput = createTodoInput({
    onSave: handleNewTodo,
  })

  // Create the todo list component if we have todos
  const todoList =
    todos.length > 0
      ? createTodoList({
        todos: filteredTodos,
        editing,
        onToggle: handleToggle,
        onDelete: handleDelete,
        onEdit: handleEdit,
        onUpdate: handleUpdate,
        onCancel: handleCancelEdit,
      })
      : null

  // Create the footer component if we have todos
  const todoFooter =
    todos.length > 0
      ? createTodoFooter({
        count: activeTodoCount,
        completedCount,
        filter,
        onClearCompleted: handleClearCompleted,
      })
      : null

  // Create the toggle all checkbox if we have todos
  const toggleAll =
    todos.length > 0
      ? [
        h("input", {
          id: "toggle-all",
          className: "toggle-all",
          type: "checkbox",
          checked: allCompleted,
          onChange: handleToggleAll,
        }),
        h("label", { htmlFor: "toggle-all" }, "Mark all as complete"),
      ]
      : null

  // Render the app
  return h("div", { className: "todoapp" }, [
    h("header", { className: "header" }, [h("h1", {}, "todos"), todoInput]),

    todos.length > 0 ? h("section", { className: "main" }, [...toggleAll, todoList]) : null,

    todoFooter,
  ])
}
