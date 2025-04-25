/**
 * TodoMVC Main App Component
 */

import { Component, createElement as h } from "../../framework/index.js"
import { TodoInput } from "./todo-input.js"
import { TodoList } from "./todo-list.js"
import { TodoFooter } from "./todo-footer.js"
import { actions } from "../store.js"

export class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editing: null,
    }

    // Bind methods
    this.handleNewTodo = this.handleNewTodo.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleCancelEdit = this.handleCancelEdit.bind(this)
    this.handleToggleAll = this.handleToggleAll.bind(this)
    this.handleClearCompleted = this.handleClearCompleted.bind(this)

    // Subscribe to store changes
    this.unsubscribe = this.props.store.subscribe(() => {
      this.update()
    })
  }

  handleNewTodo(text) {
    actions.addTodo(text)
  }

  handleToggle(id) {
    actions.toggleTodo(id)
  }

  handleDelete(id) {
    actions.deleteTodo(id)
  }

  handleEdit(id) {
    this.setState({ editing: id })
  }

  handleUpdate(id, text) {
    actions.updateTodo(id, text)
    this.setState({ editing: null })
  }

  handleCancelEdit() {
    this.setState({ editing: null })
  }

  handleToggleAll(e) {
    actions.toggleAll(e.target.checked)
  }

  handleClearCompleted() {
    actions.clearCompleted()
  }

  render() {
    const { store, filter } = this.props
    const { todos } = store.getState()

    // Filter todos based on current filter
    const filteredTodos = todos.filter((todo) => {
      if (filter === "active") return !todo.completed
      if (filter === "completed") return todo.completed
      return true
    })

    const activeTodoCount = todos.filter((todo) => !todo.completed).length
    const completedCount = todos.length - activeTodoCount
    const allCompleted = todos.length > 0 && activeTodoCount === 0

    return h("div", { className: "todoapp" }, [
      h("header", { className: "header" }, [
        h("h1", {}, "todos"),
        new TodoInput({ onSave: this.handleNewTodo }).render(),
      ]),

      todos.length > 0
        ? [
            h("section", { className: "main" }, [
              h("input", {
                id: "toggle-all",
                className: "toggle-all",
                type: "checkbox",
                checked: allCompleted,
                onChange: this.handleToggleAll,
              }),
              h("label", { htmlFor: "toggle-all" }, "Mark all as complete"),

              new TodoList({
                todos: filteredTodos,
                editing: this.state.editing,
                onToggle: this.handleToggle,
                onDelete: this.handleDelete,
                onEdit: this.handleEdit,
                onUpdate: this.handleUpdate,
                onCancel: this.handleCancelEdit,
              }).render(),
            ]),

            new TodoFooter({
              count: activeTodoCount,
              completedCount,
              filter,
              onClearCompleted: this.handleClearCompleted,
            }).render(),
          ]
        : null,
    ])
  }
}
