// import React from "react";
// import ReactDOM from "react-dom";

// const element = <h1 title="foo">Hello</h1>;
// const container = document.getElementById("root");
// ReactDOM.render(element, container);

/**
 * demo1
 * 实现 createElement()、render() 方法
 */
const MyReact = {
  createElement,
  render,
};

/** @jsx MyReact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function render(element, container) {
  // 1. 创建不同类型的DOM节点
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  // 2.为 DOM 节点添加属性props (没有children属性)
  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });

  // 3. 遍历children，递归调用 render
  element.props.children.forEach((child) => render(child, dom));

  // 4. 将 DOM 节点添加至 root 根节点
  container.appendChild(dom);
}

console.log("createElement 返回：", element);

const container = document.getElementById("root");

MyReact.render(element, container);
