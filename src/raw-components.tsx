import React, { useContext } from "react";
import ReactDOMServer from "react-dom/server";
import { tags } from "./tags";

type Contexts = React.Context<unknown>[];
export const MetaContext = React.createContext<Contexts>([]);

type JSXInEl = JSX.IntrinsicElements;

type Props<Tag extends SupportedTag> = {
  as: Tag;
  renderer?: typeof ReactDOMServer.renderToStaticMarkup;
  createElement?: typeof React.createElement;
} & PropsOf<Tag>;

export function RawHTMLWrapper<Tag extends SupportedTag>({
  as,
  children = [],
  renderer = ReactDOMServer.renderToStaticMarkup,
  createElement = React.createElement,
  ...rest
}: Props<Tag>) {
  const contexts = useContext(MetaContext);
  const values = contexts.map((c) => useContext(c));

  const toHtml = (value: React.ReactNode) => {
    if (typeof value !== "string") {
      const element = contexts.reduce((el, c, idx) => {
        return <c.Provider value={values[idx]}>{el}</c.Provider>;
      }, value);
      return renderer(
        <MetaContext.Provider value={contexts}>{element}</MetaContext.Provider>
      );
    } else {
      return value;
    }
  };

  let dangerousInnerHTML;
  if (Array.isArray(children)) {
    dangerousInnerHTML = children.map(toHtml).join("");
  } else {
    dangerousInnerHTML = toHtml(children);
  }

  const props = {
    ...rest,
    dangerouslySetInnerHTML: { __html: dangerousInnerHTML },
  };
  return createElement(as, props);
}

type TagList = typeof tags;

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
type SupportedTag = ArrayElement<TagList> & keyof JSXInEl;
type PropsOf<Tag extends SupportedTag> = JSXInEl[Tag];

type ComponentOf<Tag extends SupportedTag> = (
  props: PropsOf<Tag>
) => React.ReactNode;

function reducer<Tag extends SupportedTag>(acc: Partial<StyledTags>, el: Tag) {
  const Componet: ComponentOf<Tag> = ({ children, ...rest }) => (
    <RawHTMLWrapper as={el} {...rest}>
      {children}
    </RawHTMLWrapper>
  );
  return { ...acc, [el]: Componet };
}

export const raw: StyledTags = tags.reduce(reducer, {}) as StyledTags;

export interface StyledTags {
  /**
   * @desc
   * HTML tags
   */
  a: ComponentOf<"a">;
  abbr: ComponentOf<"abbr">;
  address: ComponentOf<"address">;
  area: ComponentOf<"area">;
  article: ComponentOf<"article">;
  aside: ComponentOf<"aside">;
  audio: ComponentOf<"audio">;
  b: ComponentOf<"b">;
  base: ComponentOf<"base">;
  bdi: ComponentOf<"bdi">;
  bdo: ComponentOf<"bdo">;
  big: ComponentOf<"big">;
  blockquote: ComponentOf<"blockquote">;
  body: ComponentOf<"body">;
  br: ComponentOf<"br">;
  button: ComponentOf<"button">;
  canvas: ComponentOf<"canvas">;
  caption: ComponentOf<"caption">;
  cite: ComponentOf<"cite">;
  code: ComponentOf<"code">;
  col: ComponentOf<"col">;
  colgroup: ComponentOf<"colgroup">;
  data: ComponentOf<"data">;
  datalist: ComponentOf<"datalist">;
  dd: ComponentOf<"dd">;
  del: ComponentOf<"del">;
  details: ComponentOf<"details">;
  dfn: ComponentOf<"dfn">;
  dialog: ComponentOf<"dialog">;
  div: ComponentOf<"div">;
  dl: ComponentOf<"dl">;
  dt: ComponentOf<"dt">;
  em: ComponentOf<"em">;
  embed: ComponentOf<"embed">;
  fieldset: ComponentOf<"fieldset">;
  figcaption: ComponentOf<"figcaption">;
  figure: ComponentOf<"figure">;
  footer: ComponentOf<"footer">;
  form: ComponentOf<"form">;
  h1: ComponentOf<"h1">;
  h2: ComponentOf<"h2">;
  h3: ComponentOf<"h3">;
  h4: ComponentOf<"h4">;
  h5: ComponentOf<"h5">;
  h6: ComponentOf<"h6">;
  head: ComponentOf<"head">;
  header: ComponentOf<"header">;
  hgroup: ComponentOf<"hgroup">;
  hr: ComponentOf<"hr">;
  html: ComponentOf<"html">;
  i: ComponentOf<"i">;
  iframe: ComponentOf<"iframe">;
  img: ComponentOf<"img">;
  input: ComponentOf<"input">;
  ins: ComponentOf<"ins">;
  kbd: ComponentOf<"kbd">;
  keygen: ComponentOf<"keygen">;
  label: ComponentOf<"label">;
  legend: ComponentOf<"legend">;
  li: ComponentOf<"li">;
  link: ComponentOf<"link">;
  main: ComponentOf<"main">;
  map: ComponentOf<"map">;
  mark: ComponentOf<"mark">;
  /**
   * @desc
   * marquee tag is not supported by @types/react
   */
  // 'marquee': ComponentOf<'marquee'>;
  menu: ComponentOf<"menu">;
  menuitem: ComponentOf<"menuitem">;
  meta: ComponentOf<"meta">;
  meter: ComponentOf<"meter">;
  nav: ComponentOf<"nav">;
  noscript: ComponentOf<"noscript">;
  object: ComponentOf<"object">;
  ol: ComponentOf<"ol">;
  optgroup: ComponentOf<"optgroup">;
  option: ComponentOf<"option">;
  output: ComponentOf<"output">;
  p: ComponentOf<"p">;
  param: ComponentOf<"param">;
  picture: ComponentOf<"picture">;
  pre: ComponentOf<"pre">;
  progress: ComponentOf<"progress">;
  q: ComponentOf<"q">;
  rp: ComponentOf<"rp">;
  rt: ComponentOf<"rt">;
  ruby: ComponentOf<"ruby">;
  s: ComponentOf<"s">;
  samp: ComponentOf<"samp">;
  script: ComponentOf<"script">;
  section: ComponentOf<"section">;
  select: ComponentOf<"select">;
  small: ComponentOf<"small">;
  source: ComponentOf<"source">;
  span: ComponentOf<"span">;
  strong: ComponentOf<"strong">;
  style: ComponentOf<"style">;
  sub: ComponentOf<"sub">;
  summary: ComponentOf<"summary">;
  sup: ComponentOf<"sup">;
  table: ComponentOf<"table">;
  tbody: ComponentOf<"tbody">;
  td: ComponentOf<"td">;
  textarea: ComponentOf<"textarea">;
  tfoot: ComponentOf<"tfoot">;
  th: ComponentOf<"th">;
  thead: ComponentOf<"thead">;
  time: ComponentOf<"time">;
  title: ComponentOf<"title">;
  tr: ComponentOf<"tr">;
  track: ComponentOf<"track">;
  u: ComponentOf<"u">;
  ul: ComponentOf<"ul">;
  var: ComponentOf<"var">;
  video: ComponentOf<"video">;
  wbr: ComponentOf<"wbr">;

  /**
   * @desc
   * SVG tags
   */
  circle: ComponentOf<"circle">;
  clipPath: ComponentOf<"clipPath">;
  defs: ComponentOf<"defs">;
  ellipse: ComponentOf<"ellipse">;
  foreignObject: ComponentOf<"foreignObject">;
  g: ComponentOf<"g">;
  image: ComponentOf<"image">;
  line: ComponentOf<"line">;
  linearGradient: ComponentOf<"linearGradient">;
  mask: ComponentOf<"mask">;
  path: ComponentOf<"path">;
  pattern: ComponentOf<"pattern">;
  polygon: ComponentOf<"polygon">;
  polyline: ComponentOf<"polyline">;
  radialGradient: ComponentOf<"radialGradient">;
  rect: ComponentOf<"rect">;
  stop: ComponentOf<"stop">;
  svg: ComponentOf<"svg">;
  text: ComponentOf<"text">;
  tspan: ComponentOf<"tspan">;
}
