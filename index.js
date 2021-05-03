const LOAD_FILTER_TIMEOUT_MS = 20;
const TRIANGLE_PAIR = 2;
const TRIANGLE_VERTICIES = 3;
const VEC2_COUNT = 2;
const VEC2_X = 0;
const VEC2_Y = 1;

function shaderTypeToString(gl, shaderType) {
    switch (shaderType) {
    case gl.VERTEX_SHADER: return 'Vertex';
    case gl.FRAGMENT_SHADER: return 'Fragment';
    default: return shaderType;
    }
}

function compileShaderSource(gl, source, shaderType) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(`Could not compile ${shaderTypeToString(shaderType)} shader: ${gl.getShaderInfoLog(shader)}`);
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

const filters = {
    "Hop": {
        "transparent": 0x00FF00,
        "duration": 0.85 * 2,
        "vertex": "glsl/hop.vs",
        "fragment": "glsl/hop.fs"
    },
    "Hopper": {
        "transparent": 0x00FF00,
        "duration": 0.85,
        "vertex": "glsl/hopper.vs",
        "fragment": "glsl/hopper.fs"
    },
    "Overheat": {
        "transparent": 0x00FF00,
        "duration": 0.85 / 8.0 * 2.0,
        "vertex": "glsl/overheat.vs",
        "fragment": "glsl/overheat.fs"
    },
    "Bounce": {
        "transparent": 0x00FF00,
        "duration": Math.PI / 5.0,
        "vertex": "glsl/bounce.vs",
        "fragment": "glsl/bounce.fs",
    },
    "Circle": {
        "transparent": 0x00FF00,
        "duration": Math.PI / 4.0,
        "vertex": "glsl/circle.vs",
        "fragment": "glsl/circle.fs",
    },
    "Slide": {
        "transparent": 0x00FF00,
        "duration": 0.85 * 2,
        "vertex": "glsl/slide.vs",
        "fragment": "glsl/slide.fs"
    },
    "Laughing": {
        "transparent": 0x00FF00,
        "duration": Math.PI / 12.0,
        "vertex": "glsl/laughing.vs",
        "fragment": "glsl/laughing.fs"
    },
    "Blob": {
        "transparent": 0x00FF00,
        "duration": Math.PI / 3,
        "vertex": "glsl/blob.vs",
        "fragment": "glsl/blob.fs"
    },
    "Go": {
        "transparent": 0x00FF00,
        "duration": 1 / 4,
        "vertex": "glsl/go.vs",
        "fragment": "glsl/go.fs",
    },
    "Elevator": {
        "transparent": 0x00FF00,
        "duration": 1 / 4,
        "vertex": "glsl/elevator.vs",
        "fragment": "glsl/elevator.fs",
    },
    "Rain": {
        "transparent": 0x00FF00,
        "duration": 1,
        "vertex": "glsl/rain.vs",
        "fragment": "glsl/rain.fs",
    },
    "Pride": {
        "transparent": null,
        "duration": 2.0,
        "vertex": "glsl/pride.vs",
        "fragment": "glsl/pride.fs"
    },
    "Hard": {
        "transparent": 0x00FF00,
        "duration": 2.0 * Math.PI / 32.0,
        "vertex": "glsl/hard.vs",
        "fragment": "glsl/hard.fs",
    },
    "Peek":{
        "transparent": 0x00FF00,
        "duration": 2.0 * Math.PI ,
        "vertex": "glsl/peek.vs",
        "fragment": "glsl/peek.fs", 
    },
};

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

function render(gl, canvas, program, filename) {
    var gif = new GIF({
        workers: 5,
        quality: 10,
        width: canvas.width,
        height: canvas.height,
        transparent: program.transparent,
    });

    const fps = 30;
    const dt = 1.0 / fps;
    const duration = program.duration;
    const frameCount = 100;

    const renderProgress = document.getElementById("render-progress");
    const renderSpinner = document.getElementById("render-spinner");
    const renderPreview = document.getElementById("render-preview");
    const renderDownload = document.getElementById("render-download");

    renderPreview.style.display = "none";
    renderSpinner.style.display = "block";

    let t = 0.0;
    while (t <= duration) {
        gl.uniform1f(program.timeUniform, t);
        gl.uniform2f(program.resolutionUniform, canvas.width, canvas.height);
        gl.clearColor(0.0, 1.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, TRIANGLE_PAIR * TRIANGLE_VERTICIES);

        let pixels = new Uint8ClampedArray(4 * canvas.width * canvas.height);
        gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        // Flip the image vertically
        {
            const center = Math.floor(canvas.height / 2);
            for (let y = 0; y < center; ++y) {
                const row = 4 * canvas.width;
                for (let x = 0; x < row; ++x) {
                    const ai = y * 4 * canvas.width + x;
                    const bi = (canvas.height - y - 1) * 4 * canvas.width + x;
                    const a = pixels[ai];
                    const b = pixels[bi];
                    pixels[ai] = b;
                    pixels[bi] = a;
                }
            }
        }

        gif.addFrame(new ImageData(pixels, canvas.width, canvas.height), {
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
}

async function fetchShaderSource(url) {
    return fetch(url, {cache: "default"}).then(response => response.text());
}

async function loadFilterProgram(gl, filter, vertexAttribs, timeoutFn = () => {}) {
    let shadersFetched = false;
    setTimeout(() => {
        if (!shadersFetched) {
            timeoutFn();
        }
    }, LOAD_FILTER_TIMEOUT_MS);

    const vertexSource = await fetchShaderSource(filter.vertex);
    const fragmentSource = await fetchShaderSource(filter.fragment);
    shadersFetched = true;

    const vertexShader = compileShaderSource(gl, vertexSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShaderSource(gl, fragmentSource, gl.FRAGMENT_SHADER);
    const id = linkShaderProgram(gl, [vertexShader, fragmentShader], vertexAttribs);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.useProgram(id);

    return {
        "id": id,
        "resolutionUniform": gl.getUniformLocation(id, 'resolution'),
        "timeUniform": gl.getUniformLocation(id, 'time'),
        "duration": filter.duration,
        "transparent": filter.transparent,
    };
}

function removeFileNameExt(fileName) {
    if (fileName.includes('.')) {
        return fileName.split('.').slice(0, -1).join('.');
    } else {
        return fileName;
    }
}

window.onload = async () => {
    const canvas = document.getElementById("preview");
    const filtersSelect = document.getElementById("filters");
    const widgetFilter = document.getElementById("widget-filter");
    const customPreview = document.querySelector("#custom-preview");
    const customFile = document.querySelector("#custom-file");
    const renderButton = document.querySelector("#render");

    for (const name of Object.keys(filters)) {
        filtersSelect.add(new Option(name));
    }

    let shouldDraw = true;
    const vertexAttribs = {
        "meshPosition": 0
    };

    const getCurrentFilter = () => filters[filtersSelect.selectedOptions[0].value];

    const setBusyLoading = (isBusy) => {
        shouldDraw = !isBusy;
        renderButton.disabled = isBusy;
        widgetFilter.dataset.isLoading = isBusy;
    };

    const filterLoadTimeout = () => setBusyLoading(true);
    
    const gl = canvas.getContext("webgl", {antialias: false, alpha: false});
    if (!gl) {
        throw new Error("Could not initialize WebGL context");
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let program = await loadFilterProgram(gl, getCurrentFilter(), vertexAttribs, filterLoadTimeout);
    setBusyLoading(false);

    filtersSelect.onchange = async () => {
        gl.deleteProgram(program.id);
        program = await loadFilterProgram(gl, getCurrentFilter(), vertexAttribs, filterLoadTimeout);
        setBusyLoading(false);
    };

    let gif;

    // Bitmap Font
    {
        
        let emoteTexture = createTextureFromImage(gl, customPreview);

        customPreview.onload = function() {
            gl.deleteTexture(emoteTexture);
            emoteTexture = createTextureFromImage(gl, customPreview);
        };

       
        customFile.onchange = function() {
            if (!this.files[0].type.startsWith('image/')) {
                customFile.value = '';
                customPreview.src = 'error.png';
            } else {
                customPreview.src = URL.createObjectURL(this.files[0]);
            }
        };

        // drag file from anywhere
        document.ondrop = function(event) {
            event.preventDefault();
            customFile.files = event.dataTransfer.files;
            customFile.onchange();
        };

        document.ondragover = function(event) {
            event.preventDefault();
        };
        
        renderButton.onclick = function() {
            if (gif && gif.running) {
                gif.abort();
            }
            const file = customFile.files[0];
            let filename = file ? removeFileNameExt(file.name) : 'result';
            gif = render(gl, canvas, program, `${filename}.gif`);
        };
    }


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

    let start;
    function step(timestamp) {
        if (start === undefined) {
            start = timestamp;
        }
        const dt = (timestamp - start) * 0.001;
        start = timestamp;

        gl.uniform1f(program.timeUniform, start * 0.001);
        gl.uniform2f(program.resolutionUniform, canvas.width, canvas.height);

        if (shouldDraw) {
            gl.clearColor(0.0, 1.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, TRIANGLE_PAIR * TRIANGLE_VERTICIES);
        }

        window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
}
