import { Given, Then } from "@cucumber/cucumber";
import { render } from "../dist";
import { assert } from "chai";

class World {
  template?: string;
}

Given("an HTML template", function (this: World, docString:string) {
  this.template = docString;
});

Then("the output html is {}", function (
  this: World,
  ignored: unknown,
  output: string
) {
  if (!this.template) throw Error("Need template");
  const rendered = render(this.template);

  assert.equal(output, rendered, "Render output should match");
});
