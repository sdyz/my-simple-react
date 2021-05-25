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

// 递归调用 createElement
const element = createElement(
  "div",
  {
    id: "foo",
  },
  createElement("a", null, "bar"),
  createElement("b", null)
);

console.log("vDom", element); // 返回 vDom 结构

// {
//   type: "div",
//   props: {
//     children: [
//       {
//         type: "a",
//         props: {
//           children: [
//             {
//               type: "TEXT_ELEMENT",
//               props: {
//                 children: [],
//                 nodeValue: "bar",
//               },
//             },
//           ],
//         },
//       },
//       {
//         type: "b",
//         props: {
//           children: [],
//         },
//       },
//     ],
//   },
// };
