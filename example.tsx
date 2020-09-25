import React from "react";
import { DomElement } from "html-react-parser";

function MyComponent() {
  return <div>Hello world</div>;
}

const options = {
  replace: ({ type }: DomElement) => {
    if (type === "my-component") {
      return <MyComponent />;
    }
  },
};
