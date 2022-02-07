
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
