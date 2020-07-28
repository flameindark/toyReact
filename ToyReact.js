class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    if(name.match(/^on([\s\S]+)$/)) {
      let eventName = RegExp.$1.replace(/^[\s\S]/, s => s.toLowerCase())
      this.root.addEventListener(eventName, value)
    }
    if(name === 'className') 
      name = "class"
    this.root.setAttribute(name, value);
  }
  appendChild(vChild) {
    let range = document.createRange()
    if(this.root.children.length) {
      range.setStartAfter(this.root.lastChild)
      range.setEndAfter(this.root.lastChild)
    } else {
      range.setStart(this.root, 0)
      range.setEnd(this.root, 0)
    }
    vChild.mountTo(range)
  }
  mountTo(range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}
class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
  }
  mountTo(range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}
export class Component {
  constructor() {
    this.children = [];
    this.props = Object.create(null)
  }
  setAttribute(name, value) {
    this.props[name] = value
    this[name] = value;
  }
  setState(state) {
    let merge = (oldState, newState) => {
      for(let p in newState) {
        if(typeof newState[p] === "object") {
          if(typeof oldState[p] !== "object") {
            oldState[p] = {}
          }
          merge(oldState[p], newState[p])
        } else {
          oldState[p] = newState[p]
        }
      }
    }
    if(!this.state && state) 
      this.state = {}
    merge(this.state, state)
    this.update()
  }
  mountTo(range) {
    this.range = range
    this.update()
  }
  update() {
    let placeholder = document.createComment("placeholder");
    let range = document.createRange();
    range.setStart(this.range.endContainer, this.range.endOffset);
    range.setEnd(this.range.endContainer, this.range.endOffset);
    range.insertNode(placeholder);
    this.range.deleteContents();
    let vdom = this.render();
    vdom.mountTo(this.range);
  }
  appendChild(vChild) {
    this.children.push(vChild);
  }
}
export let ToyReact = {
  createElement(type, attr, ...children) { 
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
    let range = document.createRange()
    if(elem.children.length) {
      range.setStartAfter(elem.lastChild)
      range.setEndAfter(elem.firstChild)
    } else {
      range.setStartAfter(elem, 0)
      range.setEndAfter(elem, 0)
    }
    vdom.mountTo(range);
  },
};
