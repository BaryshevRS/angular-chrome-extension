export const getTextNodes = (node: ChildNode, result: ChildNode[] = []) => {
  if (node.childNodes.length) {
    for (var i = 0; i < node.childNodes.length; i++) {
      result = getTextNodes(node.childNodes[i], result);
    }
  } else if (node.nodeType === Node.TEXT_NODE) {
    if (!(node.parentNode as HTMLElement).tagName.match(/script|style/i)) {
      result.push(node);
    }
  }

  return result;
};

