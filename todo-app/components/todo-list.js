/**
 * TodoMVC List Component
 */

import { Component, createElement as h } from "../../framework/index.js"
import { TodoItem } from "./todo-item.js"

export class TodoList extends Component {
  render() {
    const { todos, editing, onToggle, onDelete, onEdit, onUpdate, onCancel } = this.props

    return h(
      "ul",
      { className: "todo-list" },
      todos.map((todo) =>
        new TodoItem({
          key: todo.id,
          todo,
          editing,
          onToggle,
          onDelete,
          onEdit,
          onUpdate,
          onCancel,
        }).render(),
      ),
    )
  }
}
