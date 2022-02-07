
        #version 100
        precision mediump float;

        varying vec2 _uv;
        uniform sampler2D emote;
        uniform float time;

        float sin01(float value)
        {
            return (sin(value) + 1.0) / 2.0;
        }

        //pos is left bottom point.
        float sdf_rect(vec2 pos, vec2 size, vec2 uv)
        {
            float left = pos.x;
            float right = pos.x + size.x;
            float bottom = pos.y;
            float top = pos.y + size.y;
            return (step(bottom, uv.y) - step(top, uv.y)) * (step(left, uv.x) - step(right, uv.x)); 
        }

        void main() {
            float stick_width = 0.1;
            float flag_height = 0.75;
            float wave_size = 0.08;
            vec4 stick_color = vec4(107.0 / 256.0, 59.0 / 256.0, 9.0 / 256.0,1);
            
            vec2 flag_uv = _uv;
            flag_uv.x = (1.0 / (1.0 - stick_width)) * (flag_uv.x - stick_width);
            flag_uv.y *= 1.0 / flag_height;

            float flag_close_to_stick = smoothstep(0.0, 0.5, flag_uv.x);
            flag_uv.y += sin((-time * 2.0) + (flag_uv.x * 8.0)) * flag_close_to_stick * wave_size;

            float is_flag = sdf_rect(vec2(0,0), vec2(1.0, 1.0), flag_uv);
            float is_flag_stick = sdf_rect(vec2(0.0, 0.0), vec2(stick_width, 1), _uv);

            vec4 emote_color = texture2D(emote, flag_uv);
            vec4 texture_color = (emote_color * is_flag) + (stick_color * is_flag_stick);

            gl_FragColor = texture_color;
        }
        