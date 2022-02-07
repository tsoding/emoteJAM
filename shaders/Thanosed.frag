
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
