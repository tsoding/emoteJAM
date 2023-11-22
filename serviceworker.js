"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var assets = [
    '/index.html',
    '/css/bright.css',
    '/css/main.css',
    '/css/reset.css',
    '/gif.js',
    '/gif.worker.js',
    '/img/tsodinClown.png',
    '/js/eval.js',
    '/js/filters.js',
    '/js/grecha.js',
    '/js/index.js',
];
self.addEventListener("install", function (e) {
    var event = e;
    event.waitUntil((function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, assets_1, asset, cache, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, assets_1 = assets;
                    _a.label = 1;
                case 1:
                    if (!(_i < assets_1.length)) return [3, 5];
                    asset = assets_1[_i];
                    return [4, caches.open("v1")];
                case 2:
                    cache = _a.sent();
                    console.log("Caching " + asset + "...");
                    return [4, fetch(asset)];
                case 3:
                    response = _a.sent();
                    cache.put(asset, response.clone());
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3, 1];
                case 5: return [2];
            }
        });
    }); })());
});
self.addEventListener("fetch", function (e) {
    var event = e;
    if (!navigator.onLine) {
        event.respondWith(caches.match(event.request.url).then(function (response) {
            if (response !== undefined) {
                return response;
            }
            var headers = new Headers();
            headers.append("Content-Type", "text/html");
            return new Response("<h1>You are offline! LoooooLL!!11 4HEad</h1>", {
                status: 200,
                headers: headers
            });
        }));
    }
    else {
        event.respondWith((function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, cache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, fetch(event.request)];
                    case 1:
                        response = _a.sent();
                        return [4, caches.open("v1")];
                    case 2:
                        cache = _a.sent();
                        cache.put(event.request.url, response.clone());
                        return [2, response];
                }
            });
        }); })());
    }
});
