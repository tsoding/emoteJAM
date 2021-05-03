#version 100
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
