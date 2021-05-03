#version 100
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