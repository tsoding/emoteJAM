const LOREM: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

type Child = string | HTMLElement;
// TODO(#73): make tag more typesafe
// Essentially get rid of the `any`
type Tag = any;

function tag(name: string, ...children: Child[]): Tag {
    const result: Tag = document.createElement(name);
    for (const child of children) {
        if (typeof(child) === 'string') {
            result.appendChild(document.createTextNode(child));
        } else {
            result.appendChild(child);
        }
    }

    result.att$ = function(name: string, value: string) {
        this.setAttribute(name, value);
        return this;
    };


    result.onclick$ = function(callback: (this: GlobalEventHandlers, ev: MouseEvent) => Tag) {
        this.onclick = callback;
        return this;
    };

    return result;
}

function canvas(...children: Child[]): Tag {
    return tag("canvas", ...children);
}

function h1(...children: Child[]): Tag {
    return tag("h1", ...children);
}

function h2(...children: Child[]): Tag {
    return tag("h2", ...children);
}

function h3(...children: Child[]): Tag {
    return tag("h3", ...children);
}

function p(...children: Child[]): Tag {
    return tag("p", ...children);
}

function a(...children: Child[]): Tag {
    return tag("a", ...children);
}

function div(...children: Child[]): Tag {
    return tag("div", ...children);
}

function span(...children: Child[]): Tag {
    return tag("span", ...children);
}

function select(...children: Child[]): Tag {
    return tag("select", ...children);
}


function img(src: string): Tag {
    return tag("img").att$("src", src);
}

function input(type: string): Tag {
    return tag("input").att$("type", type);
}

interface Routes {
    [route: string]: Tag
}

function router(routes: Routes): Tag {
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
            result.removeChild(result.lastChild);
        }
        result.appendChild(routes[hashLocation]);

        return result;
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);

    return result;
}
