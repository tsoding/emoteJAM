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
        "vertex": `#version 100
precision mediump float;

attribute vec2 meshPosition;
uniform float time;

varying vec2 uv;

float sliding_from_left_to_right(float time_interval) {
    return (mod(time, time_interval) - time_interval * 0.5) / (time_interval * 0.5);
}

float flipping_directions(float time_interval) {
    return 1.0 - 2.0 * mod(floor(time / time_interval), 2.0);
}

void main() {
    float scale = 0.40;
    float hops = 2.0;
    float x_time_interval = 0.85;
    float y_time_interval = x_time_interval / (2.0 * hops);
    float height = 0.5;
    vec2 offset = vec2(
        sliding_from_left_to_right(x_time_interval) * flipping_directions(x_time_interval) * (1.0 - scale),
        ((sliding_from_left_to_right(y_time_interval) * flipping_directions(y_time_interval) + 1.0) / 4.0) - height);

    gl_Position = vec4(
        meshPosition * scale + offset,
        0.0,
        1.0);

    uv = (meshPosition + vec2(1.0, 1.0)) / 2.0;

    uv.x = (flipping_directions(x_time_interval) + 1.0) / 2.0 - uv.x * flipping_directions(x_time_interval);
}
`,
        "fragment": `#version 100

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D emote;

varying vec2 uv;

void main() {
    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));
    gl_FragColor.w = floor(gl_FragColor.w + 0.5);
}
`
    },
    "Hopper": {
        "transparent": 0x00FF00,
        "duration": 0.85,
        "vertex": `#version 100
precision mediump float;

attribute vec2 meshPosition;
uniform float time;

varying vec2 uv;

float sliding_from_left_to_right(float time_interval) {
    return (mod(time, time_interval) - time_interval * 0.5) / (time_interval * 0.5);
}

float flipping_directions(float time_interval) {
    return 1.0 - 2.0 * mod(floor(time / time_interval), 2.0);
}

void main() {
    float scale = 0.40;
    float hops = 2.0;
    float x_time_interval = 0.85 / 2.0;
    float y_time_interval = x_time_interval / (2.0 * hops);
    float height = 0.5;
    vec2 offset = vec2(
        sliding_from_left_to_right(x_time_interval) * flipping_directions(x_time_interval) * (1.0 - scale),
        ((sliding_from_left_to_right(y_time_interval) * flipping_directions(y_time_interval) + 1.0) / 4.0) - height);

    gl_Position = vec4(
        meshPosition * scale + offset,
        0.0,
        1.0);

    uv = (meshPosition + vec2(1.0, 1.0)) / 2.0;

    uv.x = (flipping_directions(x_time_interval) + 1.0) / 2.0 - uv.x * flipping_directions(x_time_interval);
}
`,
        "fragment": `#version 100

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D emote;

varying vec2 uv;

void main() {
    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));
    gl_FragColor.w = floor(gl_FragColor.w + 0.5);
}
`
    },
    "Overheat": {
        "transparent": 0x00FF00,
        "duration": 0.85 / 8.0 * 2.0,
        "vertex": `#version 100
precision mediump float;

attribute vec2 meshPosition;
uniform float time;

varying vec2 uv;

float sliding_from_left_to_right(float time_interval) {
    return (mod(time, time_interval) - time_interval * 0.5) / (time_interval * 0.5);
}

float flipping_directions(float time_interval) {
    return 1.0 - 2.0 * mod(floor(time / time_interval), 2.0);
}

void main() {
    float scale = 0.40;
    float hops = 2.0;
    float x_time_interval = 0.85 / 8.0;
    float y_time_interval = x_time_interval / (2.0 * hops);
    float height = 0.5;
    vec2 offset = vec2(
        sliding_from_left_to_right(x_time_interval) * flipping_directions(x_time_interval) * (1.0 - scale),
        ((sliding_from_left_to_right(y_time_interval) * flipping_directions(y_time_interval) + 1.0) / 4.0) - height);

    gl_Position = vec4(
        meshPosition * scale + offset,
        0.0,
        1.0);

    uv = (meshPosition + vec2(1.0, 1.0)) / 2.0;

    uv.x = (flipping_directions(x_time_interval) + 1.0) / 2.0 - uv.x * flipping_directions(x_time_interval);
}
`,
        "fragment": `#version 100

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D emote;

varying vec2 uv;

void main() {
    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y)) * vec4(1.0, 0.0, 0.0, 1.0);
    gl_FragColor.w = floor(gl_FragColor.w + 0.5);
}
`
    },
    "Bounce": {
        "transparent": 0x00FF00,
        "duration": Math.PI / 5.0,
        "vertex": `#version 100
precision mediump float;

attribute vec2 meshPosition;

uniform vec2 resolution;
uniform float time;

varying vec2 uv;

void main() {
    float scale = 0.30;
    float period_interval = 5.0;
    vec2 offset = vec2(0.0, (2.0 * abs(sin(time * period_interval)) - 1.0) * (1.0 - scale));
    gl_Position = vec4(meshPosition * scale + offset, 0.0, 1.0);
    uv = (meshPosition + 1.0) / 2.0;
}
`,
        "fragment": `
#version 100

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D emote;

varying vec2 uv;

void main() {
    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));
    gl_FragColor.w = floor(gl_FragColor.w + 0.5);
}
`,
    },
    "Circle": {
        "transparent": 0x00FF00,
        "duration": Math.PI / 4.0,
        "vertex": `#version 100
precision mediump float;

attribute vec2 meshPosition;

uniform vec2 resolution;
uniform float time;

varying vec2 uv;

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

void main() {
    float scale = 0.30;
    float period_interval = 8.0;
    float pi = 3.141592653589793238;
    vec2 outer_circle = vec2(cos(period_interval * time), sin(period_interval * time)) * (1.0 - scale);
    vec2 inner_circle = rotate(meshPosition * scale, (-period_interval * time) + pi / 2.0);
    gl_Position = vec4(
        inner_circle + outer_circle,
        0.0,
        1.0);
    uv = (meshPosition + 1.0) / 2.0;
}
`,
        "fragment": `
#version 100

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D emote;

varying vec2 uv;

void main() {
    float speed = 1.0;
    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));
    gl_FragColor.w = floor(gl_FragColor.w + 0.5);
}
`,
    },
    "Slide": {
        "transparent": 0x00FF00,
        "duration": 0.85 * 2,
        "vertex": `#version 100
precision mediump float;

attribute vec2 meshPosition;
uniform float time;

varying vec2 uv;

float sliding_from_left_to_right(float time_interval) {
    return (mod(time, time_interval) - time_interval * 0.5) / (time_interval * 0.5);
}

float flipping_directions(float time_interval) {
    return 1.0 - 2.0 * mod(floor(time / time_interval), 2.0);
}

void main() {
    float scale = 0.40;
    float hops = 2.0;
    float x_time_interval = 0.85;
    float y_time_interval = x_time_interval / (2.0 * hops);
    float height = 0.5;
    vec2 offset = vec2(
        sliding_from_left_to_right(x_time_interval) * flipping_directions(x_time_interval) * (1.0 - scale),
        - height);

    gl_Position = vec4(
        meshPosition * scale + offset,
        0.0,
        1.0);

    uv = (meshPosition + vec2(1.0, 1.0)) / 2.0;

    uv.x = (flipping_directions(x_time_interval) + 1.0) / 2.0 - uv.x * flipping_directions(x_time_interval);
}
`,
        "fragment": `#version 100

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D emote;

varying vec2 uv;

void main() {
    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));
    gl_FragColor.w = floor(gl_FragColor.w + 0.5);
}
`
    },
    "Laughing": {
        "transparent": 0x00FF00,
        "duration": Math.PI / 12.0,
        "vertex": `#version 100
precision mediump float;

attribute vec2 meshPosition;
uniform float time;

varying vec2 uv;

void main() {
    float a = 0.3;
    float t = (sin(24.0 * time) * a + a) / 2.0;

    gl_Position = vec4(
        meshPosition - vec2(0.0, t),
        0.0,
        1.0);
    uv = (meshPosition + vec2(1.0, 1.0)) / 2.0;
}
`,
        "fragment": `#version 100

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D emote;

varying vec2 uv;

void main() {
    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));
    gl_FragColor.w = floor(gl_FragColor.w + 0.5);
}
`
    },
    "Blob": {
        "transparent": 0x00FF00,
        "duration": Math.PI / 3,
        "vertex": `#version 100

precision mediump float;

attribute vec2 meshPosition;

uniform vec2 resolution;
uniform float time;

varying vec2 uv;

void main() {
    float stretch = sin(6.0 * time) * 0.5 + 1.0;

    vec2 offset = vec2(0.0, 1.0 - stretch);
    gl_Position = vec4(
        meshPosition * vec2(stretch, 2.0 - stretch) + offset,
        0.0,
        1.0);
    uv = (meshPosition + vec2(1.0, 1.0)) / 2.0;
}
`,
        "fragment": `#version 100

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D emote;

varying vec2 uv;

void main() {
    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));
    gl_FragColor.w = floor(gl_FragColor.w + 0.5);
}
`
    },
    "Go": {
        "transparent": 0x00FF00,
        "duration": 1 / 4,
        "vertex": `#version 100
precision mediump float;

attribute vec2 meshPosition;

uniform vec2 resolution;
uniform float time;

varying vec2 uv;

void main() {
    gl_Position = vec4(meshPosition, 0.0, 1.0);
    uv = (meshPosition + 1.0) / 2.0;
}
`,
        "fragment": `
#version 100

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D emote;

varying vec2 uv;

float slide(float speed, float value) {
    return mod(value - speed * time, 1.0);
}

void main() {
    float speed = 4.0;
    gl_FragColor = texture2D(emote, vec2(slide(speed, uv.x), 1.0 - uv.y));
    gl_FragColor.w = floor(gl_FragColor.w + 0.5);
}
`,
    },
    "Elevator": {
        "transparent": 0x00FF00,
        "duration": 1 / 4,
        "vertex": `#version 100
precision mediump float;

attribute vec2 meshPosition;

uniform vec2 resolution;
uniform float time;

varying vec2 uv;

void main() {
    gl_Position = vec4(meshPosition, 0.0, 1.0);
    uv = (meshPosition + 1.0) / 2.0;
}
`,
        "fragment": `
#version 100

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D emote;

varying vec2 uv;

float slide(float speed, float value) {
    return mod(value - speed * time, 1.0);
}

void main() {
    float speed = 4.0;
    gl_FragColor = texture2D(
        emote,
        vec2(uv.x, slide(speed, 1.0 - uv.y)));
    gl_FragColor.w = floor(gl_FragColor.w + 0.5);
}
`,
    },
    "Rain": {
        "transparent": 0x00FF00,
        "duration": 1,
        "vertex": `#version 100
precision mediump float;

attribute vec2 meshPosition;

uniform vec2 resolution;
uniform float time;

varying vec2 uv;

void main() {
    gl_Position = vec4(meshPosition, 0.0, 1.0);
    uv = (meshPosition + 1.0) / 2.0;
}
`,
        "fragment": `
#version 100

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D emote;

varying vec2 uv;

float slide(float speed, float value) {
    return mod(value - speed * time, 1.0);
}

void main() {
    float speed = 1.0;
    gl_FragColor = texture2D(
        emote,
        vec2(mod(4.0 * slide(speed, uv.x), 1.0),
             mod(4.0 * slide(speed, 1.0 - uv.y), 1.0)));
    gl_FragColor.w = floor(gl_FragColor.w + 0.5);
}
`,
    },
    "Pride": {
        "transparent": null,
        "duration": 2.0,
        "vertex": `#version 100
precision mediump float;

attribute vec2 meshPosition;

uniform vec2 resolution;
uniform float time;

varying vec2 uv;

void main() {
    gl_Position = vec4(meshPosition, 0.0, 1.0);
    uv = (meshPosition + 1.0) / 2.0;
}
`,
        "fragment": `
#version 100

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D emote;

varying vec2 uv;

vec3 hsl2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}

void main() {
    float speed = 1.0;

    vec4 pixel = texture2D(emote, vec2(uv.x, 1.0 - uv.y));
    pixel.w = floor(pixel.w + 0.5);
    pixel = vec4(mix(vec3(1.0), pixel.xyz, pixel.w), 1.0);
    vec4 rainbow = vec4(hsl2rgb(vec3((time - uv.x - uv.y) * 0.5, 1.0, 0.80)), 1.0);
    gl_FragColor = pixel * rainbow;
}
`,
    },
    "Hard": {
        "transparent": 0x00FF00,
        "duration": 2.0 * Math.PI / 32.0,
        "vertex": `#version 100
precision mediump float;

attribute vec2 meshPosition;

uniform vec2 resolution;
uniform float time;

varying vec2 uv;

void main() {
    float zoom = 1.4;
    float intensity = 32.0;
    float amplitude = 1.0 / 8.0;
    vec2 shaking = vec2(cos(intensity * time), sin(intensity * time)) * amplitude;
    gl_Position = vec4(meshPosition * zoom + shaking, 0.0, 1.0);
    uv = (meshPosition + 1.0) / 2.0;
}
`,
        "fragment": `
#version 100

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D emote;

varying vec2 uv;

void main() {
    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));
    gl_FragColor.w = floor(gl_FragColor.w + 0.5);
}
`,
    },
	"Peek":{
        "transparent": 0x00FF00,
        "duration": 2.0 * Math.PI ,
        "vertex": `#version 100
precision mediump float;

attribute vec2 meshPosition;

uniform vec2 resolution;
uniform float time;

varying vec2 uv;

void main() {
    float time_clipped= mod(time * 2.0, (4.0 * 3.14));

    float s1 = float(time_clipped < (2.0 * 3.14));
    float s2 = 1.0 - s1;

    float hold1 = float(time_clipped > (0.5 * 3.14) && time_clipped < (2.0 * 3.14));
    float hold2 = 1.0 - float(time_clipped > (2.5 * 3.14) && time_clipped < (4.0 * 3.14));

    float cycle_1 = 1.0 - ((s1 * sin(time_clipped) * (1.0 - hold1)) + hold1);
    float cycle_2 = s2 * hold2 * (sin(time_clipped) - 1.0); 

    gl_Position = vec4(meshPosition.x + 1.0 + cycle_1 + cycle_2 , meshPosition.y, 0.0, 1.0);
    uv = (meshPosition + 1.0) / 2.0;
}
`,
        "fragment": `
#version 100

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D emote;

varying vec2 uv;

void main() {
    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));
    gl_FragColor.w = floor(gl_FragColor.w + 0.5);
}
`, 
	},
    "Matrix": {
        "transparent": null,
        "duration": 3.0,
        "vertex":`
        #version 100
        precision mediump float;

        attribute vec2 meshPosition;

        uniform vec2 resolution;
        uniform float time;

        varying vec2 _uv;

        void main()
        {
            _uv = (meshPosition + 1.0) / 2.0;
            gl_Position = vec4(meshPosition.x, meshPosition.y, 0.0, 1.0);
        }
        `,
        "fragment": `
        #version 100
        precision mediump float;

        uniform vec2 resolution;
        uniform float time;
        uniform sampler2D emote;

        varying vec2 _uv;

        float clamp01(float value)
        {
            return clamp(value, 0.0, 1.0);
        }

        float sdf_zero(vec2 uv)
        {
            float inside = step(0.15, abs(uv.x)) + step(0.3, abs(uv.y));
            float outside = step(0.35, abs(uv.x)) + step(0.4, abs(uv.y));
            return clamp01(inside) - clamp01(outside);
        }

        float sdf_one(vec2 uv)
        {
            float top = step(0.25, -uv.y) * step(0.0, uv.x);
            float inside = (step(0.2, uv.x) + top);
            float outside = step(0.35, abs(uv.x)) + step(0.4, abs(uv.y));
            return clamp01(clamp01(inside) - clamp01(outside));
        }

        // Random float. No precomputed gradients mean this works for any number of grid coordinates
        float random01(vec2 n)
        {
            float random = 2920.0 * sin(n.x * 21942.0 + n.y * 171324.0 + 8912.0) *
             cos(n.x * 23157.0 * n.y * 217832.0 + 9758.0);
        
            return (sin(random) + 1.0) / 2.0;
        }

        float loop_time(float time_frame)
        {
            float times = floor(time / time_frame);
            return time - (times * time_frame);
        }

        void main()
        {
            vec2 uv = _uv;
            uv.y = 1.0 - _uv.y;
            
            float number_of_numbers = 8.0;
            float number_change_rate = 2.0;
            float amount_of_numbers = 0.6; // from 0 - 1
            
            vec4 texture_color = texture2D(emote, uv);
            vec4 number_color = vec4(0, 0.7, 0, 1);

            float looped_time = loop_time(3.0); 

            vec2 translation = vec2(0, looped_time * -8.0);

            vec2 pos_idx = floor(uv * number_of_numbers + translation);
            float rnd_number = step(0.5, random01(pos_idx + floor(looped_time * number_change_rate)));
            float rnd_show = step(1.0 - amount_of_numbers, random01(pos_idx + vec2(99,99)));

            vec2 nuv = uv * number_of_numbers + translation;
            nuv = fract(nuv);

            float one = sdf_one(nuv - 0.5) * rnd_number;
            float zero = sdf_zero(nuv - 0.5) * (1.0 - rnd_number);
            float number = (one + zero) * rnd_show;

            float is_texture = 1.0 - number;
            float is_number = number;

            vec4 col = (texture_color * is_texture) + (number_color * is_number);

            gl_FragColor = col;
            gl_FragColor.w = 1.0;
        }
        `
    },
    "Flag":{
        "transparent": 0x00FF00,
        "duration": Math.PI,
        "vertex":`
        #version 100
        precision mediump float;

        attribute vec2 meshPosition;

        uniform vec2 resolution;
        uniform float time;

        varying vec2 _uv;

        void main()
        {
            _uv = (meshPosition + 1.0) / 2.0;
            _uv.y = 1.0 - _uv.y;
            gl_Position = vec4(meshPosition.x, meshPosition.y, 0.0, 1.0);
        }
        `,
        "fragment" :`
        #version 100
        precision mediump float;

        varying vec2 _uv;
        uniform sampler2D emote;
        uniform float time;

        float sin01(float value)
        {
            return (sin(value) + 1.0) / 2.0;
        }

        //pos is left bottom point.
        float sdf_rect(vec2 pos, vec2 size, vec2 uv)
        {
            float left = pos.x;
            float right = pos.x + size.x;
            float bottom = pos.y;
            float top = pos.y + size.y;
            return (step(bottom, uv.y) - step(top, uv.y)) * (step(left, uv.x) - step(right, uv.x)); 
        }

        void main() {
            float stick_width = 0.1;
            float flag_height = 0.75;
            float wave_size = 0.08;
            vec4 stick_color = vec4(107.0 / 256.0, 59.0 / 256.0, 9.0 / 256.0,1);
            
            vec2 flag_uv = _uv;
            flag_uv.x = (1.0 / (1.0 - stick_width)) * (flag_uv.x - stick_width);
            flag_uv.y *= 1.0 / flag_height;

            float flag_close_to_stick = smoothstep(0.0, 0.5, flag_uv.x);
            flag_uv.y += sin((-time * 2.0) + (flag_uv.x * 8.0)) * flag_close_to_stick * wave_size;

            float is_flag = sdf_rect(vec2(0,0), vec2(1.0, 1.0), flag_uv);
            float is_flag_stick = sdf_rect(vec2(0.0, 0.0), vec2(stick_width, 1), _uv);

            vec4 emote_color = texture2D(emote, flag_uv);
            vec4 texture_color = (emote_color * is_flag) + (stick_color * is_flag_stick);

            gl_FragColor = texture_color;
        }
        `
    }
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

function loadFilterProgram(gl, filter, vertexAttribs) {
    let vertexShader = compileShaderSource(gl, filter.vertex, gl.VERTEX_SHADER);
    let fragmentShader = compileShaderSource(gl, filter.fragment, gl.FRAGMENT_SHADER);
    let id = linkShaderProgram(gl, [vertexShader, fragmentShader], vertexAttribs);
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

window.onload = () => {
    const filtersSelect = document.getElementById("filters");
    for (let name in filters) {
        filtersSelect.add(new Option(name));
    }

    const vertexAttribs = {
        "meshPosition": 0
    };

    const canvas = document.getElementById("preview");
    const gl = canvas.getContext("webgl", {antialias: false, alpha: false});
    if (!gl) {
        throw new Error("Could not initialize WebGL context");
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let program = loadFilterProgram(gl, filters[filtersSelect.selectedOptions[0].value], vertexAttribs);

    filtersSelect.onchange = function() {
        gl.deleteProgram(program.id);
        program = loadFilterProgram(gl, filters[this.selectedOptions[0].value], vertexAttribs);
    };

    let gif = undefined;

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
        }

        document.ondragover = function(event) {
            event.preventDefault();
        }

        const renderButton = document.querySelector("#render");
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

        gl.clearColor(0.0, 1.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, TRIANGLE_PAIR * TRIANGLE_VERTICIES);

        window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
}
