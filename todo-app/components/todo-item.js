/**
 * TodoMVC Item Component
 */

import { createElement as h } from "../../framework/index.js"
import { createTodoInput } from "./todo-input.js"

export function createTodoItem(props) {
  const { todo, editing, onToggle, onDelete, onEdit, onUpdate, onCancel } = props
  const isEditing = editing === todo.id

  function handleToggle() {
    onToggle(todo.id)
  }

  function handleDelete() {
    onDelete(todo.id)
  }

  function handleEdit() {
    onEdit(todo.id)
  }

  function handleSave(text) {
    onUpdate(todo.id, text)
  }

  return h(
    "li",
    {
      className: `${todo.completed ? "completed" : ""} ${isEditing ? "editing" : ""}`,
    },
    [
      h("div", { className: "view" }, [
        h("input", {
          className: "toggle",
          type: "checkbox",
          checked: todo.completed,
          onChange: handleToggle,
        }),
        h("label", { onDblClick: handleEdit }, todo.text),
        h("button", {
          className: "destroy",
          onClick: handleDelete,
        }),
      ]),
      isEditing
        ? createTodoInput({
          text: todo.text,
          editing: true,
          onSave: handleSave,
          onCancel: onCancel,
        })
        : null,
    ],
  )
}
