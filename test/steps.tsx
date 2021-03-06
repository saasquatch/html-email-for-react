import React from "react";
import { Given, Then } from "@cucumber/cucumber";
import { assert } from "chai";
import * as ts from "typescript";

//@ts-ignore
import { HtmlDiffer } from "html-differ";

import { Options, render, useData, raw } from "../dist";

var _eval = require("eval");

class World {
  template?: string;
  options?: Options<unknown>;
  imports?: { [key: string]: unknown };
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
  output: string = ""
) {
  if (!this.template) throw Error("Need template");
  const rendered = render(this.template, this.options);

  if(output && output.trim() !== ""){
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
  }else{
    assert.isEmpty(rendered, "Should be empty")
    // Don't diff empty strings
  }


  //   assert.equal(output, rendered, "Render output should match");
});

Given("a React component registered as {string} with source", function (
  this: World,
  componentName: string,
  tsSource: string
) {
  let jsSource = ts.transpile(tsSource, {
    jsx: ts.JsxEmit.React,
    target: ts.ScriptTarget.ES2020,
    strict: false,
    noEmitOnError: true,
  });
  // console.log(tsSource, "transpiled to", jsSource);

  let Comp: any = _eval(
    `
    module.exports = ${jsSource}
    `,
    "file.example.js",
    this.imports,
    true
  );

  // console.log("Evaled to", jsSource, " type ", typeof Comp, Comp);
  const components = {
    [componentName]: Comp,
  };

  this.options = {
    components: {
      ...this.options?.components,
      ...components,
    },
  };
  // console.log("Components", this.options);
});

Given("{string} is imported from {string}", function (
  this: World,
  variable: string,
  module: string
) {
  this.imports = {
    React,
    useData,
    raw
  };
});

Given("global data", function (this: World, dataString: string) {
  // Write code here that turns the phrase above into concrete actions
  this.options = {
    ...this.options,
    data: JSON.parse(dataString),
  };
});
