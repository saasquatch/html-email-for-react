import React, { createContext, useContext } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import parse, { domToReact, HTMLReactParserOptions } from "html-react-parser";
import juice from "juice";
import createDOMPurify from "dompurify";
import type { ConstructorOptions } from "jsdom";
import { getWindow } from "./isomorphicwindow";

const DataContext = createContext<any>(null);

export function useData<T>(): T | null {
  return useContext(DataContext);
}

export type Options<T> = {
  data?: T | null;
  /**
   * Used to customize the `dompurify` instance
   */
  domPurifyOptions?: createDOMPurify.Config;
  /**
   * Used to customize the `html-react-parser` instance
   */
  reactParserOptions?: HTMLReactParserOptions;
  /**
   * Used to customize the `juice` instance
   */
  juiceOptions?: juice.Options;
  /**
   * Used to customize the `jsdom` instance (in node env)
   */
  jsdomOptions?: ConstructorOptions;
};

export function render<T>(
  html: string,
  {
    data = null,
    domPurifyOptions = {},
    reactParserOptions = {},
    juiceOptions = {},
    jsdomOptions = {},
  }: Options<T> = {}
): string {
  if (typeof html !== "string") throw new Error("Html should be a string");

  const window = getWindow(jsdomOptions);
  const DOMPurify = createDOMPurify(window);

  // TODO: Probably a better way to check this. Ideally we could configure DOMPurify to return the document when it has a document, but alas :'(
  const WHOLE_DOCUMENT = html.trimStart().startsWith("<html");
  const clean = DOMPurify.sanitize(html, {
    // Default options
    WHOLE_DOCUMENT,
    USE_PROFILES: { html: true },

    // User options
    ...domPurifyOptions,

    // Non-overidable options
    RETURN_DOM_FRAGMENT: false,
  }) as string;

  // Switch to DOM nodes instead of string?
  const reactElement = parse(clean, reactParserOptions);
  const root = React.createElement(DataContext.Provider, { value: data }, [
    reactElement,
  ]);
  const pimped = renderToStaticMarkup(root);
  const inlined = juice(pimped, juiceOptions);
  return inlined;
}
