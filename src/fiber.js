/**
 * demo2
 * Fiber 实现
 */
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

console.log("element", element); // vDom

// 重写render
function createDom(fiber) {
  // 1. 创建不同类型的DOM节点
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  // 2.为 DOM 节点添加属性props (没有children属性)
  const isProperty = (key) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });

  return dom;
}

let nextUnitOfWork = null;

function render(element, container) {
  // 定义初始工作单元（定义初始Fiber根节点）
  nextUnitOfWork = {
    dom: container, // root
    props: {
      children: [element], // DOM
    },
  };
  console.log("1. 初始 Fiber-->", nextUnitOfWork);
}

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (nextUnitOfWork) {
    requestIdleCallback(workLoop);
  }
}

requestIdleCallback(workLoop);

/**
 * 执行工作单元都做了什么❓
 */
function performUnitOfWork(fiber) {
  // type:div
  //  1. 把元素添加到 dom 中
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  // 2. 当从根 Fiber 向下创建 Fiber 时，我们始终是为子节点创建Fiber
  const elements = fiber.props.children; // 之前的vDOM结构
  let index = 0;
  let prevSibling = null;
  while (index < elements.length) {
    const element = elements[index];
    const newFiber = {
      type: element.type, // div
      props: element.props, //
      dom: null,
      parent: fiber,
    };
    // 第一个子元素 作为 child，其余的 子元素 作为 sibling
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
  console.log("2. 每次执行工作单元后的Fiber树", fiber);

  // 步骤2实现了创建 fiber树的过程 👆👆👆
  // 下面的步骤3实现遍历 fiber的过程 👇👇👇

  // 3. 遍历fiber树，找到下一个工作单元
  if (fiber.child) {
    return fiber.child;
  }
  while (fiber) {
    if (fiber.sibling) {
      return fiber.sibling;
    }
    fiber = fiber.parent;
  }
}

// console.log("3. 完整的fiber树 -> 初始");

const container = document.getElementById("root");
MyReact.render(element, container);
