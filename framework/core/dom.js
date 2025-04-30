/**
 * Mini-Framework DOM Module
 * Handles virtual DOM creation, diffing and patching
 */

// Create a virtual DOM element
export function createElement(tag, attrs = {}, ...children) {
  // Flatten nested arrays of children
  const flatChildren = children.flat().filter((child) => child !== null && child !== undefined)

  return {
    tag,
    attrs,
    children: flatChildren.map((child) => (typeof child === "object" ? child : createTextNode(child))),
  }
}

// Create a text node
export function createTextNode(text) {
  return {
    tag: "TEXT_ELEMENT",
    attrs: {},
    children: [],
    value: text,
  }
}

// Render virtual DOM to real DOM
export function render(vNode, container) {
  // Clear the container first
  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }

  // Create and append the new DOM tree
  const domNode = createDomNode(vNode)
  container.appendChild(domNode)

  return domNode
}

// Create a real DOM node from virtual node
function createDomNode(vNode) {
  if (vNode.tag === "TEXT_ELEMENT") {
    return document.createTextNode(vNode.value)
  }

  const element = document.createElement(vNode.tag)

  // Set attributes
  Object.entries(vNode.attrs).forEach(([name, value]) => {
    if (name.startsWith("on")) {
      // Handle event listeners
      const eventName = name.toLowerCase().substring(2)
      element.addEventListener(eventName, value)
    } else if (name === "className") {
      // Handle className -> class conversion
      element.setAttribute("class", value)
    } else if (name === "style" && typeof value === "object") {
      // Handle style objects
      Object.entries(value).forEach(([prop, val]) => {
        element.style[prop] = val
      })
    } else {
      // Handle regular attributes
      element.setAttribute(name, value)
    }
  })

  // Append children
  vNode.children.forEach((child) => {
    element.appendChild(createDomNode(child))
  })

  return element
}

// Create a component
export function createComponent(renderFn, initialState = {}) {
  let state = { ...initialState }
  let updateFn = null

  function setState(newState) {
    state = { ...state, ...newState }
    if (updateFn) {
      updateFn()
    }
  }

  function getState() {
    return state
  }

  function render(props = {}) {
    return renderFn({ ...props, state, setState })
  }

  function mount(container, props = {}) {
    const vNode = render(props)
    const domNode = render(vNode, container)

    updateFn = () => {
      const newVNode = render(props)
      const newDomNode = render(newVNode, container)
      domNode.replaceWith(newDomNode)
    }

    return {
      update: updateFn,
      unmount: () => {
        while (container.firstChild) {
          container.removeChild(container.firstChild)
        }
      },
    }
  }

  return {
    render,
    mount,
    setState,
    getState,
  }
}
