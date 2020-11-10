# HTML Email for React

An HTML processor that makes it easy to enrich HTML templates with rich React components.

 - Sanitizes dirty HTML templates ([dompurify](https://www.npmjs.com/package/dompurify))
 - Inlines CSS ([juice](https://www.npmjs.com/package/juice))
 - Support "Web Component" style React components ([html-react-parser](https://www.npmjs.com/package/html-react-parser))

## Philosophy

_The problem_ with writing good emails is combining the static parts and the dynamic parts.

- The static parts have a rich history powered by libraries like [MJML](https://mjml.io/), vendors like Mailchimp and [open source raw HTML templates](https://github.com/leemunroe/responsive-html-email-template)
- The dynamic parts are steeped in template languages like liquid, handlebars, mustache and more.
- Whole companies are dedicated to [re-building emails using JSON as the storage layer](https://beefree.io/).

**The best part about emails is the HTML**. Stop getting rid of it, and start building on it.

 1) Write emails as HTML (or use any number of great starter templates)
 2) Enhance the dynamic parts with React

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
// NOTE: Html components are CASE-InSeNsItIvE and React names are case sensitive
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
    <div>Hello Jorghan</div>
  </body>
</html>
*/
```

The great part of this is that it brings the portable web-component method of building components and allows you to build dynamic components using React.

### More Examples

- [Components (with props, children, nesting)](test/Components.feature)
- [CSS Inlining](test/CSSInlining.feature)
- [Plain HTML support](test/PlainHTML.feature)

## Inspiration

Inspired by [StencilJS](https://stenciljs.com/). I'd love to use Stencil components in emails directly, but email HTML is fickle and doesn't support custom web components.


## Why not MJML?

[MJML](https://mjml.io/) is a a great language, but it does __too much__ and __too little__.

__Too Much:__

 - Requires the entire template to be written in MJML
 - Doesn't support progressive enhancement of templates by mixing in MJML into HTML

__Too little:__

 - Doesn't support passing data into nested components.
 - Requires a separate template language (Vue, Liquid, Handlebars, etc.) to render dynamic elements

__Benefits of React HTML for Email__
 
 - Uses the existing HTML tooling ecosystem.
 - Single system for rich components (React). Good for React-focused teams.
 - Modular: Render sub-templates and sub-components for parts of an email.