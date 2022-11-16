const LOREM: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

interface IntrinsicElements {
  canvas: HTMLCanvasElement,
  h1: HTMLHeadingElement,
  h2: HTMLHeadingElement,
  h3: HTMLHeadingElement,
  p: HTMLParagraphElement,
  a: HTMLAnchorElement,
  div: HTMLDivElement,
  span: HTMLSpanElement,
  img: HTMLImageElement,
  input: HTMLInputElement,
  select: HTMLSelectElement,
}

type ElementType<P = any> = {
  [K in keyof IntrinsicElements]: P extends IntrinsicElements[K] ? K : never;
}[keyof IntrinsicElements];

type Child = string | HTMLElement;
type Tag<TElement extends Element = HTMLElement> = TElement & {
  att$(this: Tag<TElement>, name: string, value: string): Tag<TElement>,
  onclick$(
    this: Tag<TElement>,
    callback: (this: GlobalEventHandlers, ev: MouseEvent) => Tag<TElement>
  ): Tag,
  [handler: `${string}$`]: (...args: any[]) => any;
};

function tag<T extends keyof IntrinsicElements>(
  name: T,
  ...children: Child[]
): Tag<IntrinsicElements[T]> {
  const result = document.createElement(name as string) as Tag<IntrinsicElements[T]>;
  for (const child of children) {
    if (typeof child === 'string') {
      result.appendChild(document.createTextNode(child));
    } else {
      result.appendChild(child);
    }
  }

  result.att$ = function (name, value) {
    this.setAttribute(name, value);
    return this;
  };

  result.onclick$ = function (callback) {
    this.onclick = callback;
    return this;
  };

  return result;
}

function canvas(...children: Child[]) {
  return tag("canvas", ...children);
}

function h1(...children: Child[]) {
  return tag("h1", ...children);
}

function h2(...children: Child[]) {
  return tag("h2", ...children);
}

function h3(...children: Child[]) {
  return tag("h3", ...children);
}

function p(...children: Child[]) {
  return tag("p", ...children);
}

function a(...children: Child[]) {
  return tag("a", ...children);
}

function div(...children: Child[]) {
  return tag("div", ...children);
}

function span(...children: Child[]) {
  return tag("span", ...children);
}

function select(...children: Child[]) {
  return tag("select", ...children);
}

function img(src: string) {
  return tag("img").att$("src", src);
}

function input(type: string) {
  return tag("input").att$("type", type);
}

interface Routes {
  [route: string]: Tag<HTMLDivElement>
}

function router(routes: Routes) {
  let result = div();

  function syncHash() {
    let hashLocation = document.location.hash.split('#')[1];
    if (!hashLocation) {
      hashLocation = '/';
    }

    if (!(hashLocation in routes)) {
      const route404 = '/404';
      console.assert(route404 in routes);
      hashLocation = route404;
    }

    while (result.firstChild) {
      // Type-safety: `lastChild` can never be `null` if `firstChild` is present,
      // since it will only be `null` if `result` has no child elements.
      result.removeChild(result.lastChild!);
    }
    result.appendChild(routes[hashLocation]);

    return result;
  }

  syncHash();
  window.addEventListener('hashchange', syncHash);

  return result;
}
