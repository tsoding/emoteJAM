#version 100
precision mediump float;

attribute vec2 meshPosition;

uniform vec2 resolution;
uniform float time;

uniform float period;
uniform float scale;

varying vec2 uv;

void main() {
    vec2 offset = vec2(0.0, (2.0 * abs(sin(time * period)) - 1.0) * (1.0 - scale));
    gl_Position = vec4(meshPosition * scale + offset, 0.0, 1.0);
    uv = (meshPosition + 1.0) / 2.0;
}
