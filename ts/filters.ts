interface Param {
    label?: string,
    type: string,
    init: number,
    min?: number,
    max?: number,
    step?: number,
}

interface Filter {
    transparent: string | null,
    duration: string,
    params?: {
        [name: string]: Param
    },
    vertex: string | VertexShaderFetcher,
    fragment: string | FragmentShaderFetcher
}

// TODO(#58): add params to all of the filters
// TODO(#61): human readable titles for the filter params
const filters: {[name: string]: Filter} = {
    "Hop": {
        "transparent": 0x00FF00 + "",
        "duration": "interval * 2",
        // TODO(#62): when you have too many params the UI gets really cluttered
        "params": {
            // TODO(#65): filter params should have help tooltips associated with them
            "interval": {
                "label": "Interval",
                "type": "float",
                "init": 0.85,
                "min": 0.01,
                "max": 2.00,
                "step": 0.01,
            },
            "ground": {
                "label": "Ground",
                "type": "float",
                "init": 0.5,
                "min": -1.0,
                "max": 1.0,
                "step": 0.01,
            },
            "scale": {
                "label": "Scale",
                "type": "float",
                "init": 0.40,
                "min": 0.0,
                "max": 1.0,
                "step": 0.01,
            },
            // TODO(#63): jump_height in the "Hop" filter does not make any sense
            // If it's bigger the emote should jump higher. Right now it is the other way around.
            "jump_height": {
                "label": "Jump Height",
                "type": "float",
                "init": 4.0,
                "min": 1.0,
                "max": 10.0,
                "step": 0.01,
            },
            "hops": {
                "label": "Hops Count",
                "type": "float",
                "init": 2.0,
                "min": 1.0,
                "max": 5.0,
                "step": 1.0,
            }
        },
        "vertex": new VertexShaderFetcher("Hop"),
        "fragment": new FragmentShaderFetcher("Hop"),
    },
    "Hopper": {
        "transparent": 0x00FF00 + "",
        "duration": "0.85",
        "vertex": new VertexShaderFetcher("Hopper"),
        "fragment": new FragmentShaderFetcher("Hopper"),
    },
    "Overheat": {
        "transparent": 0x00FF00 + "",
        "duration": "0.85 / 8.0 * 2.0",
        "vertex": new VertexShaderFetcher("Overheat"),
        "fragment": new FragmentShaderFetcher("Overheat"),
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
                "step": 0.1,
            },
            "scale": {
                "type": "float",
                "init": 0.30,
                "min": 0.0,
                "max": 1.0,
                "step": 0.01,
            }
        },
        "vertex": new VertexShaderFetcher("Bounce"),
        "fragment": new FragmentShaderFetcher("Bounce"),
    },
    "Circle": {
        "transparent": 0x00FF00 + "",
        "duration": "Math.PI / 4.0",
        "vertex": new VertexShaderFetcher("Circle"),
        "fragment": new FragmentShaderFetcher("Circle"),
    },
    "Slide": {
        "transparent": 0x00FF00 + "",
        "duration": "0.85 * 2",
        "vertex": new VertexShaderFetcher("Slide"),
        "fragment": new FragmentShaderFetcher("Slide"),
    },
    "Laughing": {
        "transparent": 0x00FF00 + "",
        "duration": "Math.PI / 12.0",
        "vertex": new VertexShaderFetcher("Laughing"),
        "fragment": new FragmentShaderFetcher("Laughing"),
    },
    "Blob": {
        "transparent": 0x00FF00 + "",
        "duration": "Math.PI / 3",
        "vertex": new VertexShaderFetcher("Blob"),
        "fragment": new FragmentShaderFetcher("Blob"),
    },
    "Go": {
        "transparent": 0x00FF00 + "",
        "duration": "1 / 4",
        "vertex": new VertexShaderFetcher("Go"),
        "fragment": new FragmentShaderFetcher("Go"),
    },
    "Elevator": {
        "transparent": 0x00FF00 + "",
        "duration": "1 / 4",
        "vertex": new VertexShaderFetcher("Elevator"),
        "fragment": new FragmentShaderFetcher("Elevator"),
    },
    "Rain": {
        "transparent": 0x00FF00 + "",
        "duration": "1",
        "vertex": new VertexShaderFetcher("Rain"),
        "fragment": new FragmentShaderFetcher("Rain"),
    },
    "Pride": {
        "transparent": null,
        "duration": "2.0",
        "vertex": new VertexShaderFetcher("Pride"),
        "fragment": new FragmentShaderFetcher("Pride"),
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
                "step": 0.1,
            },
            "intensity": {
                "type": "float",
                "init": 32.0,
                "min": 1.0,
                "max": 42.0,
                "step": 1.0,
            },
            "amplitude": {
                "type": "float",
                "init": 1.0 / 8.0,
                "min": 0.0,
                "max": 1.0 / 2.0,
                "step": 0.001,
            },
        },
        "vertex": new VertexShaderFetcher("Hard"),
        "fragment": new FragmentShaderFetcher("Hard"),
    },
	"Peek":{
        "transparent": 0x00FF00 + "",
        "duration": "2.0 * Math.PI" ,
        "vertex": new VertexShaderFetcher("Peek"),
        "fragment": new FragmentShaderFetcher("Peek"), 
	},
    "Matrix": {
        "transparent": null,
        "duration": "3.0",
        "vertex": new VertexShaderFetcher("Matrix"),
        "fragment": new FragmentShaderFetcher("Matrix"),
    },
    "Flag":{
        "transparent": 0x00FF00 + "",
        "duration": "Math.PI",
        "vertex": new VertexShaderFetcher("Flag"),
        "fragment": new FragmentShaderFetcher("Flag"),
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
                "step": 1.0,
            },
            "delay": {
                "type": "float",
                "init": 0.2,
                "min": 0.0,
                "max": 1.0,
                "step": 0.1,
            },
            "pixelization": {
                "type": "float",
                "init": 1.0,
                "min": 1.0,
                "max": 3.0,
                "step": 1.0,
            },
        },
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
uniform float duration;
uniform float delay;
uniform float pixelization;

uniform sampler2D emote;

varying vec2 uv;

// https://www.aussiedwarf.com/2017/05/09/Random10Bit.html
float rand(vec2 co){
  vec3 product = vec3(  sin( dot(co, vec2(0.129898,0.78233))),
                        sin( dot(co, vec2(0.689898,0.23233))),
                        sin( dot(co, vec2(0.434198,0.51833))) );
  vec3 weighting = vec3(4.37585453723, 2.465973, 3.18438);
  return fract(dot(weighting, product));
}

void main() {
    float pixelated_resolution = 112.0 / pixelization;
    vec2 pixelated_uv = floor(uv * pixelated_resolution);
    float noise = (rand(pixelated_uv) + 1.0) / 2.0;
    float slope = (0.2 + noise * 0.8) * (1.0 - (0.0 + uv.x * 0.5));
    float time_interval = 1.1 + delay * 2.0;
    float progress = 0.2 + delay + slope - mod(time_interval * time / duration, time_interval);
    float mask = progress > 0.1 ? 1.0 : 0.0;
    vec4 pixel = texture2D(emote, vec2(uv.x * (progress > 0.5 ? 1.0 : progress * 2.0), 1.0 - uv.y));
    pixel.w = floor(pixel.w + 0.5);
    gl_FragColor = pixel * vec4(vec3(1.0), mask);
}
`,
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
                "step": 0.01,
            },
            "b": {
                "label": "Time Freq",
                "type": "float",
                "init": 4.0,
                "min": 0.01,
                "max": 8.0,
                "step": 0.01,
            },
            "c": {
                "label": "Amplitude",
                "type": "float",
                "init": 0.03,
                "min": 0.01,
                "max": 0.06,
                "step": 0.01,
            }
        },
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
        "fragment": `#version 100

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D emote;

uniform float a;
uniform float b;
uniform float c;

varying vec2 uv;

void main() {
    vec2 pos = vec2(uv.x, 1.0 - uv.y);
    vec2 center = vec2(0.5);
    vec2 dir = pos - center;
    float x = length(dir);
    float y = sin(x + time);
    vec4 pixel = texture2D(emote, pos + cos(x*a - time*b)*c*(dir/x));
    gl_FragColor = pixel;
    gl_FragColor.w = floor(gl_FragColor.w + 0.5);
}
`,
    }
};
