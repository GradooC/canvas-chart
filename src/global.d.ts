type Pretext = 'over' | 'in' | 'out' | 'atop';
type Noun = 'source' | 'destination';

interface CanvasRenderingContext2D {
    globalCompositeOperation:
        | `${Noun}-${Pretext}`
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

declare module '*.json' {

    type InputData = {
        columns: [string, ...number[]][];
        types: {
            x: string;
            y0: string;
            y1: string;
        };
        names: {
            y0: string;
            y1: string;
        };
        colors: {
            y0: string;
            y1: string;
        };
    };
    const data: InputData;
    export type { InputData };
    export default data;
}

declare module '*.html' {
    const template: string;
    export default template;
}
