/**
 * Mini-Framework Helper Functions
 */

import { createElement } from "../core/dom.js"

// Shorthand for createElement
export function h(tag, attrs, ...children) {
  return createElement(tag, attrs, ...children)
}
