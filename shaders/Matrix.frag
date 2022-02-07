
        #version 100
        precision mediump float;

        uniform vec2 resolution;
        uniform float time;
        uniform sampler2D emote;

        varying vec2 _uv;

        float clamp01(float value)
        {
            return clamp(value, 0.0, 1.0);
        }

        float sdf_zero(vec2 uv)
        {
            float inside = step(0.15, abs(uv.x)) + step(0.3, abs(uv.y));
            float outside = step(0.35, abs(uv.x)) + step(0.4, abs(uv.y));
            return clamp01(inside) - clamp01(outside);
        }

        float sdf_one(vec2 uv)
        {
            float top = step(0.25, -uv.y) * step(0.0, uv.x);
            float inside = (step(0.2, uv.x) + top);
            float outside = step(0.35, abs(uv.x)) + step(0.4, abs(uv.y));
            return clamp01(clamp01(inside) - clamp01(outside));
        }

        // Random float. No precomputed gradients mean this works for any number of grid coordinates
        float random01(vec2 n)
        {
            float random = 2920.0 * sin(n.x * 21942.0 + n.y * 171324.0 + 8912.0) *
             cos(n.x * 23157.0 * n.y * 217832.0 + 9758.0);
        
            return (sin(random) + 1.0) / 2.0;
        }

        float loop_time(float time_frame)
        {
            float times = floor(time / time_frame);
            return time - (times * time_frame);
        }

        void main()
        {
            vec2 uv = _uv;
            uv.y = 1.0 - _uv.y;
            
            float number_of_numbers = 8.0;
            float number_change_rate = 2.0;
            float amount_of_numbers = 0.6; // from 0 - 1
            
            vec4 texture_color = texture2D(emote, uv);
            vec4 number_color = vec4(0, 0.7, 0, 1);

            float looped_time = loop_time(3.0); 

            vec2 translation = vec2(0, looped_time * -8.0);

            vec2 pos_idx = floor(uv * number_of_numbers + translation);
            float rnd_number = step(0.5, random01(pos_idx + floor(looped_time * number_change_rate)));
            float rnd_show = step(1.0 - amount_of_numbers, random01(pos_idx + vec2(99,99)));

            vec2 nuv = uv * number_of_numbers + translation;
            nuv = fract(nuv);

            float one = sdf_one(nuv - 0.5) * rnd_number;
            float zero = sdf_zero(nuv - 0.5) * (1.0 - rnd_number);
            float number = (one + zero) * rnd_show;

            float is_texture = 1.0 - number;
            float is_number = number;

            vec4 col = (texture_color * is_texture) + (number_color * is_number);

            gl_FragColor = col;
            gl_FragColor.w = 1.0;
        }
        