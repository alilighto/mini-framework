

export function jsx(tag, props, ...children) {
  const processedChildren = children.flat().map((child) => {
    if (typeof child === "string" || typeof child === "number") {
      return {
        type: "text",
        value: child,
        ref : null
      };
    }
    return child;
  });

  return {
    tag,
    props: props || {},
    children: processedChildren,
    ref : null
  };
}