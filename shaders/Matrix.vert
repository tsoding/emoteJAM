
        #version 100
        precision mediump float;

        attribute vec2 meshPosition;

        uniform vec2 resolution;
        uniform float time;

        varying vec2 _uv;

        void main()
        {
            _uv = (meshPosition + 1.0) / 2.0;
            gl_Position = vec4(meshPosition.x, meshPosition.y, 0.0, 1.0);
        }
        