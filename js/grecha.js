"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
function tag(name) {
    var children = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        children[_i - 1] = arguments[_i];
    }
    var result = document.createElement(name);
    for (var _a = 0, children_1 = children; _a < children_1.length; _a++) {
        var child = children_1[_a];
        if (typeof child === 'string') {
            result.appendChild(document.createTextNode(child));
        }
        else {
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
function canvas() {
    var children = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        children[_i] = arguments[_i];
    }
    return tag.apply(void 0, __spreadArray(["canvas"], children, false));
}
function h1() {
    var children = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        children[_i] = arguments[_i];
    }
    return tag.apply(void 0, __spreadArray(["h1"], children, false));
}
function h2() {
    var children = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        children[_i] = arguments[_i];
    }
    return tag.apply(void 0, __spreadArray(["h2"], children, false));
}
function h3() {
    var children = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        children[_i] = arguments[_i];
    }
    return tag.apply(void 0, __spreadArray(["h3"], children, false));
}
function p() {
    var children = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        children[_i] = arguments[_i];
    }
    return tag.apply(void 0, __spreadArray(["p"], children, false));
}
function a() {
    var children = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        children[_i] = arguments[_i];
    }
    return tag.apply(void 0, __spreadArray(["a"], children, false));
}
function div() {
    var children = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        children[_i] = arguments[_i];
    }
    return tag.apply(void 0, __spreadArray(["div"], children, false));
}
function span() {
    var children = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        children[_i] = arguments[_i];
    }
    return tag.apply(void 0, __spreadArray(["span"], children, false));
}
function select() {
    var children = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        children[_i] = arguments[_i];
    }
    return tag.apply(void 0, __spreadArray(["select"], children, false));
}
function img(src) {
    return tag("img").att$("src", src);
}
function input(type) {
    return tag("input").att$("type", type);
}
function router(routes) {
    var result = div();
    function syncHash() {
        var hashLocation = document.location.hash.split('#')[1];
        if (!hashLocation) {
            hashLocation = '/';
        }
        if (!(hashLocation in routes)) {
            var route404 = '/404';
            console.assert(route404 in routes);
            hashLocation = route404;
        }
        while (result.firstChild) {
            result.removeChild(result.lastChild);
        }
        result.appendChild(routes[hashLocation]);
        return result;
    }
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return result;
}
