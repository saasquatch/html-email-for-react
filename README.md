# HTML Email for React

_The problem_ with writing good emails is combining the static parts and the dynamic parts.

- The static parts have a rich history powered by libraries like [MJML](https://mjml.io/), vendors like Mailchimp and [open source raw HTML templates](https://github.com/leemunroe/responsive-html-email-template)
- The dynamic parts are steeped in template languages like liquid, handlebars, mustache and more.
- Whole companies are dedicated to [re-building emails using JSON as the storage layer](https://beefree.io/).

**The best part about emails is the HTML**. Stop getting rid of it, and start building on it.

### HTML Emails with React parts

Given a React component registered as `<my-component>` with source

```js
function MyComponent() {
  return <div>Hello world</div>;
}
```

And an HTML email template

```html
<html>
  <body>
    <my-component></my-component>
  </body>
</html>
```

Then the output html will be

```html
<html>
  <body>
    <div>Hello world</div>
  </body>
</html>
```

```js
import React from "react";
import { render } from "html-email-for-react";

const html = `
<html>
  <body>
    <my-component></my-component>
  </body>
</html>
`;

function MyComponent() {
  return <div>Hello world</div>;
}
const reactParserOptions = {
  replace: ({ attribs, children }) => {
    if (!attribs) return;

    if (attribs.tagName === "my-component") {
      return <MyComponent />;
    }
  },
};

console.log(render(html,{reactParserOptions}));
```

The great part of this is that it brings the portable web-component method of building components and allows you to.

### Inspiration

Inspired by [StencilJS](https://stenciljs.com/). I'd love to use Stencil components in emails directly, but email HTML is fickle and doesn't support the extra components added from standard web components.
