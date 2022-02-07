#version 100

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