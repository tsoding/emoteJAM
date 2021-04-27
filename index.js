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
        throw new Error(`Could not compile ${this.shaderTypeToString(shaderType)} shader: ${gl.getShaderInfoLog(shader)}`);
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

vertexShaderSource = `#version 100

precision mediump float;

attribute vec2 meshPosition;

uniform vec2 resolution;
uniform float time;

varying vec2 uv;

void main() {
    float stretch = sin(6.0 * time) * 0.5 + 1.0;

    vec2 offset = vec2(0.0, stretch - 1.0);
    gl_Position = vec4(
        meshPosition * vec2(stretch, 2.0 - stretch) + offset,
        0.0,
        1.0);
    uv = (meshPosition + vec2(1.0, 1.0)) / 2.0;
}
`;

fragmentShaderSource = `#version 100

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D emote;

varying vec2 uv;

void main() {
    vec2 coord = gl_FragCoord.xy / resolution;
    vec4 KappaPride = vec4(
        (sin(coord.x + time) + 1.0) / 2.0,
        (cos(coord.y + time) + 1.0) / 2.0,
        (sin(coord.x + coord.y + time) + 1.0) / 2.0,
        1.0);
    gl_FragColor = texture2D(emote, vec2(uv.x, uv.y));
}
`;

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

function render(gl, canvas, timeUniform, resolutionUniform) {
    var gif = new GIF({
        workers: 5,
        quality: 10,
        width: canvas.width,
        height: canvas.height,
    });

    let fps = 30;
    let dt = 1.0 / fps;
    let duration = Math.PI / 3.0;
    let frameCount = 100;

    let t = 0.0;
    while (t <= duration) {
        gl.uniform1f(timeUniform, t);
        gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, TRIANGLE_PAIR * TRIANGLE_VERTICIES);

        let pixels = new Uint8ClampedArray(4 * canvas.width * canvas.height);
        gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        console.log(canvas.width);
        gif.addFrame(new ImageData(pixels, canvas.width, canvas.height), {
            delay: dt * 1000,
            dispose: 2,
        });
        t += dt;
    }

    gif.on('finished', (blob) => {
        window.open(URL.createObjectURL(blob));
    });

    gif.on('progress', (p) => {
        console.log(`progress ${p}`);
    });

    gif.render();
}

window.onload = () => {
    let vertexAttribs = {
        "meshPosition": 0
    };

    const canvas = document.getElementById("preview");
    const gl = canvas.getContext("webgl");
    if (!gl) {
        throw new Error("Could not initialize WebGL context");
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let vertexShader = compileShaderSource(gl, vertexShaderSource, gl.VERTEX_SHADER);
    let fragmentShader = compileShaderSource(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    let program = linkShaderProgram(gl, [vertexShader, fragmentShader], vertexAttribs);
    gl.useProgram(program);

    let resolutionUniform = gl.getUniformLocation(program, 'resolution');
    let timeUniform = gl.getUniformLocation(program, 'time');

    // Bitmap Font
    {
        const customPreview = document.querySelector("#custom-preview");
        let emoteTexture = createTextureFromImage(gl, customPreview);

        customPreview.onload = function() {
            gl.deleteTexture(emoteTexture);
            emoteTexture = createTextureFromImage(gl, customPreview);
        };

        const customFile = document.querySelector("#custom-file");
        customFile.onchange = function() {
            customPreview.src = URL.createObjectURL(this.files[0]);
        };

        const renderButton = document.querySelector("#render");
        renderButton.onclick = function() {
            render(gl, canvas, timeUniform, resolutionUniform);
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

        gl.uniform1f(timeUniform, start * 0.001);
        gl.uniform2f(resolutionUniform, canvas.width, canvas.height);

        gl.drawArrays(gl.TRIANGLES, 0, TRIANGLE_PAIR * TRIANGLE_VERTICIES);

        window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
}
