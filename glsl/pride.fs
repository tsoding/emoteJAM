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
