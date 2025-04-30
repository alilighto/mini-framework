/**
 * TodoMVC Input Component
 */

import { createElement as h } from "../../framework/index.js"

export function createTodoInput(props) {
  const { text = "", editing = false, onSave, onCancel } = props
  let inputValue = text

  function handleChange(e) {
    inputValue = e.target.value
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      const trimmedText = inputValue.trim()
      if (trimmedText) {
        onSave(trimmedText)
        if (!editing) {
          // Clear the input after saving
          e.target.value = ""
          inputValue = ""
        }
      }
    } else if (e.key === "Escape" && onCancel) {
      onCancel()
    }
  }

  return h("input", {
    className: editing ? "edit" : "new-todo",
    type: "text",
    placeholder: props.placeholder || "What needs to be done?",
    value: text,
    onInput: handleChange,
    onKeyDown: handleKeyDown,
    autoFocus: true,
  })
}
