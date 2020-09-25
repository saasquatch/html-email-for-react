import React from "react";
import { Given, Then } from "@cucumber/cucumber";
import { Options, render } from "../dist";
import { assert } from "chai";
import * as ts from "typescript";

//@ts-ignore
import { HtmlDiffer } from "html-differ";
//@ts-ignore
import logger from "html-differ/lib/logger";
import { DomElement, HTMLReactParserOptions } from "html-react-parser";

var _eval = require("eval");

class World {
  template?: string;
  options?: Options<unknown>;
}

Given("an HTML template with {}", function (
  this: World,
  scenario: string,
  template: string
) {
  this.template = template;
});

Given("an HTML template", function (this: World, template: string) {
  this.template = template;
});
Given("an HTML template {string}", function (this: World, template: string) {
  this.template = template;
});

Then("the output html is {}", function (
  this: World,
  ignored: unknown,
  output: string
) {
  if (!this.template) throw Error("Need template");
  const rendered = render(this.template, this.options);

  const htmlDiffer = new HtmlDiffer({});

  const equel = htmlDiffer.isEqual(output, rendered);
  const diff = htmlDiffer.diffHtml(output, rendered);

  const logg = `
      Situation: ${ignored}
      Input: ${this.template}
      Rendered: ${rendered}
      Expected: ${output}
      Diff: ${JSON.stringify(diff)}
  `;
  assert.isTrue(equel, logg);

  //   assert.equal(output, rendered, "Render output should match");
});

Given("a React component registered as {string} with source", function (
  this: World,
  componentName: string,
  tsSource: string
) {
  let jsSource = ts.transpile(tsSource, {
    jsx: 2,
    strict: false,
    noEmitOnError: true,
  });
  // console.log(tsSource, "transpiled to", jsSource);

  let Comp: any = _eval(
    `
  var React = require("react");
  module.exports = ${jsSource}
  `,
    "file.example.js",
    { React },
    true
  );

  // console.log("Evaled to", jsSource, " type ", typeof Comp, Comp);
  const domPurifyOptions = {
    ADD_TAGS: [componentName],
  };
  const reactParserOptions: HTMLReactParserOptions = {
    library: React,
    replace: ({ name }: DomElement) => {
      // console.log("Element", element)
      //   throw new Error("Hit the place");
      if (name === componentName) {
        //@ts-ignore
        // return "Hello world" as JSX.Element
        // return React.createElement("div", {}, "Hello world");
        return Comp.apply(this);
      }
    },
  };

  this.options = {
    reactParserOptions,
    domPurifyOptions,
  };
});
