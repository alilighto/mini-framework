/**
 * TodoMVC List Component
 */

import { createElement as h } from "../../framework/index.js"
import { createTodoItem } from "./todo-item.js"

export function createTodoList(props) {
  const { todos, editing, onToggle, onDelete, onEdit, onUpdate, onCancel } = props

  return h(
    "ul",
    { className: "todo-list" },
    todos.map((todo) =>
      createTodoItem({
        key: todo.id,
        todo,
        editing,
        onToggle,
        onDelete,
        onEdit,
        onUpdate,
        onCancel,
      }),
    ),
  )
}
