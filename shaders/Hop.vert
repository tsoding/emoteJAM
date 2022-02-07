#version 100
precision mediump float;

attribute vec2 meshPosition;
uniform float time;
uniform vec2 emoteSize;

uniform float interval;
uniform float ground;
uniform float scale;
uniform float jump_height;
uniform float hops;

varying vec2 uv;

float sliding_from_left_to_right(float time_interval) {
    return (mod(time, time_interval) - time_interval * 0.5) / (time_interval * 0.5);
}

float flipping_directions(float time_interval) {
    return 1.0 - 2.0 * mod(floor(time / time_interval), 2.0);
}

void main() {
    float x_time_interval = interval;
    float y_time_interval = x_time_interval / (2.0 * hops);
    vec2 offset = vec2(
        sliding_from_left_to_right(x_time_interval) * flipping_directions(x_time_interval) * (1.0 - scale),
        ((sliding_from_left_to_right(y_time_interval) * flipping_directions(y_time_interval) + 1.0) / jump_height) - ground);

    gl_Position = vec4(
        meshPosition * scale + offset,
        0.0,
        1.0);

    uv = (meshPosition + vec2(1.0, 1.0)) / 2.0;

    uv.x = (flipping_directions(x_time_interval) + 1.0) / 2.0 - uv.x * flipping_directions(x_time_interval);
}
