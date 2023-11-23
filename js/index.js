"use strict";
var feature_params = false;
var vertexAttribs = {
    "meshPosition": 0
};
var TRIANGLE_PAIR = 2;
var TRIANGLE_VERTICIES = 3;
var VEC2_COUNT = 2;
var VEC2_X = 0;
var VEC2_Y = 1;
var CANVAS_WIDTH = 112;
var CANVAS_HEIGHT = 112;
function compileShaderSource(gl, source, shaderType) {
    function shaderTypeToString() {
        switch (shaderType) {
            case gl.VERTEX_SHADER: return 'Vertex';
            case gl.FRAGMENT_SHADER: return 'Fragment';
            default: return shaderType;
        }
    }
    var shader = gl.createShader(shaderType);
    if (shader === null) {
        throw new Error("Could not create a new shader");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error("Could not compile " + shaderTypeToString() + " shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}
function linkShaderProgram(gl, shaders, vertexAttribs) {
    var program = gl.createProgram();
    if (program === null) {
        throw new Error('Could not create a new shader program');
    }
    for (var _i = 0, shaders_1 = shaders; _i < shaders_1.length; _i++) {
        var shader = shaders_1[_i];
        gl.attachShader(program, shader);
    }
    for (var vertexName in vertexAttribs) {
        gl.bindAttribLocation(program, vertexAttribs[vertexName], vertexName);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error("Could not link shader program: " + gl.getProgramInfoLog(program));
    }
    return program;
}
function createTextureFromImage(gl, image) {
    var textureId = gl.createTexture();
    if (textureId === null) {
        throw new Error('Could not create a new WebGL texture');
    }
    gl.bindTexture(gl.TEXTURE_2D, textureId);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return textureId;
}
function loadFilterProgram(gl, filter, vertexAttribs) {
    var _a;
    var vertexShader = compileShaderSource(gl, filter.vertex, gl.VERTEX_SHADER);
    var fragmentShader = compileShaderSource(gl, filter.fragment, gl.FRAGMENT_SHADER);
    var id = linkShaderProgram(gl, [vertexShader, fragmentShader], vertexAttribs);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.useProgram(id);
    var uniforms = {
        "resolution": gl.getUniformLocation(id, 'resolution'),
        "time": gl.getUniformLocation(id, 'time'),
        "emoteSize": gl.getUniformLocation(id, 'emoteSize')
    };
    var paramsPanel = div().att$("class", "widget-element");
    var paramsInputs = {};
    var _loop_1 = function (paramName) {
        if (paramName in uniforms) {
            throw new Error("Redefinition of existing uniform parameter " + paramName);
        }
        switch (filter.params[paramName].type) {
            case "float":
                {
                    var valuePreview_1 = span(filter.params[paramName].init.toString());
                    var valueInput = input("range");
                    if (filter.params[paramName].min !== undefined) {
                        valueInput.att$("min", filter.params[paramName].min);
                    }
                    if (filter.params[paramName].max !== undefined) {
                        valueInput.att$("max", filter.params[paramName].max);
                    }
                    if (filter.params[paramName].step !== undefined) {
                        valueInput.att$("step", filter.params[paramName].step);
                    }
                    if (filter.params[paramName].init !== undefined) {
                        valueInput.att$("value", filter.params[paramName].init);
                    }
                    paramsInputs[paramName] = valueInput;
                    valueInput.oninput = function () {
                        valuePreview_1.innerText = this.value;
                        paramsPanel.dispatchEvent(new CustomEvent("paramsChanged"));
                    };
                    var label = (_a = filter.params[paramName].label) !== null && _a !== void 0 ? _a : paramName;
                    paramsPanel.appendChild(div(span(label + ": "), valuePreview_1, div(valueInput)));
                }
                break;
            default: {
                throw new Error("Filter parameters do not support type " + filter.params[paramName].type);
            }
        }
        uniforms[paramName] = gl.getUniformLocation(id, paramName);
    };
    for (var paramName in filter.params) {
        _loop_1(paramName);
    }
    paramsPanel.paramsSnapshot$ = function () {
        var snapshot = {};
        for (var paramName in paramsInputs) {
            snapshot[paramName] = {
                "uniform": uniforms[paramName],
                "value": Number(paramsInputs[paramName].value)
            };
        }
        return snapshot;
    };
    return {
        "id": id,
        "uniforms": uniforms,
        "duration": compile_expr(filter.duration),
        "transparent": filter.transparent,
        "paramsPanel": paramsPanel
    };
}
function ImageSelector() {
    var imageInput = input("file");
    var imagePreview = img("img/tsodinClown.png")
        .att$("class", "widget-element")
        .att$("width", CANVAS_WIDTH);
    var root = div(div(imageInput).att$("class", "widget-element"), imagePreview).att$("class", "widget");
    root.selectedImage$ = function () {
        return imagePreview;
    };
    root.selectedFileName$ = function () {
        function removeFileNameExt(fileName) {
            if (fileName.includes('.')) {
                return fileName.split('.').slice(0, -1).join('.');
            }
            else {
                return fileName;
            }
        }
        var file = imageInput.files[0];
        return file ? removeFileNameExt(file.name) : 'result';
    };
    root.updateFiles$ = function (files) {
        imageInput.files = files;
        imageInput.onchange();
    };
    imagePreview.addEventListener('load', function () {
        root.dispatchEvent(new CustomEvent("imageSelected", {
            detail: {
                imageData: this
            }
        }));
    });
    imagePreview.addEventListener('error', function () {
        imageInput.value = '';
        this.src = 'img/error.png';
    });
    imageInput.onchange = function () {
        imagePreview.src = URL.createObjectURL(this.files[0]);
    };
    return root;
}
function FilterList() {
    var root = select();
    for (var name_1 in filters) {
        root.add(new Option(name_1));
    }
    root.selectedFilter$ = function () {
        return filters[root.selectedOptions[0].value];
    };
    root.onchange = function () {
        root.dispatchEvent(new CustomEvent('filterChanged', {
            detail: {
                filter: root.selectedFilter$()
            }
        }));
    };
    root.addEventListener('wheel', function (e) {
        e.preventDefault();
        if (e.deltaY < 0) {
            root.selectedIndex = Math.max(root.selectedIndex - 1, 0);
        }
        if (e.deltaY > 0) {
            root.selectedIndex = Math.min(root.selectedIndex + 1, root.length - 1);
        }
        root.onchange();
    });
    return root;
}
function FilterSelector() {
    var filterList_ = FilterList();
    var filterPreview = canvas()
        .att$("width", CANVAS_WIDTH)
        .att$("height", CANVAS_HEIGHT);
    var root = div(div("Filter: ", filterList_)
        .att$("class", "widget-element"), filterPreview.att$("class", "widget-element")).att$("class", "widget");
    var gl = filterPreview.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) {
        throw new Error("Could not initialize WebGL context");
    }
    {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        {
            var meshPositionBufferData = new Float32Array(TRIANGLE_PAIR * TRIANGLE_VERTICIES * VEC2_COUNT);
            for (var triangle = 0; triangle < TRIANGLE_PAIR; ++triangle) {
                for (var vertex = 0; vertex < TRIANGLE_VERTICIES; ++vertex) {
                    var quad = triangle + vertex;
                    var index = triangle * TRIANGLE_VERTICIES * VEC2_COUNT +
                        vertex * VEC2_COUNT;
                    meshPositionBufferData[index + VEC2_X] = (2 * (quad & 1) - 1);
                    meshPositionBufferData[index + VEC2_Y] = (2 * ((quad >> 1) & 1) - 1);
                }
            }
            var meshPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, meshPositionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, meshPositionBufferData, gl.STATIC_DRAW);
            var meshPositionAttrib = vertexAttribs['meshPosition'];
            gl.vertexAttribPointer(meshPositionAttrib, VEC2_COUNT, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(meshPositionAttrib);
        }
    }
    var emoteImage = undefined;
    var emoteTexture = undefined;
    var program = undefined;
    function syncParams() {
        if (program) {
            var snapshot = program.paramsPanel.paramsSnapshot$();
            for (var paramName in snapshot) {
                gl.uniform1f(snapshot[paramName].uniform, snapshot[paramName].value);
            }
        }
    }
    program = loadFilterProgram(gl, filterList_.selectedFilter$(), vertexAttribs);
    program.paramsPanel.addEventListener('paramsChanged', syncParams);
    if (feature_params) {
        root.appendChild(program.paramsPanel);
    }
    syncParams();
    root.updateImage$ = function (newEmoteImage) {
        emoteImage = newEmoteImage;
        if (emoteTexture) {
            gl.deleteTexture(emoteTexture);
        }
        emoteTexture = createTextureFromImage(gl, emoteImage);
    };
    filterList_.addEventListener('filterChanged', function (e) {
        if (program) {
            gl.deleteProgram(program.id);
            program.paramsPanel.removeEventListener('paramsChanged', syncParams);
            if (feature_params) {
                root.removeChild(program.paramsPanel);
            }
        }
        program = loadFilterProgram(gl, e.detail.filter, vertexAttribs);
        program.paramsPanel.addEventListener('paramsChanged', syncParams);
        if (feature_params) {
            root.appendChild(program.paramsPanel);
        }
        syncParams();
    });
    root.render$ = function (filename) {
        if (program === undefined) {
            console.warn('Could not rendering anything because the filter was not selected');
            return undefined;
        }
        if (emoteImage == undefined) {
            console.warn('Could not rendering anything because the image was not selected');
            return undefined;
        }
        var gif = new GIF({
            workers: 5,
            quality: 10,
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            transparent: program.transparent
        });
        var context = {
            "vars": {
                "Math.PI": Math.PI
            }
        };
        if (context.vars !== undefined) {
            var snapshot = program.paramsPanel.paramsSnapshot$();
            for (var paramName in snapshot) {
                context.vars[paramName] = snapshot[paramName].value;
            }
        }
        var fps = 30;
        var dt = 1.0 / fps;
        var duration = Math.min(run_expr(program.duration, context), 60);
        var renderProgress = document.getElementById("render-progress");
        if (renderProgress === null) {
            throw new Error('Could not find "render-progress"');
        }
        var renderSpinner = document.getElementById("render-spinner");
        if (renderSpinner === null) {
            throw new Error('Could not find "render-spinner"');
        }
        var renderPreview = document.getElementById("render-preview");
        if (renderPreview === null) {
            throw new Error('Could not find "render-preview"');
        }
        var renderDownload = document.getElementById("render-download");
        if (renderDownload === null) {
            throw new Error('Could not find "render-download"');
        }
        renderPreview.style.display = "none";
        renderSpinner.style.display = "block";
        var t = 0.0;
        while (t <= duration) {
            gl.uniform1f(program.uniforms.time, t);
            gl.uniform2f(program.uniforms.resolution, CANVAS_WIDTH, CANVAS_HEIGHT);
            gl.uniform2f(program.uniforms.emoteSize, emoteImage.width, emoteImage.height);
            gl.clearColor(0.0, 1.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, TRIANGLE_PAIR * TRIANGLE_VERTICIES);
            var pixels = new Uint8ClampedArray(4 * CANVAS_WIDTH * CANVAS_HEIGHT);
            gl.readPixels(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            {
                var center = Math.floor(CANVAS_HEIGHT / 2);
                for (var y = 0; y < center; ++y) {
                    var row = 4 * CANVAS_WIDTH;
                    for (var x = 0; x < row; ++x) {
                        var ai = y * 4 * CANVAS_WIDTH + x;
                        var bi = (CANVAS_HEIGHT - y - 1) * 4 * CANVAS_WIDTH + x;
                        var a_1 = pixels[ai];
                        var b = pixels[bi];
                        pixels[ai] = b;
                        pixels[bi] = a_1;
                    }
                }
            }
            gif.addFrame(new ImageData(pixels, CANVAS_WIDTH, CANVAS_HEIGHT), {
                delay: dt * 1000,
                dispose: 2
            });
            renderProgress.style.width = (t / duration) * 50 + "%";
            t += dt;
        }
        gif.on('finished', function (blob) {
            renderPreview.src = URL.createObjectURL(blob);
            renderPreview.style.display = "block";
            renderDownload.href = renderPreview.src;
            renderDownload.download = filename;
            renderDownload.style.display = "block";
            renderSpinner.style.display = "none";
        });
        gif.on('progress', function (p) {
            renderProgress.style.width = 50 + p * 50 + "%";
        });
        gif.render();
        return gif;
    };
    {
        var step_1 = function (timestamp) {
            gl.clearColor(0.0, 1.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            if (program && emoteImage) {
                gl.uniform1f(program.uniforms.time, timestamp * 0.001);
                gl.uniform2f(program.uniforms.resolution, filterPreview.width, filterPreview.height);
                gl.uniform2f(program.uniforms.emoteSize, emoteImage.width, emoteImage.height);
                gl.drawArrays(gl.TRIANGLES, 0, TRIANGLE_PAIR * TRIANGLE_VERTICIES);
            }
            window.requestAnimationFrame(step_1);
        };
        window.requestAnimationFrame(step_1);
    }
    return root;
}
window.onload = function () {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register('serviceworker.js').then(function (registration) {
            console.log("Registered a Service Worker ", registration);
        }, function (error) {
            console.error("Could not register a Service Worker ", error);
        });
    }
    else {
        console.error("Service Workers are not supported in this browser.");
    }
    feature_params = new URLSearchParams(document.location.search).has("feature-params");
    var filterSelectorEntry = document.getElementById('filter-selector-entry');
    if (filterSelectorEntry === null) {
        throw new Error('Could not find "filter-selector-entry"');
    }
    var imageSelectorEntry = document.getElementById('image-selector-entry');
    if (imageSelectorEntry === null) {
        throw new Error('Could not find "image-selector-entry"');
    }
    var imageSelector = ImageSelector();
    var filterSelector = FilterSelector();
    imageSelector.addEventListener('imageSelected', function (e) {
        filterSelector.updateImage$(e.detail.imageData);
    });
    filterSelectorEntry.appendChild(filterSelector);
    imageSelectorEntry.appendChild(imageSelector);
    document.ondrop = function (event) {
        var _a;
        event.preventDefault();
        imageSelector.updateFiles$((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.files);
    };
    document.ondragover = function (event) {
        event.preventDefault();
    };
    var gif = undefined;
    var renderButton = document.getElementById("render");
    if (renderButton === null) {
        throw new Error('Could not find "render"');
    }
    renderButton.onclick = function () {
        if (gif && gif.running) {
            gif.abort();
        }
        var fileName = imageSelector.selectedFileName$();
        gif = filterSelector.render$(fileName + ".gif");
    };
};
