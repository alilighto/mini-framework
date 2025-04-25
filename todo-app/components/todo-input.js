/**
 * TodoMVC Input Component
 */

import { Component, createElement as h } from "../../framework/index.js"

export class TodoInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      text: this.props.text || "",
    }

    // Bind methods
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    this.setState({ text: e.target.value })
  }

  handleKeyDown(e) {
    if (e.key === "Enter") {
      this.handleSubmit()
    } else if (e.key === "Escape") {
      this.setState({ text: "" })
      if (this.props.onCancel) {
        this.props.onCancel()
      }
    }
  }

  handleSubmit() {
    const text = this.state.text.trim()
    if (text) {
      this.props.onSave(text)
      if (!this.props.editing) {
        this.setState({ text: "" })
      }
    }
  }

  render() {
    return h("input", {
      className: this.props.editing ? "edit" : "new-todo",
      type: "text",
      placeholder: this.props.placeholder || "What needs to be done?",
      value: this.state.text,
      onInput: this.handleChange,
      onKeyDown: this.handleKeyDown,
      autoFocus: true,
    })
  }
}
