import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import parse, { domToReact } from "html-react-parser";
import juice from "juice";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

//@ts-ignore -- jsDom should be compatible
const window:Window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);



const options = {
  //   replace: ({ attribs, children }) => {
  // if (!attribs) return;
  // if (attribs.id === 'main') {
  //   return <h1 style={{ fontSize: 42 }}>{domToReact(children, options)}</h1>;
  // }
  // if (attribs.class === 'prettify') {
  //   return (
  //     <span style={{ color: 'hotpink' }}>
  //       {domToReact(children, options)}
  //     </span>
  //   );
  // }
  //   },
};

export function render(html: string) {
  const clean = DOMPurify.sanitize(html);
  const reactElement = parse(clean, options);
  // @ts-ignore
  const pimped = renderToStaticMarkup(reactElement);
  const inlined = juice(pimped);
  return inlined;
}

const html = `
  <p id="main">
  <style>.prettify{color:red;}</style>
    <span class="prettify">
      keep me and make me pretty!
    </span>
  </p>
`;
console.log(render(html));

export const foo = "bar";
