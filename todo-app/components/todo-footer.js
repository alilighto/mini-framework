/**
 * TodoMVC Footer Component
 */

import { createElement as h } from "../../framework/index.js"
import { Link } from "../../framework/core/router.js"

export function createTodoFooter(props) {
  const { count, completedCount, filter, onClearCompleted } = props

  if (count === 0 && completedCount === 0) {
    return null
  }

  const itemWord = count === 1 ? "item" : "items"

  return h("footer", { className: "footer" }, [
    h("span", { className: "todo-count" }, [h("strong", {}, count), ` ${itemWord} left`]),

    h("ul", { className: "filters" }, [
      h("li", {}, [
        Link({
          to: "/",
          className: filter === "all" ? "selected" : "",
          children: "All",
        }),
      ]),
      h("li", {}, [
        Link({
          to: "/active",
          className: filter === "active" ? "selected" : "",
          children: "Active",
        }),
      ]),
      h("li", {}, [
        Link({
          to: "/completed",
          className: filter === "completed" ? "selected" : "",
          children: "Completed",
        }),
      ]),
    ]),

    completedCount > 0
      ? h(
        "button",
        {
          className: "clear-completed",
          onClick: onClearCompleted,
        },
        "Clear completed",
      )
      : null,
  ])
}
