/**
 * TodoMVC Item Component
 */

import { Component, createElement as h } from "../../framework/index.js"
import { TodoInput } from "./todo-input.js"

export class TodoItem extends Component {
  constructor(props) {
    super(props)

    // Bind methods
    this.handleToggle = this.handleToggle.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  handleToggle() {
    this.props.onToggle(this.props.todo.id)
  }

  handleDelete() {
    this.props.onDelete(this.props.todo.id)
  }

  handleEdit() {
    this.props.onEdit(this.props.todo.id)
  }

  handleSave(text) {
    this.props.onUpdate(this.props.todo.id, text)
  }

  handleCancel() {
    this.props.onCancel()
  }

  render() {
    const { todo, editing } = this.props
    const isEditing = editing === todo.id

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
            onChange: this.handleToggle,
          }),
          h("label", { onDblClick: this.handleEdit }, todo.text),
          h("button", {
            className: "destroy",
            onClick: this.handleDelete,
          }),
        ]),
        isEditing
          ? new TodoInput({
              text: todo.text,
              editing: true,
              onSave: this.handleSave,
              onCancel: this.handleCancel,
            }).render()
          : null,
      ],
    )
  }
}
