type Pretext = 'over' | 'in' | 'out' | 'atop';
type Noun = 'source' | 'destination';

interface CanvasRenderingContext2D {
    globalCompositeOperation:
        `${Noun}-${Pretext}`
        | 'lighter'
        | 'copy'
        | 'xor'
        | 'multiply'
        | 'screen'
        | 'overlay'
        | 'darken'
        | 'lighten'
        | 'color-dodge'
        | 'color-burn'
        | 'hard-light'
        | 'soft-light'
        | 'difference'
        | 'exclusion'
        | 'hue'
        | 'saturation'
        | 'color'
        | 'luminosity';
}
