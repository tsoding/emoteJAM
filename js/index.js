let feature_params = false; 

const vertexAttribs = {
    "meshPosition": 0
};
const TRIANGLE_PAIR = 2;
const TRIANGLE_VERTICIES = 3;
const VEC2_COUNT = 2;
const VEC2_X = 0;
const VEC2_Y = 1;
const CANVAS_WIDTH = 112;
const CANVAS_HEIGHT = 112;

function compileShaderSource(gl, source, shaderType) {
    function shaderTypeToString() {
        switch (shaderType) {
        case gl.VERTEX_SHADER: return 'Vertex';
        case gl.FRAGMENT_SHADER: return 'Fragment';
        default: return shaderType;
        }
    }

    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(`Could not compile ${shaderTypeToString()} shader: ${gl.getShaderInfoLog(shader)}`);
    }
    return shader;
}

function linkShaderProgram(gl, shaders, vertexAttribs) {
    const program = gl.createProgram();
    for (let shader of shaders) {
        gl.attachShader(program, shader);
    }

    for (let vertexName in vertexAttribs) {
        gl.bindAttribLocation(program, vertexAttribs[vertexName], vertexName);
    }

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(`Could not link shader program: ${gl.getProgramInfoLog(program)}`);
    }
    return program;
}

function createTextureFromImage(gl, image) {
    let textureId = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureId);
    gl.texImage2D(
        gl.TEXTURE_2D,    // target
        0,                // level
        gl.RGBA,          // internalFormat
        gl.RGBA,          // srcFormat
        gl.UNSIGNED_BYTE, // srcType
        image             // image
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return textureId;
}

// TODO(#54): pre-load all of the filters and just switch between them without loading/unloading them constantly
function loadFilterProgram(gl, filter, vertexAttribs) {
    let vertexShader = compileShaderSource(gl, filter.vertex, gl.VERTEX_SHADER);
    let fragmentShader = compileShaderSource(gl, filter.fragment, gl.FRAGMENT_SHADER);
    let id = linkShaderProgram(gl, [vertexShader, fragmentShader], vertexAttribs);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.useProgram(id);

    let uniforms = {
        "resolution": gl.getUniformLocation(id, 'resolution'),
        "time": gl.getUniformLocation(id, 'time'),
        "emoteSize": gl.getUniformLocation(id, 'emoteSize'),
    };

    // TODO(#55): there no "reset to default" button in the params panel of a filter
    let paramsPanel = div().att$("class", "widget-element");
    let paramsInputs = {};

    for (let paramName in filter.params) {
        if (paramName in uniforms) {
            throw new Error(`Redefinition of existing uniform parameter ${paramName}`);
        }
        
        switch (filter.params[paramName].type) {
        case "float": {
            const valuePreview = span(filter.params[paramName].init.toString());
            const valueInput = input("range");

            if (filter.params[paramName].min) {
                valueInput.att$("min", filter.params[paramName].min);
            }

            if (filter.params[paramName].max) {
                valueInput.att$("max", filter.params[paramName].max);
            }

            if (filter.params[paramName].step) {
                valueInput.att$("step", filter.params[paramName].step);
            }

            if (filter.params[paramName].init) {
                valueInput.att$("value", filter.params[paramName].init);
            }

            paramsInputs[paramName] = valueInput;

            valueInput.oninput = function () {
                valuePreview.innerText = this.value;
                paramsPanel.dispatchEvent(new CustomEvent("paramsChanged"));
            };

            paramsPanel.appendChild(div(
                span(`${paramName}: `), valuePreview,
                div(valueInput),
            ));
        } break;

        default: {
            throw new Error(`Filter parameters do not support type ${filter.params[paramName].type}`)
        }
        }

        uniforms[paramName] = gl.getUniformLocation(id, paramName);
    }

    paramsPanel.paramsSnapshot$ = function() {
        let snapshot = {};
        for (let paramName in paramsInputs) {
            snapshot[paramName] = {
                "uniform": uniforms[paramName],
                "value": paramsInputs[paramName].value
            };
        }
        return snapshot;
    };

    return {
        "id": id,
        "uniforms": uniforms,
        "duration": compile_expr(filter.duration),
        "transparent": filter.transparent,
        "paramsPanel": paramsPanel,
    };
}

function ImageSelector() {
    const imageInput = input().att$("type", "file");
    const imagePreview = img("img/tsodinClown.png")
          .att$("class", "widget-element")
          .att$("width", CANVAS_WIDTH);
    const root = div(
        div(imageInput).att$("class", "widget-element"),
        imagePreview
    ).att$("class", "widget");

    root.selectedImage$ = function() {
        return imagePreview;
    };

    root.selectedFileName$ = function() {
        function removeFileNameExt(fileName) {
            if (fileName.includes('.')) {
                return fileName.split('.').slice(0, -1).join('.');
            } else {
                return fileName;
            }
        }

        const file = imageInput.files[0];
        return file ? removeFileNameExt(file.name) : 'result';
    };

    root.updateFiles$ = function(files) {
        imageInput.files = files;
        imageInput.onchange();
    }

    imagePreview.addEventListener('load', function() {
        root.dispatchEvent(new CustomEvent("imageSelected", {
            detail: {
                imageData: this
            }
        }));
    });

    imagePreview.addEventListener('error', function() {
        imageInput.value = '';
        this.src = 'img/error.png';
    });

    imageInput.onchange = function() {
        imagePreview.src = URL.createObjectURL(this.files[0]);
    };

    return root;
}

function FilterList() {
    const root = select();

    // Populating the FilterList
    for (let name in filters) {
        root.add(new Option(name));
    }

    root.selectedFilter$ = function() {
        return filters[root.selectedOptions[0].value];
    };

    root.onchange = function() {
        root.dispatchEvent(new CustomEvent('filterChanged', {
            detail: {
                filter: root.selectedFilter$()
            }
        }));
    };

    root.addEventListener('wheel', function(e) {
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
    const filterList_ = FilterList();
    const filterPreview = canvas()
          .att$("width", CANVAS_WIDTH)
          .att$("height", CANVAS_HEIGHT);
    const root = div(
        div("Filter: ", filterList_)
            .att$("class", "widget-element"),
        filterPreview.att$("class", "widget-element"),
    ).att$("class", "widget");

    const gl = filterPreview.getContext("webgl", {antialias: false, alpha: false});
    if (!gl) {
        throw new Error("Could not initialize WebGL context");
    }

    // Initialize GL
    {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Mesh Position
        {
            let meshPositionBufferData = new Float32Array(TRIANGLE_PAIR * TRIANGLE_VERTICIES * VEC2_COUNT);
            for (let triangle = 0; triangle < TRIANGLE_PAIR; ++triangle) {
                for (let vertex = 0; vertex < TRIANGLE_VERTICIES; ++vertex) {
                    const quad = triangle + vertex;
                    const index =
                          triangle * TRIANGLE_VERTICIES * VEC2_COUNT +
                          vertex * VEC2_COUNT;
                    meshPositionBufferData[index + VEC2_X] = (2 * (quad & 1) - 1);
                    meshPositionBufferData[index + VEC2_Y] = (2 * ((quad >> 1) & 1) - 1);
                }
            }

            let meshPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, meshPositionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, meshPositionBufferData, gl.STATIC_DRAW);

            const meshPositionAttrib = vertexAttribs['meshPosition'];
            gl.vertexAttribPointer(
                meshPositionAttrib,
                VEC2_COUNT,
                gl.FLOAT,
                false,
                0,
                0);
            gl.enableVertexAttribArray(meshPositionAttrib);
        }
    }

    // TODO(#49): FilterSelector does not handle loadFilterProgram() failures

    let emoteImage = undefined;
    let emoteTexture = undefined;
    let program = undefined;

    function syncParams() {
        if (program) {
            const snapshot = program.paramsPanel.paramsSnapshot$();
            for (let paramName in snapshot) {
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

    root.updateImage$ = function(newEmoteImage) {
        emoteImage = newEmoteImage;
        if (emoteTexture) {
            gl.deleteTexture(emoteTexture);
        }
        emoteTexture = createTextureFromImage(gl, emoteImage);
    };

    filterList_.addEventListener('filterChanged', function(e) {
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
        var gif = new GIF({
            workers: 5,
            quality: 10,
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            transparent: program.transparent,
        });

        const context = {
            "vars": {
                "Math.PI": Math.PI
            }
        };
        {
            console.assert(program);
            const snapshot = program.paramsPanel.paramsSnapshot$();
            console.log(snapshot);
            for (let paramName in snapshot) {
                context.vars[paramName] = snapshot[paramName].value;
            }
        }

        const fps = 30;
        const dt = 1.0 / fps;
        // TODO(#59): come up with a reasonable way to handle malicious durations
        const duration = Math.min(run_expr(program.duration, context), 60);
        const frameCount = 100;

        const renderProgress = document.getElementById("render-progress");
        const renderSpinner = document.getElementById("render-spinner");
        const renderPreview = document.getElementById("render-preview");
        const renderDownload = document.getElementById("render-download");

        renderPreview.style.display = "none";
        renderSpinner.style.display = "block";

        let t = 0.0;
        while (t <= duration) {
            gl.uniform1f(program.uniforms.time, t);
            gl.uniform2f(program.uniforms.resolution, CANVAS_WIDTH, CANVAS_HEIGHT);
            gl.uniform2f(program.uniforms.emoteSize, emoteImage.width, emoteImage.height);

            gl.clearColor(0.0, 1.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, TRIANGLE_PAIR * TRIANGLE_VERTICIES);

            let pixels = new Uint8ClampedArray(4 * CANVAS_WIDTH * CANVAS_HEIGHT);
            gl.readPixels(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            // Flip the image vertically
            {
                const center = Math.floor(CANVAS_HEIGHT / 2);
                for (let y = 0; y < center; ++y) {
                    const row = 4 * CANVAS_WIDTH;
                    for (let x = 0; x < row; ++x) {
                        const ai = y * 4 * CANVAS_WIDTH + x;
                        const bi = (CANVAS_HEIGHT - y - 1) * 4 * CANVAS_WIDTH + x;
                        const a = pixels[ai];
                        const b = pixels[bi];
                        pixels[ai] = b;
                        pixels[bi] = a;
                    }
                }
            }

            gif.addFrame(new ImageData(pixels, CANVAS_WIDTH, CANVAS_HEIGHT), {
                delay: dt * 1000,
                dispose: 2,
            });

            renderProgress.style.width = `${(t / duration) * 50}%`;

            t += dt;
        }

        gif.on('finished', (blob) => {
            renderPreview.src = URL.createObjectURL(blob);
            renderPreview.style.display = "block";
            renderDownload.href = renderPreview.src;
            renderDownload.download = filename;
            renderDownload.style.display = "block";
            renderSpinner.style.display = "none";

        });

        gif.on('progress', (p) => {
            renderProgress.style.width = `${50 + p * 50}%`;
        });

        gif.render();

        return gif;
    };

    // Rendering Loop
    {
        let start;
        function step(timestamp) {
            if (start === undefined) {
                start = timestamp;
            }
            const dt = (timestamp - start) * 0.001;
            start = timestamp;
            
            gl.clearColor(0.0, 1.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            if (program && emoteImage) {
                gl.uniform1f(program.uniforms.time, start * 0.001);
                gl.uniform2f(program.uniforms.resolution, filterPreview.width, filterPreview.height);
                gl.uniform2f(program.uniforms.emoteSize, emoteImage.width, emoteImage.height);

                gl.drawArrays(gl.TRIANGLES, 0, TRIANGLE_PAIR * TRIANGLE_VERTICIES);
            }

            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }

    return root;
}

window.onload = () => {
    feature_params = new URLSearchParams(document.location.search).has("feature-params");

    const imageSelector = ImageSelector();
    const filterSelector = FilterSelector();
    imageSelector.addEventListener('imageSelected', function(e) {
        filterSelector.updateImage$(e.detail.imageData);
    });
    filterSelectorEntry.appendChild(filterSelector);
    imageSelectorEntry.appendChild(imageSelector);

    // drag file from anywhere
    document.ondrop = function(event) {
        event.preventDefault();
        imageSelector.updateFiles$(event.dataTransfer.files);
    }

    document.ondragover = function(event) {
        event.preventDefault();
    }

    // TODO(#50): extract "renderer" as a separate grecha.js component
    // Similar to imageSelector and filterSelector
    let gif = undefined;
    const renderButton = document.querySelector("#render");
    renderButton.onclick = function() {
        if (gif && gif.running) {
            gif.abort();
        }
        const fileName = imageSelector.selectedFileName$();
        gif = filterSelector.render$(`${fileName}.gif`);
    };
}
