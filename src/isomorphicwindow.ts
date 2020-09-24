import { ConstructorOptions } from "jsdom";

/**
 * Return the browser window (in a browser environment / if it exists globally)
 * 
 * Returns a jsDom window (in a node environment)
 * 
 * @param jsdomOptions - options used to create a jsom dome
 * @returns the current window, or a new jsDom window
 */
export function getWindow(jsdomOptions: ConstructorOptions):Window {
  return typeof window !== "undefined"
    ? window
    : (() => {
        const JSDOM = require("jsdom").JSDOM;
        return new JSDOM("", jsdomOptions).window;
      })();
}
