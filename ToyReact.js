class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
  appendChild(vChild) {
    vChild.mountTo(this.root);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}
class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}
export class Component {
  constructor() {
    this.children = [];
  }
  setAttribute(name, value) {
    this[name] = value;
  }
  mountTo(parent) {
    let vdom = this.render();
    console.log(vdom.root, parent);
    parent.appendChild(vdom.root);
  }
  appendChild(vChild) {
    this.children.push(vChild);
  }
}
export let ToyReact = {
  createElement(type, attr, ...children) {
    console.log(type, typeof type);
    let elem;
    if (typeof type === "string") elem = new ElementWrapper(type);
    else elem = new type();
    for (let name in attr) {
      elem.setAttribute(name, attr[name]);
    }
    let insertChildren = (children) => {
      for (let child of children) {
        if (typeof child === "object" && child instanceof Array) {
          insertChildren(child);
        } else {
          if (
            !(child instanceof Component) &&
            !(child instanceof TextWrapper) &&
            !(child instanceof ElementWrapper)
          )
            child = String(child);
          if (typeof child === "string") child = new TextWrapper(child);
          elem.appendChild(child);
        }
      }
    };
    insertChildren(children);
    return elem;
  },
  render(vdom, elem) {
    console.log(vdom);
    vdom.mountTo(elem);
  },
};
