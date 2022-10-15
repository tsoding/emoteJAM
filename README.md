# emoteJAM

`emoteJAM` is a simple website that generates animated [BTTV](https://betterttv.com/) emotes from static images.

That idea is to apply a well established "meme meta filters" to static emotes. Such as [JAM](https://betterttv.com/emotes/5b77ac3af7bddc567b1d5fb2), [Hop](https://betterttv.com/emotes/5a9578d6dcf3205f57ba294f), etc.

The most important feature of the website is that it's completely client-side and can be easily deployed to something like [GitHub Pages](https://pages.github.com/). It uses [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) to animate static images and [gif.js](https://jnordberg.github.io/gif.js/) to generate actual GIF files inside of your browser.

Official Deployed Instance: [https://tsoding.github.io/emoteJAM/](https://tsoding.github.io/emoteJAM/)

## Running Locally

Nothing particularly special is required. Just serve the folder using HTTP server like Python's SimpleHTTPServer:

```console
$ python3 -m http.server 6969
$ iexplore.exe http://localhost:6969/
```

## Development Workflow

1. `$ npm install`
2. `$ ./node_modules/.bin/tsc -w`
3. `<edit files>`

Make sure that you commit the generated `js/*` files along with your changes. This is important for the project to retain that "Just deploy the repo" attitude.

# Filter Development

**WARNING! Knowledge of [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) or [OpenGL](https://www.opengl.org/) is required to read this section!**

## Uniforms

| Name | Type | Description |
| --- | --- | --- |
| `time` | `float` | Current time in Seconds (float) since the start of the application. Can be used for animating. |
| `resolution` | `vec2` | Resolution of the emote canvas in Pixels. |
| `emote` | `sampler2D` | The input image as the WebGL texture. |
| `emoteSize` | `vec2` | The input image size in pixels. |
