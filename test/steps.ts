import { Given, Then } from "@cucumber/cucumber";
import { render } from "../dist";
import { assert } from "chai";

//@ts-ignore
import { HtmlDiffer } from "html-differ";
//@ts-ignore
import logger from "html-differ/lib/logger";

class World {
  template?: string;
}

Given("an HTML template with {}", function (this: World, scenario:string, template: string) {
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
  const rendered = render(this.template);

  const htmlDiffer = new HtmlDiffer({});

  const equel = htmlDiffer.isEqual(output, rendered);
  const diff = htmlDiffer.diffHtml(output, rendered);

  const logg = `
      Situation: ${ignored}
      Input: ${this.template}
      Rendered: ${rendered}
      Expected: ${output}
      Diff: ${JSON.stringify(diff)}
  `
  assert.isTrue(equel, logg);

  //   assert.equal(output, rendered, "Render output should match");
});
