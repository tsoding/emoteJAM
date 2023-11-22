"use strict";
var filters = {
    "Hop": {
        "transparent": 0x00FF00 + "",
        "duration": "interval * 2",
        "params": {
            "interval": {
                "label": "Interval",
                "type": "float",
                "init": 0.85,
                "min": 0.01,
                "max": 2.00,
                "step": 0.01
            },
            "ground": {
                "label": "Ground",
                "type": "float",
                "init": 0.5,
                "min": -1.0,
                "max": 1.0,
                "step": 0.01
            },
            "scale": {
                "label": "Scale",
                "type": "float",
                "init": 0.40,
                "min": 0.0,
                "max": 1.0,
                "step": 0.01
            },
            "jump_height": {
                "label": "Jump Height",
                "type": "float",
                "init": 4.0,
                "min": 1.0,
                "max": 10.0,
                "step": 0.01
            },
            "hops": {
                "label": "Hops Count",
                "type": "float",
                "init": 2.0,
                "min": 1.0,
                "max": 5.0,
                "step": 1.0
            }
        },
        "vertex": "#version 100\nprecision mediump float;\n\nattribute vec2 meshPosition;\nuniform float time;\nuniform vec2 emoteSize;\n\nuniform float interval;\nuniform float ground;\nuniform float scale;\nuniform float jump_height;\nuniform float hops;\n\nvarying vec2 uv;\n\nfloat sliding_from_left_to_right(float time_interval) {\n    return (mod(time, time_interval) - time_interval * 0.5) / (time_interval * 0.5);\n}\n\nfloat flipping_directions(float time_interval) {\n    return 1.0 - 2.0 * mod(floor(time / time_interval), 2.0);\n}\n\nvoid main() {\n    float x_time_interval = interval;\n    float y_time_interval = x_time_interval / (2.0 * hops);\n    vec2 offset = vec2(\n        sliding_from_left_to_right(x_time_interval) * flipping_directions(x_time_interval) * (1.0 - scale),\n        ((sliding_from_left_to_right(y_time_interval) * flipping_directions(y_time_interval) + 1.0) / jump_height) - ground);\n\n    gl_Position = vec4(\n        meshPosition * scale + offset,\n        0.0,\n        1.0);\n\n    uv = (meshPosition + vec2(1.0, 1.0)) / 2.0;\n\n    uv.x = (flipping_directions(x_time_interval) + 1.0) / 2.0 - uv.x * flipping_directions(x_time_interval);\n}\n",
        "fragment": "#version 100\n\nprecision mediump float;\n\nuniform vec2 resolution;\nuniform float time;\n\nuniform sampler2D emote;\n\nvarying vec2 uv;\n\nvoid main() {\n    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));\n    gl_FragColor.w = floor(gl_FragColor.w + 0.5);\n}\n"
    },
    "Hopper": {
        "transparent": 0x00FF00 + "",
        "duration": "0.85",
        "vertex": "#version 100\nprecision mediump float;\n\nattribute vec2 meshPosition;\nuniform float time;\n\nvarying vec2 uv;\n\nfloat sliding_from_left_to_right(float time_interval) {\n    return (mod(time, time_interval) - time_interval * 0.5) / (time_interval * 0.5);\n}\n\nfloat flipping_directions(float time_interval) {\n    return 1.0 - 2.0 * mod(floor(time / time_interval), 2.0);\n}\n\nvoid main() {\n    float scale = 0.40;\n    float hops = 2.0;\n    float x_time_interval = 0.85 / 2.0;\n    float y_time_interval = x_time_interval / (2.0 * hops);\n    float height = 0.5;\n    vec2 offset = vec2(\n        sliding_from_left_to_right(x_time_interval) * flipping_directions(x_time_interval) * (1.0 - scale),\n        ((sliding_from_left_to_right(y_time_interval) * flipping_directions(y_time_interval) + 1.0) / 4.0) - height);\n\n    gl_Position = vec4(\n        meshPosition * scale + offset,\n        0.0,\n        1.0);\n\n    uv = (meshPosition + vec2(1.0, 1.0)) / 2.0;\n\n    uv.x = (flipping_directions(x_time_interval) + 1.0) / 2.0 - uv.x * flipping_directions(x_time_interval);\n}\n",
        "fragment": "#version 100\n\nprecision mediump float;\n\nuniform vec2 resolution;\nuniform float time;\n\nuniform sampler2D emote;\n\nvarying vec2 uv;\n\nvoid main() {\n    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));\n    gl_FragColor.w = floor(gl_FragColor.w + 0.5);\n}\n"
    },
    "Overheat": {
        "transparent": 0x00FF00 + "",
        "duration": "0.85 / 8.0 * 2.0",
        "vertex": "#version 100\nprecision mediump float;\n\nattribute vec2 meshPosition;\nuniform float time;\n\nvarying vec2 uv;\n\nfloat sliding_from_left_to_right(float time_interval) {\n    return (mod(time, time_interval) - time_interval * 0.5) / (time_interval * 0.5);\n}\n\nfloat flipping_directions(float time_interval) {\n    return 1.0 - 2.0 * mod(floor(time / time_interval), 2.0);\n}\n\nvoid main() {\n    float scale = 0.40;\n    float hops = 2.0;\n    float x_time_interval = 0.85 / 8.0;\n    float y_time_interval = x_time_interval / (2.0 * hops);\n    float height = 0.5;\n    vec2 offset = vec2(\n        sliding_from_left_to_right(x_time_interval) * flipping_directions(x_time_interval) * (1.0 - scale),\n        ((sliding_from_left_to_right(y_time_interval) * flipping_directions(y_time_interval) + 1.0) / 4.0) - height);\n\n    gl_Position = vec4(\n        meshPosition * scale + offset,\n        0.0,\n        1.0);\n\n    uv = (meshPosition + vec2(1.0, 1.0)) / 2.0;\n\n    uv.x = (flipping_directions(x_time_interval) + 1.0) / 2.0 - uv.x * flipping_directions(x_time_interval);\n}\n",
        "fragment": "#version 100\n\nprecision mediump float;\n\nuniform vec2 resolution;\nuniform float time;\n\nuniform sampler2D emote;\n\nvarying vec2 uv;\n\nvoid main() {\n    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y)) * vec4(1.0, 0.0, 0.0, 1.0);\n    gl_FragColor.w = floor(gl_FragColor.w + 0.5);\n}\n"
    },
    "Bounce": {
        "transparent": 0x00FF00 + "",
        "duration": "Math.PI / period",
        "params": {
            "period": {
                "type": "float",
                "init": 5.0,
                "min": 1.0,
                "max": 10.0,
                "step": 0.1
            },
            "scale": {
                "type": "float",
                "init": 0.30,
                "min": 0.0,
                "max": 1.0,
                "step": 0.01
            }
        },
        "vertex": "#version 100\nprecision mediump float;\n\nattribute vec2 meshPosition;\n\nuniform vec2 resolution;\nuniform float time;\n\nuniform float period;\nuniform float scale;\n\nvarying vec2 uv;\n\nvoid main() {\n    vec2 offset = vec2(0.0, (2.0 * abs(sin(time * period)) - 1.0) * (1.0 - scale));\n    gl_Position = vec4(meshPosition * scale + offset, 0.0, 1.0);\n    uv = (meshPosition + 1.0) / 2.0;\n}\n",
        "fragment": "\n#version 100\n\nprecision mediump float;\n\nuniform vec2 resolution;\nuniform float time;\n\nuniform sampler2D emote;\n\nvarying vec2 uv;\n\nvoid main() {\n    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));\n    gl_FragColor.w = floor(gl_FragColor.w + 0.5);\n}\n"
    },
    "Circle": {
        "transparent": 0x00FF00 + "",
        "duration": "Math.PI / 4.0",
        "vertex": "#version 100\nprecision mediump float;\n\nattribute vec2 meshPosition;\n\nuniform vec2 resolution;\nuniform float time;\n\nvarying vec2 uv;\n\nvec2 rotate(vec2 v, float a) {\n\tfloat s = sin(a);\n\tfloat c = cos(a);\n\tmat2 m = mat2(c, -s, s, c);\n\treturn m * v;\n}\n\nvoid main() {\n    float scale = 0.30;\n    float period_interval = 8.0;\n    float pi = 3.141592653589793238;\n    vec2 outer_circle = vec2(cos(period_interval * time), sin(period_interval * time)) * (1.0 - scale);\n    vec2 inner_circle = rotate(meshPosition * scale, (-period_interval * time) + pi / 2.0);\n    gl_Position = vec4(\n        inner_circle + outer_circle,\n        0.0,\n        1.0);\n    uv = (meshPosition + 1.0) / 2.0;\n}\n",
        "fragment": "\n#version 100\n\nprecision mediump float;\n\nuniform vec2 resolution;\nuniform float time;\n\nuniform sampler2D emote;\n\nvarying vec2 uv;\n\nvoid main() {\n    float speed = 1.0;\n    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));\n    gl_FragColor.w = floor(gl_FragColor.w + 0.5);\n}\n"
    },
    "Slide": {
        "transparent": 0x00FF00 + "",
        "duration": "0.85 * 2",
        "vertex": "#version 100\nprecision mediump float;\n\nattribute vec2 meshPosition;\nuniform float time;\n\nvarying vec2 uv;\n\nfloat sliding_from_left_to_right(float time_interval) {\n    return (mod(time, time_interval) - time_interval * 0.5) / (time_interval * 0.5);\n}\n\nfloat flipping_directions(float time_interval) {\n    return 1.0 - 2.0 * mod(floor(time / time_interval), 2.0);\n}\n\nvoid main() {\n    float scale = 0.40;\n    float hops = 2.0;\n    float x_time_interval = 0.85;\n    float y_time_interval = x_time_interval / (2.0 * hops);\n    float height = 0.5;\n    vec2 offset = vec2(\n        sliding_from_left_to_right(x_time_interval) * flipping_directions(x_time_interval) * (1.0 - scale),\n        - height);\n\n    gl_Position = vec4(\n        meshPosition * scale + offset,\n        0.0,\n        1.0);\n\n    uv = (meshPosition + vec2(1.0, 1.0)) / 2.0;\n\n    uv.x = (flipping_directions(x_time_interval) + 1.0) / 2.0 - uv.x * flipping_directions(x_time_interval);\n}\n",
        "fragment": "#version 100\n\nprecision mediump float;\n\nuniform vec2 resolution;\nuniform float time;\n\nuniform sampler2D emote;\n\nvarying vec2 uv;\n\nvoid main() {\n    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));\n    gl_FragColor.w = floor(gl_FragColor.w + 0.5);\n}\n"
    },
    "Laughing": {
        "transparent": 0x00FF00 + "",
        "duration": "Math.PI / 12.0",
        "vertex": "#version 100\nprecision mediump float;\n\nattribute vec2 meshPosition;\nuniform float time;\n\nvarying vec2 uv;\n\nvoid main() {\n    float a = 0.3;\n    float t = (sin(24.0 * time) * a + a) / 2.0;\n\n    gl_Position = vec4(\n        meshPosition - vec2(0.0, t),\n        0.0,\n        1.0);\n    uv = (meshPosition + vec2(1.0, 1.0)) / 2.0;\n}\n",
        "fragment": "#version 100\n\nprecision mediump float;\n\nuniform vec2 resolution;\nuniform float time;\n\nuniform sampler2D emote;\n\nvarying vec2 uv;\n\nvoid main() {\n    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));\n    gl_FragColor.w = floor(gl_FragColor.w + 0.5);\n}\n"
    },
    "Blob": {
        "transparent": 0x00FF00 + "",
        "duration": "Math.PI / 3",
        "vertex": "#version 100\n\nprecision mediump float;\n\nattribute vec2 meshPosition;\n\nuniform vec2 resolution;\nuniform float time;\n\nvarying vec2 uv;\n\nvoid main() {\n    float stretch = sin(6.0 * time) * 0.5 + 1.0;\n\n    vec2 offset = vec2(0.0, 1.0 - stretch);\n    gl_Position = vec4(\n        meshPosition * vec2(stretch, 2.0 - stretch) + offset,\n        0.0,\n        1.0);\n    uv = (meshPosition + vec2(1.0, 1.0)) / 2.0;\n}\n",
        "fragment": "#version 100\n\nprecision mediump float;\n\nuniform vec2 resolution;\nuniform float time;\n\nuniform sampler2D emote;\n\nvarying vec2 uv;\n\nvoid main() {\n    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));\n    gl_FragColor.w = floor(gl_FragColor.w + 0.5);\n}\n"
    },
    "Go": {
        "transparent": 0x00FF00 + "",
        "duration": "1 / 4",
        "vertex": "#version 100\nprecision mediump float;\n\nattribute vec2 meshPosition;\n\nuniform vec2 resolution;\nuniform float time;\n\nvarying vec2 uv;\n\nvoid main() {\n    gl_Position = vec4(meshPosition, 0.0, 1.0);\n    uv = (meshPosition + 1.0) / 2.0;\n}\n",
        "fragment": "\n#version 100\n\nprecision mediump float;\n\nuniform vec2 resolution;\nuniform float time;\n\nuniform sampler2D emote;\n\nvarying vec2 uv;\n\nfloat slide(float speed, float value) {\n    return mod(value - speed * time, 1.0);\n}\n\nvoid main() {\n    float speed = 4.0;\n    gl_FragColor = texture2D(emote, vec2(slide(speed, uv.x), 1.0 - uv.y));\n    gl_FragColor.w = floor(gl_FragColor.w + 0.5);\n}\n"
    },
    "Elevator": {
        "transparent": 0x00FF00 + "",
        "duration": "1 / 4",
        "vertex": "#version 100\nprecision mediump float;\n\nattribute vec2 meshPosition;\n\nuniform vec2 resolution;\nuniform float time;\n\nvarying vec2 uv;\n\nvoid main() {\n    gl_Position = vec4(meshPosition, 0.0, 1.0);\n    uv = (meshPosition + 1.0) / 2.0;\n}\n",
        "fragment": "\n#version 100\n\nprecision mediump float;\n\nuniform vec2 resolution;\nuniform float time;\n\nuniform sampler2D emote;\n\nvarying vec2 uv;\n\nfloat slide(float speed, float value) {\n    return mod(value - speed * time, 1.0);\n}\n\nvoid main() {\n    float speed = 4.0;\n    gl_FragColor = texture2D(\n        emote,\n        vec2(uv.x, slide(speed, 1.0 - uv.y)));\n    gl_FragColor.w = floor(gl_FragColor.w + 0.5);\n}\n"
    },
    "Rain": {
        "transparent": 0x00FF00 + "",
        "duration": "1",
        "vertex": "#version 100\nprecision mediump float;\n\nattribute vec2 meshPosition;\n\nuniform vec2 resolution;\nuniform float time;\n\nvarying vec2 uv;\n\nvoid main() {\n    gl_Position = vec4(meshPosition, 0.0, 1.0);\n    uv = (meshPosition + 1.0) / 2.0;\n}\n",
        "fragment": "\n#version 100\n\nprecision mediump float;\n\nuniform vec2 resolution;\nuniform float time;\n\nuniform sampler2D emote;\n\nvarying vec2 uv;\n\nfloat slide(float speed, float value) {\n    return mod(value - speed * time, 1.0);\n}\n\nvoid main() {\n    float speed = 1.0;\n    gl_FragColor = texture2D(\n        emote,\n        vec2(mod(4.0 * slide(speed, uv.x), 1.0),\n             mod(4.0 * slide(speed, 1.0 - uv.y), 1.0)));\n    gl_FragColor.w = floor(gl_FragColor.w + 0.5);\n}\n"
    },
    "Pride": {
        "transparent": null,
        "duration": "2.0",
        "vertex": "#version 100\nprecision mediump float;\n\nattribute vec2 meshPosition;\n\nuniform vec2 resolution;\nuniform float time;\n\nvarying vec2 uv;\n\nvoid main() {\n    gl_Position = vec4(meshPosition, 0.0, 1.0);\n    uv = (meshPosition + 1.0) / 2.0;\n}\n",
        "fragment": "\n#version 100\n\nprecision mediump float;\n\nuniform vec2 resolution;\nuniform float time;\n\nuniform sampler2D emote;\n\nvarying vec2 uv;\n\nvec3 hsl2rgb(vec3 c) {\n    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);\n    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));\n}\n\nvoid main() {\n    float speed = 1.0;\n\n    vec4 pixel = texture2D(emote, vec2(uv.x, 1.0 - uv.y));\n    pixel.w = floor(pixel.w + 0.5);\n    pixel = vec4(mix(vec3(1.0), pixel.xyz, pixel.w), 1.0);\n    vec4 rainbow = vec4(hsl2rgb(vec3((time - uv.x - uv.y) * 0.5, 1.0, 0.80)), 1.0);\n    gl_FragColor = pixel * rainbow;\n}\n"
    },
    "Hard": {
        "transparent": 0x00FF00 + "",
        "duration": "2.0 * Math.PI / intensity",
        "params": {
            "zoom": {
                "type": "float",
                "init": 1.4,
                "min": 0.0,
                "max": 6.9,
                "step": 0.1
            },
            "intensity": {
                "type": "float",
                "init": 32.0,
                "min": 1.0,
                "max": 42.0,
                "step": 1.0
            },
            "amplitude": {
                "type": "float",
                "init": 1.0 / 8.0,
                "min": 0.0,
                "max": 1.0 / 2.0,
                "step": 0.001
            }
        },
        "vertex": "#version 100\nprecision mediump float;\n\nattribute vec2 meshPosition;\n\nuniform vec2 resolution;\nuniform float time;\n\nuniform float zoom;\nuniform float intensity;\nuniform float amplitude;\n\nvarying vec2 uv;\n\nvoid main() {\n    vec2 shaking = vec2(cos(intensity * time), sin(intensity * time)) * amplitude;\n    gl_Position = vec4(meshPosition * zoom + shaking, 0.0, 1.0);\n    uv = (meshPosition + 1.0) / 2.0;\n}\n",
        "fragment": "\n#version 100\n\nprecision mediump float;\n\nuniform vec2 resolution;\nuniform float time;\n\nuniform sampler2D emote;\n\nvarying vec2 uv;\n\nvoid main() {\n    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));\n    gl_FragColor.w = floor(gl_FragColor.w + 0.5);\n}\n"
    },
    "Peek": {
        "transparent": 0x00FF00 + "",
        "duration": "2.0 * Math.PI",
        "vertex": "#version 100\nprecision mediump float;\n\nattribute vec2 meshPosition;\n\nuniform vec2 resolution;\nuniform float time;\n\nvarying vec2 uv;\n\nvoid main() {\n    float time_clipped= mod(time * 2.0, (4.0 * 3.14));\n\n    float s1 = float(time_clipped < (2.0 * 3.14));\n    float s2 = 1.0 - s1;\n\n    float hold1 = float(time_clipped > (0.5 * 3.14) && time_clipped < (2.0 * 3.14));\n    float hold2 = 1.0 - float(time_clipped > (2.5 * 3.14) && time_clipped < (4.0 * 3.14));\n\n    float cycle_1 = 1.0 - ((s1 * sin(time_clipped) * (1.0 - hold1)) + hold1);\n    float cycle_2 = s2 * hold2 * (sin(time_clipped) - 1.0); \n\n    gl_Position = vec4(meshPosition.x + 1.0 + cycle_1 + cycle_2 , meshPosition.y, 0.0, 1.0);\n    uv = (meshPosition + 1.0) / 2.0;\n}\n",
        "fragment": "\n#version 100\n\nprecision mediump float;\n\nuniform vec2 resolution;\nuniform float time;\n\nuniform sampler2D emote;\n\nvarying vec2 uv;\n\nvoid main() {\n    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));\n    gl_FragColor.w = floor(gl_FragColor.w + 0.5);\n}\n"
    },
    "Matrix": {
        "transparent": null,
        "duration": "3.0",
        "vertex": "\n        #version 100\n        precision mediump float;\n\n        attribute vec2 meshPosition;\n\n        uniform vec2 resolution;\n        uniform float time;\n\n        varying vec2 _uv;\n\n        void main()\n        {\n            _uv = (meshPosition + 1.0) / 2.0;\n            gl_Position = vec4(meshPosition.x, meshPosition.y, 0.0, 1.0);\n        }\n        ",
        "fragment": "\n        #version 100\n        precision mediump float;\n\n        uniform vec2 resolution;\n        uniform float time;\n        uniform sampler2D emote;\n\n        varying vec2 _uv;\n\n        float clamp01(float value)\n        {\n            return clamp(value, 0.0, 1.0);\n        }\n\n        float sdf_zero(vec2 uv)\n        {\n            float inside = step(0.15, abs(uv.x)) + step(0.3, abs(uv.y));\n            float outside = step(0.35, abs(uv.x)) + step(0.4, abs(uv.y));\n            return clamp01(inside) - clamp01(outside);\n        }\n\n        float sdf_one(vec2 uv)\n        {\n            float top = step(0.25, -uv.y) * step(0.0, uv.x);\n            float inside = (step(0.2, uv.x) + top);\n            float outside = step(0.35, abs(uv.x)) + step(0.4, abs(uv.y));\n            return clamp01(clamp01(inside) - clamp01(outside));\n        }\n\n        // Random float. No precomputed gradients mean this works for any number of grid coordinates\n        float random01(vec2 n)\n        {\n            float random = 2920.0 * sin(n.x * 21942.0 + n.y * 171324.0 + 8912.0) *\n             cos(n.x * 23157.0 * n.y * 217832.0 + 9758.0);\n        \n            return (sin(random) + 1.0) / 2.0;\n        }\n\n        float loop_time(float time_frame)\n        {\n            float times = floor(time / time_frame);\n            return time - (times * time_frame);\n        }\n\n        void main()\n        {\n            vec2 uv = _uv;\n            uv.y = 1.0 - _uv.y;\n            \n            float number_of_numbers = 8.0;\n            float number_change_rate = 2.0;\n            float amount_of_numbers = 0.6; // from 0 - 1\n            \n            vec4 texture_color = texture2D(emote, uv);\n            vec4 number_color = vec4(0, 0.7, 0, 1);\n\n            float looped_time = loop_time(3.0); \n\n            vec2 translation = vec2(0, looped_time * -8.0);\n\n            vec2 pos_idx = floor(uv * number_of_numbers + translation);\n            float rnd_number = step(0.5, random01(pos_idx + floor(looped_time * number_change_rate)));\n            float rnd_show = step(1.0 - amount_of_numbers, random01(pos_idx + vec2(99,99)));\n\n            vec2 nuv = uv * number_of_numbers + translation;\n            nuv = fract(nuv);\n\n            float one = sdf_one(nuv - 0.5) * rnd_number;\n            float zero = sdf_zero(nuv - 0.5) * (1.0 - rnd_number);\n            float number = (one + zero) * rnd_show;\n\n            float is_texture = 1.0 - number;\n            float is_number = number;\n\n            vec4 col = (texture_color * is_texture) + (number_color * is_number);\n\n            gl_FragColor = col;\n            gl_FragColor.w = 1.0;\n        }\n        "
    },
    "Flag": {
        "transparent": 0x00FF00 + "",
        "duration": "Math.PI",
        "vertex": "\n        #version 100\n        precision mediump float;\n\n        attribute vec2 meshPosition;\n\n        uniform vec2 resolution;\n        uniform float time;\n\n        varying vec2 _uv;\n\n        void main()\n        {\n            _uv = (meshPosition + 1.0) / 2.0;\n            _uv.y = 1.0 - _uv.y;\n            gl_Position = vec4(meshPosition.x, meshPosition.y, 0.0, 1.0);\n        }\n        ",
        "fragment": "\n        #version 100\n        precision mediump float;\n\n        varying vec2 _uv;\n        uniform sampler2D emote;\n        uniform float time;\n\n        float sin01(float value)\n        {\n            return (sin(value) + 1.0) / 2.0;\n        }\n\n        //pos is left bottom point.\n        float sdf_rect(vec2 pos, vec2 size, vec2 uv)\n        {\n            float left = pos.x;\n            float right = pos.x + size.x;\n            float bottom = pos.y;\n            float top = pos.y + size.y;\n            return (step(bottom, uv.y) - step(top, uv.y)) * (step(left, uv.x) - step(right, uv.x)); \n        }\n\n        void main() {\n            float stick_width = 0.1;\n            float flag_height = 0.75;\n            float wave_size = 0.08;\n            vec4 stick_color = vec4(107.0 / 256.0, 59.0 / 256.0, 9.0 / 256.0,1);\n            \n            vec2 flag_uv = _uv;\n            flag_uv.x = (1.0 / (1.0 - stick_width)) * (flag_uv.x - stick_width);\n            flag_uv.y *= 1.0 / flag_height;\n\n            float flag_close_to_stick = smoothstep(0.0, 0.5, flag_uv.x);\n            flag_uv.y += sin((-time * 2.0) + (flag_uv.x * 8.0)) * flag_close_to_stick * wave_size;\n\n            float is_flag = sdf_rect(vec2(0,0), vec2(1.0, 1.0), flag_uv);\n            float is_flag_stick = sdf_rect(vec2(0.0, 0.0), vec2(stick_width, 1), _uv);\n\n            vec4 emote_color = texture2D(emote, flag_uv);\n            vec4 texture_color = (emote_color * is_flag) + (stick_color * is_flag_stick);\n\n            gl_FragColor = texture_color;\n        }\n        "
    },
    "Thanosed": {
        "transparent": 0x00FF00 + "",
        "duration": "duration",
        "params": {
            "duration": {
                "type": "float",
                "init": 6.0,
                "min": 1.0,
                "max": 16.0,
                "step": 1.0
            },
            "delay": {
                "type": "float",
                "init": 0.2,
                "min": 0.0,
                "max": 1.0,
                "step": 0.1
            },
            "pixelization": {
                "type": "float",
                "init": 1.0,
                "min": 1.0,
                "max": 3.0,
                "step": 1.0
            }
        },
        "vertex": "#version 100\nprecision mediump float;\n\nattribute vec2 meshPosition;\n\nuniform vec2 resolution;\nuniform float time;\n\nvarying vec2 uv;\n\nvoid main() {\n    gl_Position = vec4(meshPosition, 0.0, 1.0);\n    uv = (meshPosition + 1.0) / 2.0;\n}\n",
        "fragment": "\n#version 100\n\nprecision mediump float;\n\nuniform vec2 resolution;\nuniform float time;\nuniform float duration;\nuniform float delay;\nuniform float pixelization;\n\nuniform sampler2D emote;\n\nvarying vec2 uv;\n\n// https://www.aussiedwarf.com/2017/05/09/Random10Bit.html\nfloat rand(vec2 co){\n  vec3 product = vec3(  sin( dot(co, vec2(0.129898,0.78233))),\n                        sin( dot(co, vec2(0.689898,0.23233))),\n                        sin( dot(co, vec2(0.434198,0.51833))) );\n  vec3 weighting = vec3(4.37585453723, 2.465973, 3.18438);\n  return fract(dot(weighting, product));\n}\n\nvoid main() {\n    float pixelated_resolution = 112.0 / pixelization;\n    vec2 pixelated_uv = floor(uv * pixelated_resolution);\n    float noise = (rand(pixelated_uv) + 1.0) / 2.0;\n    float slope = (0.2 + noise * 0.8) * (1.0 - (0.0 + uv.x * 0.5));\n    float time_interval = 1.1 + delay * 2.0;\n    float progress = 0.2 + delay + slope - mod(time_interval * time / duration, time_interval);\n    float mask = progress > 0.1 ? 1.0 : 0.0;\n    vec4 pixel = texture2D(emote, vec2(uv.x * (progress > 0.5 ? 1.0 : progress * 2.0), 1.0 - uv.y));\n    pixel.w = floor(pixel.w + 0.5);\n    gl_FragColor = pixel * vec4(vec3(1.0), mask);\n}\n"
    },
    "Ripple": {
        "transparent": 0x00FF00 + "",
        "duration": "2 * Math.PI / b",
        "params": {
            "a": {
                "label": "Wave Length",
                "type": "float",
                "init": 12.0,
                "min": 0.01,
                "max": 24.0,
                "step": 0.01
            },
            "b": {
                "label": "Time Freq",
                "type": "float",
                "init": 4.0,
                "min": 0.01,
                "max": 8.0,
                "step": 0.01
            },
            "c": {
                "label": "Amplitude",
                "type": "float",
                "init": 0.03,
                "min": 0.01,
                "max": 0.06,
                "step": 0.01
            }
        },
        "vertex": "#version 100\nprecision mediump float;\n\nattribute vec2 meshPosition;\n\nuniform vec2 resolution;\nuniform float time;\n\nvarying vec2 uv;\n\nvoid main() {\n    gl_Position = vec4(meshPosition, 0.0, 1.0);\n    uv = (meshPosition + 1.0) / 2.0;\n}\n",
        "fragment": "#version 100\n\nprecision mediump float;\n\nuniform vec2 resolution;\nuniform float time;\n\nuniform sampler2D emote;\n\nuniform float a;\nuniform float b;\nuniform float c;\n\nvarying vec2 uv;\n\nvoid main() {\n    vec2 pos = vec2(uv.x, 1.0 - uv.y);\n    vec2 center = vec2(0.5);\n    vec2 dir = pos - center;\n    float x = length(dir);\n    float y = sin(x + time);\n    vec4 pixel = texture2D(emote, pos + cos(x*a - time*b)*c*(dir/x));\n    gl_FragColor = pixel;\n    gl_FragColor.w = floor(gl_FragColor.w + 0.5);\n}\n"
    }
};
