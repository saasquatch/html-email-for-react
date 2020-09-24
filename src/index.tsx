import React, {createContext, useContext} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import parse, { domToReact } from "html-react-parser";
import juice from "juice";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { assert } from "chai";

//@ts-ignore -- jsDom should be compatible
const window: Window = new JSDOM("").window;
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

const DataContext = createContext(null);

export function useData<T>():T|null{
    return useContext(DataContext);
}

export function render(html: string, data?:unknown) {
  if(!html) return null;
  assert(typeof html === "string","Html should be a string");

  // TODO: Probably a better way to check this. Ideally we could configure DOMPurify to return the document when it has a document, but alas :'(
  const WHOLE_DOCUMENT = html.trimStart().startsWith("<html");
  const clean = DOMPurify.sanitize(html, {
    WHOLE_DOCUMENT,
    USE_PROFILES: { html: true },
  });
  const reactElement = parse(clean, options);
  // @ts-ignore
  const root = React.createElement(DataContext.Provider, {value:data}, [reactElement]);
  const pimped = renderToStaticMarkup(root);
  const inlined = juice(pimped);
  return inlined;
}

// const html = `
//   <p id="main">
//   <style>.prettify{color:red;}</style>
//     <span class="prettify">
//       keep me and make me pretty!
//     </span>
//   </p>
// `;
// console.log(render(html));
