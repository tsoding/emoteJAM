"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FileFetcher = (function () {
    function FileFetcher(directory, file, extension) {
        var validDirRegex = /\/?[A-Za-z\-\_\.]+\/?/;
        var validFileRegex = /[A-Za-z\-\_\.]+/;
        var validExtensionRegex = /\.?[A-Za-z]+/;
        if (!validDirRegex.test(directory)) {
            throw new Error("Invalid Directory String:\"" + directory + "\"");
        }
        if (!validFileRegex.test(file)) {
            throw new Error("Invalid File String:\"" + directory + "\"");
        }
        if (!validExtensionRegex.test(extension)) {
            throw new Error("Invalid Extension String:\"" + directory + "\"");
        }
        if (!directory.endsWith("/")) {
            directory += "/";
        }
        if (!extension.startsWith(".")) {
            extension = "." + extension;
        }
        this.path = directory + file + extension;
    }
    FileFetcher.prototype.FetchFile = function () {
        var req = new XMLHttpRequest();
        req.open("GET", this.path, false);
        req.send(null);
        return {
            response: req.response,
            status: req.status,
            type: req.responseType
        };
    };
    FileFetcher.prototype.FetchFileAsync = function () {
        return fetch(this.path);
    };
    return FileFetcher;
}());
var VertexShaderFetcher = (function (_super) {
    __extends(VertexShaderFetcher, _super);
    function VertexShaderFetcher(shaderName) {
        return _super.call(this, "shaders", shaderName, ".vert") || this;
    }
    VertexShaderFetcher.prototype.GetShader = function () {
        var response = this.FetchFile();
        if (response.status != 200) {
            throw new Error("Request returned with code: " + response.status);
        }
        if (response.type != "text" && response.type != "") {
            throw new Error("Response type error: Expected \"text\" but got \"" + response.type + "\"");
        }
        return response.response;
    };
    VertexShaderFetcher.prototype.GetShaderAsync = function () {
        return this.FetchFileAsync().then(function (value) {
            if (!value.ok) {
                Promise.reject("Response was not OK");
            }
            return value.text();
        });
    };
    return VertexShaderFetcher;
}(FileFetcher));
var FragmentShaderFetcher = (function (_super) {
    __extends(FragmentShaderFetcher, _super);
    function FragmentShaderFetcher(shaderName) {
        return _super.call(this, "shaders", shaderName, ".frag") || this;
    }
    FragmentShaderFetcher.prototype.GetShader = function () {
        var response = this.FetchFile();
        if (response.status != 200) {
            throw new Error("Request returned with code: " + response.status);
        }
        if (response.type != "text" && response.type != "") {
            throw new Error("Response type error: Expected \"text\" but got \"" + response.type + "\"");
        }
        return response.response;
    };
    FragmentShaderFetcher.prototype.GetShaderAsync = function () {
        return this.FetchFileAsync().then(function (value) {
            if (!value.ok) {
                Promise.reject("Response was not OK");
            }
            return value.text();
        });
    };
    return FragmentShaderFetcher;
}(FileFetcher));
