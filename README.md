# HTML Email for React

_The problem_ with writing good emails is combining the static parts and the dynamic parts.

- The static parts have a rich history powered by libraries like [MJML](https://mjml.io/), vendors like Mailchimp and [open source raw HTML templates](https://github.com/leemunroe/responsive-html-email-template)
- The dynamic parts are steeped in template languages like liquid, handlebars, mustache and more.
- Whole companies are dedicated to [re-building emails using JSON as the storage layer](https://beefree.io/).

**The best part about emails is the HTML**. Stop getting rid of it, and start building on it.

## Example

```js
import React from "react";
import { render, useData } from "html-email-for-react";

const html = `
<html>
  <body>
    <my-component></my-component>
  </body>
</html>
`;

function MyComponent() {
  const { name } = useData();
  return <div>Hello {name}</div>;
}
// NOTE: Html components are CASE-InSeNsItIvE and React are not
// So use lowercase component names (see customElements.define)
const components = {
  "my-component": MyComponent,
};
const data = {
  name: "Jorghan",
};
console.log(render(html, { components, data }));
/*
Returns:

<html>
  <body>
    <div>Hello world</div>
  </body>
</html>
*/
```

The great part of this is that it brings the portable web-component method of building components and allows you to.

### More Examples

- [Components (with props, children, nesting)](test/Components.feature)
- [CSS Inlining](test/CSSInlining.feature)
- [Plain HTML support](test/PlainHTML.feature)

### Inspiration

Inspired by [StencilJS](https://stenciljs.com/). I'd love to use Stencil components in emails directly, but email HTML is fickle and doesn't support the extra components added from standard web components.
